'use client';

import React, { useState } from 'react';
import {
  X,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { BridgeAndExecuteButton } from '@avail-project/nexus-widgets';
import BridgeAndExecuteSection from '@/components/bridge/BridgeAndExecuteSection';

const AGENT_CONTRACT_ADDRESS =
  '0xb443CCbB2efEDf9be8Bb087e8cAA393E3faB55Db';
const SUBSCRIPTION_AMOUNT = '0.001'; // ETH
const TARGET_CHAIN_ID = 421614; // Arbitrum Sepolia

const getChainName = (chainId) => {
  const chainNames = {
    1: 'Ethereum',
    11155111: 'Ethereum Sepolia',
    421614: 'Arbitrum Sepolia',
    84532: 'Base Sepolia',
    80002: 'Polygon Amoy',
    11155420: 'Optimism Sepolia',
  };
  return chainNames[chainId] || `Chain ${chainId}`;
};

const getExplorerUrl = (chainId, txHash) => {
  const explorers = {
    1: `https://etherscan.io/tx/${txHash}`,
    11155111: `https://sepolia.etherscan.io/tx/${txHash}`,
    421614: `https://sepolia.arbiscan.io/tx/${txHash}`,
    84532: `https://sepolia.basescan.org/tx/${txHash}`,
    80002: `https://amoy.polygonscan.com/tx/${txHash}`,
    11155420: `https://sepolia-optimism.etherscan.io/tx/${txHash}`,
  };
  return explorers[chainId] || `https://etherscan.io/tx/${txHash}`;
};

export default function SubscribeModal({
  isOpen,
  onClose,
  agentId,
  agentName,
  subscriptionPrice,
}) {
  const { isConnected } = useAccount();
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('select'); // 'select' | 'success' | 'error'

  const handleClose = () => {
    setStep('select');
    setError(null);
    setTxHash(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-[#1C1F2B] rounded-3xl border border-[#50606C] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: '0 0 20px rgba(251, 237, 224, 0.1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#50606C]">
          <div>
            <h2
              className="text-2xl font-bold"
              style={{ color: '#FBede0' }}
            >
              Subscribe to {agentName}
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: 'rgba(251, 237, 224, 0.6)' }}
            >
              {subscriptionPrice} per month
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              backgroundColor: 'transparent',
              color: 'rgba(251, 237, 224, 0.8)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                'rgba(80, 96, 108, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!isConnected ? (
            <div className="text-center py-8">
              <AlertCircle
                className="w-12 h-12 mx-auto mb-4"
                style={{
                  color: 'rgba(251, 237, 224, 0.6)',
                }}
              />
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: '#FBede0' }}
              >
                Wallet Not Connected
              </h3>
              <p
                style={{
                  color: 'rgba(251, 237, 224, 0.6)',
                }}
              >
                Please connect your wallet to subscribe to this agent
              </p>
            </div>
          ) : step === 'select' ? (
            <div>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: '#FBede0' }}
              >
                Subscribe to {agentName}
              </h3>
              <p
                className="text-sm mb-6"
                style={{ color: 'rgba(251, 237, 224, 0.6)' }}
              >
                Pay {SUBSCRIPTION_AMOUNT} USDC to subscribe to this
                agent. The payment will be processed on{' '}
                {getChainName(TARGET_CHAIN_ID)}.
              </p>

              <div className="space-y-4 mb-6">
                <div
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: '#161823' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{
                        color: 'rgba(251, 237, 224, 0.7)',
                      }}
                    >
                      Agent
                    </span>
                    <span style={{ color: '#FBede0' }}>
                      {agentName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{
                        color: 'rgba(251, 237, 224, 0.7)',
                      }}
                    >
                      Price
                    </span>
                    <span style={{ color: '#FBede0' }}>
                      {SUBSCRIPTION_AMOUNT} USDC
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{
                        color: 'rgba(251, 237, 224, 0.7)',
                      }}
                    >
                      Destination
                    </span>
                    <span style={{ color: '#FBede0' }}>
                      {getChainName(TARGET_CHAIN_ID)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        color: 'rgba(251, 237, 224, 0.7)',
                      }}
                    >
                      Recipient
                    </span>
                    <span
                      style={{
                        color: '#FBede0',
                        fontSize: '12px',
                      }}
                    >
                      {AGENT_CONTRACT_ADDRESS.slice(0, 6)}...
                      {AGENT_CONTRACT_ADDRESS.slice(-4)}
                    </span>
                  </div>
                </div>
              </div>

              <BridgeAndExecuteSection>
                <BridgeAndExecuteButton
                  contractAddress={AGENT_CONTRACT_ADDRESS}
                  contractAbi={[
                    {
                      inputs: [
                        {
                          internalType: 'string',
                          name: 'agentId',
                          type: 'string',
                        },
                        {
                          internalType: 'string',
                          name: 'subscriptionType',
                          type: 'string',
                        },
                        {
                          internalType: 'uint256',
                          name: 'amountWei',
                          type: 'uint256',
                        },
                      ],
                      name: 'subscribe',
                      outputs: [],
                      stateMutability: 'payable',
                      type: 'function',
                    },
                  ]}
                  functionName="subscribe"
                  buildFunctionParams={(
                    _token,
                    amount,
                    _chainId,
                    _userAddress
                  ) => {
                    const amountWei = parseEther(amount);
                    return {
                      functionParams: [
                        agentId,
                        'monthly',
                        amountWei,
                      ],
                    };
                  }}
                  prefill={{
                    toChainId: TARGET_CHAIN_ID,
                    token: 'ETH',
                    amount: SUBSCRIPTION_AMOUNT,
                  }}
                >
                  {({ onClick, isLoading, disabled }) => (
                    <button
                      onClick={onClick}
                      disabled={disabled || isLoading}
                      className="w-full px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: isLoading
                          ? 'rgba(251, 237, 224, 0.3)'
                          : '#FBede0',
                        color: '#161823',
                        cursor: disabled
                          ? 'not-allowed'
                          : 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        if (!disabled && !isLoading) {
                          e.currentTarget.style.backgroundColor =
                            '#e8d4c5';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!disabled && !isLoading) {
                          e.currentTarget.style.backgroundColor =
                            '#FBede0';
                        }
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Subscribe & Pay{' '}
                          {SUBSCRIPTION_AMOUNT} USDC
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </BridgeAndExecuteButton>
              </BridgeAndExecuteSection>
            </div>
          ) : step === 'success' ? (
            <div className="text-center py-8">
              <CheckCircle
                className="w-12 h-12 mx-auto mb-4"
                style={{ color: '#10b981' }}
              />
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: '#FBede0' }}
              >
                Subscription Successful!
              </h3>
              <p
                className="mb-4"
                style={{
                  color: 'rgba(251, 237, 224, 0.6)',
                }}
              >
                You are now subscribed to {agentName}
              </p>
              {txHash && (
                <p
                  className="text-sm"
                  style={{
                    color: 'rgba(251, 237, 224, 0.5)',
                  }}
                >
                  Transaction:{' '}
                  <a
                    href={getExplorerUrl(
                      TARGET_CHAIN_ID,
                      txHash
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {txHash.slice(0, 10)}...
                    {txHash.slice(-8)}
                  </a>
                </p>
              )}
              <button
                onClick={handleClose}
                className="mt-6 px-6 py-3 rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: '#FBede0',
                  color: '#161823',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    '#e8d4c5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    '#FBede0';
                }}
              >
                Close
              </button>
            </div>
          ) : step === 'error' ? (
            <div className="text-center py-8">
              <AlertCircle
                className="w-12 h-12 mx-auto mb-4"
                style={{ color: '#ef4444' }}
              />
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: '#FBede0' }}
              >
                Subscription Failed
              </h3>
              <p
                className="mb-4"
                style={{
                  color: 'rgba(251, 237, 224, 0.6)',
                }}
              >
                {error ||
                  'An error occurred during the subscription process'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('select')}
                  className="flex-1 px-6 py-3 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #50606C',
                    color: '#FBede0',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'rgba(80, 96, 108, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'transparent';
                  }}
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: '#FBede0',
                    color: '#161823',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      '#e8d4c5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      '#FBede0';
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
