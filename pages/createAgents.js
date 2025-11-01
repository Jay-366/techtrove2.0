"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Check,
  Copy,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Timeline } from "@/components/ui/timeline";
import FileUpload from "@/components/ui/file-upload";
import { useAccount, useSignMessage } from "wagmi";
import lighthouse from "@lighthouse-web3/sdk";
import Navigation from "@/components/Navigation";

export default function CreateAgentPage() {
  // wallet hooks
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [agentName, setAgentName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [encryptionEnabled, setEncryptionEnabled] = useState(false);

  const [selectedAccessOptions, setSelectedAccessOptions] = useState([]);
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [payPerUsePrice, setPayPerUsePrice] = useState("");
  const [tokenContractAddress, setTokenContractAddress] = useState("");
  const [minTokenRequired, setMinTokenRequired] = useState("");

  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [cid, setCid] = useState("");
  const [copied, setCopied] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);

  const [validationErrors, setValidationErrors] = useState([]);

  const [lighthouseStatus, setLighthouseStatus] = useState({
    step: "idle", // 'idle' | 'encrypting' | 'applying-conditions' | 'success' | 'error'
    message: "",
    cid: undefined,
    error: undefined,
    encryptionComplete: false,
  });

  const fileInputRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const networkDropdownRef = useRef(null);

  const categories = [
    "Trading",
    "Research",
    "Writing",
    "Analytics",
    "DeFi",
    "NFT",
    "Gaming",
    "Social",
    "Data Analysis",
    "Content Creation",
  ];

  // handle files from FileUpload
  const handleFilesChange = (files) => {
    setSelectedFiles(files);
  };

  // close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }
      if (
        networkDropdownRef.current &&
        !networkDropdownRef.current.contains(event.target)
      ) {
        setShowNetworkDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleAccessOption = (option) => {
    setSelectedAccessOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  // Validation
  const validateForm = () => {
    const errors = [];

    if (!isConnected || !address) {
      errors.push("Please connect your wallet first");
    }
    if (!agentName.trim()) {
      errors.push("Agent name is required");
    }
    if (!category) {
      errors.push("Category is required");
    }
    if (!description.trim()) {
      errors.push("Description is required");
    }
    if (selectedFiles.length === 0) {
      errors.push("Please upload at least one file");
    }
    if (selectedAccessOptions.length === 0) {
      errors.push("Please select at least one access option");
    }

    // pricing requirements per access type:
    if (selectedAccessOptions.includes("subscribers")) {
      if (!selectedNetwork) {
        errors.push(
          "Network selection is required for Subscribers option"
        );
      }
      if (!monthlyPrice.trim()) {
        errors.push(
          "Monthly price is required for Subscribers option"
        );
      }
    }
    if (
      selectedAccessOptions.includes("payperuse") &&
      !payPerUsePrice.trim()
    ) {
      errors.push(
        "Price per session is required for Pay-Per-Use option"
      );
    }
    if (selectedAccessOptions.includes("tokengated")) {
      if (!tokenContractAddress.trim()) {
        errors.push(
          "Token contract address is required for Token-Gated option"
        );
      }
      if (!minTokenRequired.trim()) {
        errors.push(
          "Minimum token amount is required for Token-Gated option"
        );
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleUpload = async () => {
    // If we haven't completed encryption before, we treat this as full upload
    if (!lighthouseStatus.encryptionComplete) {
      setValidationErrors([]);
      setLighthouseStatus({
        step: "idle",
        message: "",
        encryptionComplete: false,
      });

      if (!validateForm()) {
        return;
      }

      if (selectedFiles.length === 0) {
        setLighthouseStatus({
          step: "error",
          message: "",
          error: "Please select a file to upload",
          encryptionComplete: false,
        });
        return;
      }
    }

    setIsUploading(true);

    try {
      let currentCid = lighthouseStatus.cid;

      //
      // STEP 1: encrypt & upload (if not already done)
      //
      if (!lighthouseStatus.encryptionComplete) {
        setUploadProgress(0);
        setLighthouseStatus({
          step: "encrypting",
          message: "Getting wallet signature for Lighthouse...",
          encryptionComplete: false,
        });

        // 1. get auth message from our API
        const authResponse = await fetch("/api/lighthouse/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userAddress: address }),
        });
        const authData = await authResponse.json();

        if (!authData.message) {
          throw new Error(
            "Failed to get auth message from Lighthouse"
          );
        }

        // 2. sign the auth message
        const signature = await signMessageAsync({
          message: authData.message,
        });

        setLighthouseStatus({
          step: "encrypting",
          message:
            "Uploading and encrypting file to Lighthouse...",
          encryptionComplete: false,
        });

        // 3. upload encrypted file via our API
        const formData = new FormData();
        formData.append("file", selectedFiles[0]);
        formData.append("userAddress", address);
        formData.append("userSignature", signature);

        const uploadResponse = await fetch("/api/lighthouse", {
          method: "POST",
          body: formData,
        });

        let uploadResult;
        try {
          const responseText = await uploadResponse.text();
          uploadResult = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error(
            `Invalid response from server: ${uploadResponse.status} ${uploadResponse.statusText}`
          );
        }

        if (!uploadResponse.ok) {
          throw new Error(
            uploadResult.error ||
              "Failed to encrypt and upload file"
          );
        }

        // 4. get CID
        currentCid =
          uploadResult.data?.[0]?.Hash || uploadResult.Hash;
        setUploadProgress(50);

        setLighthouseStatus({
          step: "applying-conditions",
          message: `File encrypted successfully! CID: ${currentCid}. Now applying access conditions...`,
          cid: currentCid,
          encryptionComplete: true,
        });
      } else {
        // we already encrypted before, so resume step 2
        setLighthouseStatus({
          step: "applying-conditions",
          message: `Retrying access conditions for CID: ${currentCid}...`,
          cid: currentCid,
          encryptionComplete: true,
        });
      }

      //
      // STEP 2: apply access conditions
      //
      const conditionsAuthResponse =
        await lighthouse.getAuthMessage(address);

      if (
        !conditionsAuthResponse ||
        !conditionsAuthResponse.data ||
        !conditionsAuthResponse.data.message
      ) {
        throw new Error(
          "Failed to get auth message for conditions"
        );
      }

      const messageToSign =
        conditionsAuthResponse.data.message;

      const conditionsSignature = await signMessageAsync({
        message: messageToSign,
      });

      const conditionsResponse = await fetch(
        "/api/lighthouse",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cid: currentCid,
            userAddress: address,
            signedMessage: conditionsSignature,
          }),
        }
      );

      let conditionsResult;
      try {
        const conditionsResponseText =
          await conditionsResponse.text();
        conditionsResult = JSON.parse(
          conditionsResponseText
        );
      } catch (parseError) {
        throw new Error(
          `Invalid response from conditions endpoint: ${conditionsResponse.status} ${conditionsResponse.statusText}`
        );
      }

      if (!conditionsResponse.ok) {
        setLighthouseStatus({
          step: "error",
          message: `File encrypted successfully! CID: ${currentCid}`,
          error:
            conditionsResult.error || "Unknown error",
          cid: currentCid,
          encryptionComplete: true,
        });
        setIsUploading(false);
        return;
      }

      // success
      setUploadProgress(100);
      setLighthouseStatus({
        step: "success",
        message:
          "File encrypted and access conditions applied successfully!",
        cid: currentCid,
        encryptionComplete: true,
      });

      setIsUploading(false);
      setUploadSuccess(true);
      setCid(currentCid);

      // After success, bounce back to /agents with query
      setTimeout(() => {
        const agentNameParam = encodeURIComponent(
          agentName || "Crypto Agent"
        );
        window.location.href = `/agents?uploadSuccess=true&agentName=${agentNameParam}`;
      }, 2000);
    } catch (err) {
      console.error("Lighthouse upload failed:", err);
      setLighthouseStatus({
        step: "error",
        message: lighthouseStatus.encryptionComplete
          ? `File encrypted successfully! CID: ${lighthouseStatus.cid}`
          : "",
        error:
          err instanceof Error
            ? err.message
            : "Upload failed",
        cid: lighthouseStatus.cid,
        encryptionComplete:
          lighthouseStatus.encryptionComplete,
      });

      setIsUploading(false);
      if (!lighthouseStatus.encryptionComplete) {
        setUploadProgress(0);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cid);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // timeline steps (same UI logic, all JSX)
  const timelineData = [
    {
      title: "Step 1",
      subtitle: "Agent Information",
      description: "Provide basic details about your AI agent",
      content: (
        <div className="space-y-6">
          {/* agent name */}
          <div>
            <label className="block mb-3 text-sm font-medium text-[#f8ede0]">
              Agent Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Enter agent name"
              className="w-full h-12 px-4 rounded-md outline-none transition-all duration-300 bg-transparent border border-[#5d606c] text-[#f8ede0] placeholder-[#5d606c] focus:border-[#f8ede0] hover:border-[#f8ede0]/60 hover:shadow-[0_0_15px_rgba(248,237,224,0.1)]"
            />
          </div>

          {/* category */}
          <div>
            <label className="block mb-3 text-sm font-medium text-[#f8ede0]">
              Category <span className="text-red-500">*</span>
            </label>
            <div
              className="relative"
              ref={categoryDropdownRef}
            >
              <button
                onClick={() =>
                  setShowCategoryDropdown(
                    !showCategoryDropdown
                  )
                }
                className="w-full h-12 px-4 rounded-md outline-none transition-all duration-300 bg-transparent border border-[#5d606c] text-left flex items-center justify-between hover:border-[#f8ede0]/60 hover:shadow-[0_0_15px_rgba(248,237,224,0.1)]"
                style={{
                  color: category
                    ? "#f8ede0"
                    : "#5d606c",
                }}
              >
                <span>
                  {category || "Select category"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-2 w-full bg-[#1C1F2B] border border-[#5d606c] rounded-md shadow-lg z-10 max-h-64 overflow-y-auto scrollbar-hide">
                  <style jsx>{`
                    .scrollbar-hide::-webkit-scrollbar {
                      display: none;
                    }
                    .scrollbar-hide {
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                    }
                  `}</style>
                  <div className="py-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setCategory(cat);
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3 hover:bg-[rgba(93,96,108,0.3)]"
                      >
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor:
                              category === cat
                                ? "#f8ede0"
                                : "transparent",
                            border: `2px solid ${
                              category === cat
                                ? "#f8ede0"
                                : "#5d606c"
                            }`,
                          }}
                        >
                          {category === cat && (
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor:
                                  "#161823",
                              }}
                            />
                          )}
                        </div>
                        <span className="text-[#f8ede0]">
                          {cat}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* description */}
          <div>
            <label className="block mb-3 text-sm font-medium text-[#f8ede0]">
              Description{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Describe your agent's capabilities and use cases"
              rows={5}
              className="w-full px-4 py-3 rounded-md outline-none transition-all duration-300 resize-none bg-transparent border border-[#5d606c] text-[#f8ede0] placeholder-[#5d606c] focus:border-[#f8ede0] hover:border-[#f8ede0]/60 hover:shadow-[0_0_15px_rgba(248,237,224,0.1)]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Step 2",
      subtitle: "Upload & Security",
      description:
        "Upload your model files and configure encryption",
      content: (
        <div className="space-y-6">
          {/* file upload */}
          <div>
            <label className="block mb-3 text-sm font-medium text-[#f8ede0]">
              Model or Dataset File{" "}
              <span className="text-red-500">*</span>
            </label>
            <FileUpload onFilesChange={handleFilesChange} />
          </div>

          {/* encryption toggle */}
          <div>
            <label className="block mb-3 text-sm font-medium text-[#f8ede0]">
              File Encryption
            </label>
            <div className="flex items-center justify-between p-4 rounded-md border border-[#5d606c]">
              <div>
                <label className="block text-sm font-medium text-[#f8ede0] mb-1">
                  Encrypt this file before upload
                </label>
                <p className="text-xs text-[#5d606c]">
                  Secure your agent with Lighthouse
                  encryption
                </p>
              </div>
              <button
                onClick={() =>
                  setEncryptionEnabled(
                    !encryptionEnabled
                  )
                }
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                style={{
                  backgroundColor: encryptionEnabled
                    ? "#f8ede0"
                    : "#5d606c",
                }}
              >
                <span
                  className="inline-block h-4 w-4 transform rounded-full transition-transform"
                  style={{
                    transform: encryptionEnabled
                      ? "translateX(24px)"
                      : "translateX(4px)",
                    backgroundColor: encryptionEnabled
                      ? "#161823"
                      : "#fff",
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Step 3",
      subtitle: "Access & Pricing",
      description:
        "Choose how users can access and pay for your agent",
      content: (
        <div className="space-y-6">
          {/* monetization options */}
          <div>
            <label className="block mb-3 text-sm font-medium text-[#f8ede0]">
              Monetization Options{" "}
              <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Subscribers */}
              <div
                className="rounded-md p-5 cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(248,237,224,0.1)]"
                style={{
                  backgroundColor: "#1C1F2B",
                  border: selectedAccessOptions.includes(
                    "subscribers"
                  )
                    ? "1px solid #f8ede0"
                    : "1px solid #5d606c",
                }}
                onClick={() =>
                  toggleAccessOption("subscribers")
                }
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-1"
                    style={{
                      backgroundColor:
                        selectedAccessOptions.includes(
                          "subscribers"
                        )
                          ? "#f8ede0"
                          : "transparent",
                      border: `2px solid ${
                        selectedAccessOptions.includes(
                          "subscribers"
                        )
                          ? "#f8ede0"
                          : "#5d606c"
                      }`,
                    }}
                  >
                    {selectedAccessOptions.includes(
                      "subscribers"
                    ) && (
                      <Check
                        className="w-4 h-4"
                        style={{ color: "#161823" }}
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="mb-1 font-semibold text-[#f8ede0]">
                      Subscribers (monthly-based)
                    </h4>
                    <p className="text-sm mb-3 text-[#5d606c]">
                      Users pay a recurring monthly fee
                      to access this agent.
                    </p>

                    {selectedAccessOptions.includes(
                      "subscribers"
                    ) && (
                      <div
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                        className="space-y-4"
                      >
                        {/* network select */}
                        <div>
                          <label className="block mb-2 text-sm text-[#f8ede0]">
                            Select Network{" "}
                            <span className="text-red-500">
                              *
                            </span>
                          </label>
                          <div
                            className="relative"
                            ref={networkDropdownRef}
                          >
                            <button
                              onClick={() =>
                                setShowNetworkDropdown(
                                  !showNetworkDropdown
                                )
                              }
                              className="w-full h-11 px-4 rounded-md outline-none transition-all duration-300 bg-transparent border border-[#5d606c] text-left flex items-center justify-between hover:border-[#f8ede0]/60"
                              style={{
                                color: selectedNetwork
                                  ? "#f8ede0"
                                  : "#5d606c",
                              }}
                            >
                              <div className="flex items-center gap-3">
                                {selectedNetwork && (
                                  <div className="w-12 h-12 flex items-center justify-center">
                                    {selectedNetwork ===
                                      "Sepolia" && (
                                      <Image
                                        src="/chain/sepolia.png"
                                        alt="Sepolia"
                                        width={48}
                                        height={48}
                                        className="rounded-full"
                                      />
                                    )}
                                    {selectedNetwork ===
                                      "Base Sepolia" && (
                                      <Image
                                        src="/chain/base-sepolia.png"
                                        alt="Base Sepolia"
                                        width={48}
                                        height={48}
                                        className="rounded-full"
                                      />
                                    )}
                                    {selectedNetwork ===
                                      "Arbitrum Sepolia" && (
                                      <Image
                                        src="/chain/arbitrum.png"
                                        alt="Arbitrum Sepolia"
                                        width={48}
                                        height={48}
                                        className="rounded-full"
                                      />
                                    )}
                                    {selectedNetwork ===
                                      "Monad Testnet" && (
                                      <Image
                                        src="/chain/monad.png"
                                        alt="Monad Testnet"
                                        width={48}
                                        height={48}
                                        className="rounded-full"
                                      />
                                    )}
                                    {selectedNetwork ===
                                      "Polygon Amoy" && (
                                      <Image
                                        src="/chain/polygon.png"
                                        alt="Polygon Amoy"
                                        width={48}
                                        height={48}
                                        className="rounded-full"
                                      />
                                    )}
                                    {selectedNetwork ===
                                      "OP Sepolia" && (
                                      <Image
                                        src="/chain/opitimism.png"
                                        alt="OP Sepolia"
                                        width={48}
                                        height={48}
                                        className="rounded-full"
                                      />
                                    )}
                                  </div>
                                )}
                                <span>
                                  {selectedNetwork ||
                                    "Choose network"}
                                </span>
                              </div>
                              <ChevronDown className="w-4 h-4" />
                            </button>

                            {showNetworkDropdown && (
                              <div className="absolute top-full left-0 mt-2 w-full bg-[#1C1F2B] border border-[#5d606c] rounded-md shadow-lg z-20 max-h-64 overflow-y-auto">
                                <div className="py-2">
                                  {[
                                    {
                                      name: "Sepolia",
                                      color: "#627EEA",
                                      status:
                                        "Connected",
                                    },
                                    {
                                      name: "Base Sepolia",
                                      color: "#0052FF",
                                      status: null,
                                    },
                                    {
                                      name: "Arbitrum Sepolia",
                                      color: "#28A0F0",
                                      status: null,
                                    },
                                    {
                                      name: "Monad Testnet",
                                      color: "#9333EA",
                                      status: null,
                                    },
                                    {
                                      name: "Polygon Amoy",
                                      color: "#8247E5",
                                      status: null,
                                    },
                                    {
                                      name: "OP Sepolia",
                                      color: "#FF0420",
                                      status: null,
                                    },
                                  ].map((network) => (
                                    <button
                                      key={
                                        network.name
                                      }
                                      onClick={() => {
                                        setSelectedNetwork(
                                          network.name
                                        );
                                        setShowNetworkDropdown(
                                          false
                                        );
                                      }}
                                      className="w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between hover:bg-[rgba(93,96,108,0.3)]"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 flex items-center justify-center">
                                          {network.name ===
                                            "Sepolia" && (
                                            <Image
                                              src="/chain/sepolia.png"
                                              alt="Sepolia"
                                              width={
                                                40
                                              }
                                              height={
                                                40
                                              }
                                              className="rounded-full"
                                            />
                                          )}
                                          {network.name ===
                                            "Base Sepolia" && (
                                            <Image
                                              src="/chain/base-sepolia.png"
                                              alt="Base Sepolia"
                                              width={
                                                40
                                              }
                                              height={
                                                40
                                              }
                                              className="rounded-full"
                                            />
                                          )}
                                          {network.name ===
                                            "Arbitrum Sepolia" && (
                                            <Image
                                              src="/chain/arbitrum.png"
                                              alt="Arbitrum Sepolia"
                                              width={
                                                40
                                              }
                                              height={
                                                40
                                              }
                                              className="rounded-full"
                                            />
                                          )}
                                          {network.name ===
                                            "Monad Testnet" && (
                                            <Image
                                              src="/chain/monad.png"
                                              alt="Monad Testnet"
                                              width={
                                                40
                                              }
                                              height={
                                                40
                                              }
                                              className="rounded-full"
                                            />
                                          )}
                                          {network.name ===
                                            "Polygon Amoy" && (
                                            <Image
                                              src="/chain/polygon.png"
                                              alt="Polygon Amoy"
                                              width={
                                                40
                                              }
                                              height={
                                                40
                                              }
                                              className="rounded-full"
                                            />
                                          )}
                                          {network.name ===
                                            "OP Sepolia" && (
                                            <Image
                                              src="/chain/opitimism.png"
                                              alt="OP Sepolia"
                                              width={
                                                40
                                              }
                                              height={
                                                40
                                              }
                                              className="rounded-full"
                                            />
                                          )}
                                        </div>
                                        <span className="text-[#f8ede0]">
                                          {network.name}
                                        </span>
                                      </div>
                                      {network.status && (
                                        <div className="flex items-center gap-1">
                                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                          <span className="text-xs text-green-400">
                                            {
                                              network.status
                                            }
                                          </span>
                                        </div>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* monthly price */}
                        <div>
                          <label className="block mb-2 text-sm text-[#f8ede0]">
                            Monthly Subscription
                            Price (USDC)
                          </label>
                          <input
                            type="text"
                            value={monthlyPrice}
                            onChange={(e) => {
                              const value =
                                e.target.value.replace(
                                  /[^0-9.]/g,
                                  ""
                                );
                              setMonthlyPrice(value);
                            }}
                            placeholder="e.g. 3-10"
                            className="h-11 px-4 rounded-md outline-none transition-all duration-300 bg-transparent border border-[#5d606c] text-[#f8ede0] placeholder-[#5d606c] focus:border-[#f8ede0] hover:border-[#f8ede0]/60"
                            style={{
                              width: "200px",
                            }}
                            disabled={!selectedNetwork}
                          />
                          {!selectedNetwork && (
                            <p className="mt-1 text-xs text-[#5d606c]">
                              Please select a
                              network first
                            </p>
                          )}
                          {selectedNetwork && (
                            <p className="mt-2 text-sm text-[#5d606c]">
                              Renewal every 30
                              days on{" "}
                              {selectedNetwork} •
                              Access verified via
                              subscription
                              contract.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pay Per Use */}
              <div
                className="rounded-md p-5 cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(248,237,224,0.1)]"
                style={{
                  backgroundColor: "#1C1F2B",
                  border: selectedAccessOptions.includes(
                    "payperuse"
                  )
                    ? "1px solid #f8ede0"
                    : "1px solid #5d606c",
                }}
                onClick={() =>
                  toggleAccessOption("payperuse")
                }
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-1"
                    style={{
                      backgroundColor:
                        selectedAccessOptions.includes(
                          "payperuse"
                        )
                          ? "#f8ede0"
                          : "transparent",
                      border: `2px solid ${
                        selectedAccessOptions.includes(
                          "payperuse"
                        )
                          ? "#f8ede0"
                          : "#5d606c"
                      }`,
                    }}
                  >
                    {selectedAccessOptions.includes(
                      "payperuse"
                    ) && (
                      <Check
                        className="w-4 h-4"
                        style={{ color: "#161823" }}
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="mb-1 font-semibold text-[#f8ede0]">
                      Pay-Per-Use (session-based)
                    </h4>
                    <p className="text-sm mb-3 text-[#5d606c]">
                      Users pay a small fee each
                      time they use or chat with
                      this agent.
                    </p>

                    {selectedAccessOptions.includes(
                      "payperuse"
                    ) && (
                      <div
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                      >
                        <label className="block mb-2 text-sm text-[#f8ede0]">
                          Price Per Session
                          (ETH)
                        </label>
                        <input
                          type="text"
                          value={payPerUsePrice}
                          onChange={(e) => {
                            const value =
                              e.target.value.replace(
                                /[^0-9.]/g,
                                ""
                              );
                            setPayPerUsePrice(
                              value
                            );
                          }}
                          placeholder="e.g. 0.005"
                          className="h-11 px-4 rounded-md outline-none transition-all duration-300 bg-transparent border border-[#5d606c] text-[#f8ede0] placeholder-[#5d606c] focus:border-[#f8ede0] hover:border-[#f8ede0]/60"
                          style={{
                            width: "200px",
                          }}
                        />
                        <p className="mt-2 text-sm text-[#5d606c]">
                          Access granted for 1
                          session after
                          payment.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Token-Gated */}
              <div
                className="rounded-md p-5 cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(248,237,224,0.1)]"
                style={{
                  backgroundColor: "#1C1F2B",
                  border: selectedAccessOptions.includes(
                    "tokengated"
                  )
                    ? "1px solid #f8ede0"
                    : "1px solid #5d606c",
                }}
                onClick={() =>
                  toggleAccessOption("tokengated")
                }
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-1"
                    style={{
                      backgroundColor:
                        selectedAccessOptions.includes(
                          "tokengated"
                        )
                          ? "#f8ede0"
                          : "transparent",
                      border: `2px solid ${
                        selectedAccessOptions.includes(
                          "tokengated"
                        )
                          ? "#f8ede0"
                          : "#5d606c"
                      }`,
                    }}
                  >
                    {selectedAccessOptions.includes(
                      "tokengated"
                    ) && (
                      <Check
                        className="w-4 h-4"
                        style={{ color: "#161823" }}
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="mb-1 font-semibold text-[#f8ede0]">
                      Token-Gated Access
                      (holder-based)
                    </h4>
                    <p className="text-sm mb-3 text-[#5d606c]">
                      Access unlocked by
                      holding a specific token
                      or NFT.
                    </p>

                    {selectedAccessOptions.includes(
                      "tokengated"
                    ) && (
                      <div
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                        className="space-y-3"
                      >
                        <div>
                          <label className="block mb-2 text-sm text-[#f8ede0]">
                            Token Contract
                            Address
                          </label>
                          <input
                            type="text"
                            value={
                              tokenContractAddress
                            }
                            onChange={(e) =>
                              setTokenContractAddress(
                                e.target.value
                              )
                            }
                            placeholder="0x..."
                            className="w-full h-11 px-4 rounded-md outline-none transition-all duration-300 bg-transparent border border-[#5d606c] text-[#f8ede0] placeholder-[#5d606c] focus:border-[#f8ede0] hover:border-[#f8ede0]/60"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm text-[#f8ede0]">
                            Minimum Token
                            Required
                          </label>
                          <input
                            type="text"
                            value={
                              minTokenRequired
                            }
                            onChange={(e) => {
                              const value =
                                e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                              setMinTokenRequired(
                                value
                              );
                            }}
                            placeholder="1"
                            className="h-11 px-4 rounded-md outline-none transition-all duration-300 bg-transparent border border-[#5d606c] text-[#f8ede0] placeholder-[#5d606c] focus:border-[#f8ede0] hover:border-[#f8ede0]/60"
                            style={{
                              width: "100px",
                            }}
                          />
                        </div>
                        <p className="text-sm text-[#5d606c]">
                          File encrypted via
                          Lighthouse • only
                          token holders can
                          decrypt.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Public */}
              <div
                className="rounded-md p-5 cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(248,237,224,0.1)]"
                style={{
                  backgroundColor: "#1C1F2B",
                  border: selectedAccessOptions.includes(
                    "public"
                  )
                    ? "1px solid #f8ede0"
                    : "1px solid #5d606c",
                }}
                onClick={() =>
                  toggleAccessOption("public")
                }
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-1"
                    style={{
                      backgroundColor:
                        selectedAccessOptions.includes(
                          "public"
                        )
                          ? "#f8ede0"
                          : "transparent",
                      border: `2px solid ${
                        selectedAccessOptions.includes(
                          "public"
                        )
                          ? "#f8ede0"
                          : "#5d606c"
                      }`,
                    }}
                  >
                    {selectedAccessOptions.includes(
                      "public"
                    ) && (
                      <Check
                        className="w-4 h-4"
                        style={{ color: "#161823" }}
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="mb-1 font-semibold text-[#f8ede0]">
                      Public (free access)
                    </h4>
                    <p className="text-sm mb-3 text-[#5d606c]">
                      Anyone can access this
                      agent freely — no
                      payment or token
                      required.
                    </p>
                    {selectedAccessOptions.includes(
                      "public"
                    ) && (
                      <p className="text-sm text-[#5d606c]">
                        Suitable for demos or
                        community agents.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* summary chips */}
            {selectedAccessOptions.length > 0 && (
              <div
                className="mt-6 p-4 rounded-md border border-[#5d606c]"
                style={{ backgroundColor: "#1C1F2B" }}
              >
                <div className="text-sm text-[#5d606c]">
                  <span className="mr-2">
                    Selected Options:
                  </span>
                  <span className="text-[#f8ede0] font-medium">
                    {selectedAccessOptions
                      .map((option) => {
                        const labels = {
                          subscribers:
                            "Subscribers",
                          payperuse:
                            "Pay-Per-Use",
                          tokengated:
                            "Token-Gated",
                          public: "Public",
                        };
                        return labels[option];
                      })
                      .join(", ")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Step 4",
      subtitle: "Review & Deploy",
      description:
        "Review your configuration and upload to Lighthouse",
      content: (
        <div className="space-y-6">
          {/* validation errors */}
          {validationErrors.length > 0 && (
            <div
              className="rounded-md p-4 border border-red-500"
              style={{
                backgroundColor: "#1C1F2B",
              }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-500 mb-2">
                    Please complete the following
                    required fields:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-400">
                    {validationErrors.map(
                      (error, index) => (
                        <li key={index}>{error}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* deploy card */}
          <div>
            <label className="block mb-3 text-sm font-medium text-[#f8ede0]">
              Deploy Your Agent
            </label>

            {/* Lighthouse status indicator */}
            {lighthouseStatus.step !== "idle" && (
              <div className="mb-4 space-y-3">
                {/* Step 1 */}
                <div
                  className="flex items-center gap-3 p-3 rounded-md border border-[#5d606c]"
                  style={{
                    backgroundColor: "#1C1F2B",
                  }}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      lighthouseStatus.step ===
                      "encrypting"
                        ? "animate-spin"
                        : ""
                    }`}
                    style={{
                      backgroundColor:
                        lighthouseStatus.step ===
                        "encrypting"
                          ? "#f8ede0"
                          : lighthouseStatus.step ===
                              "applying-conditions" ||
                            lighthouseStatus.step ===
                              "success"
                          ? "#10B981"
                          : "#5d606c",
                      color:
                        lighthouseStatus.step ===
                        "encrypting"
                          ? "#161823"
                          : "#fff",
                    }}
                  >
                    {lighthouseStatus.step ===
                    "encrypting" ? (
                      <div className="w-3 h-3 border-2 border-[#161823] border-t-transparent rounded-full animate-spin"></div>
                    ) : lighthouseStatus.step ===
                        "applying-conditions" ||
                      lighthouseStatus.step ===
                        "success" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold">
                        1
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#f8ede0]">
                      Step 1: Encrypt & Upload File
                    </div>
                    <div className="text-xs text-[#5d606c]">
                      {lighthouseStatus.step ===
                      "encrypting"
                        ? "Encrypting file and uploading to Lighthouse..."
                        : lighthouseStatus.step ===
                            "applying-conditions" ||
                          lighthouseStatus.step ===
                            "success"
                        ? `✓ File encrypted successfully! CID: ${lighthouseStatus.cid}`
                        : "Waiting..."}
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div
                  className="flex items-center gap-3 p-3 rounded-md border border-[#5d606c]"
                  style={{
                    backgroundColor: "#1C1F2B",
                  }}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      lighthouseStatus.step ===
                      "applying-conditions"
                        ? "animate-spin"
                        : ""
                    }`}
                    style={{
                      backgroundColor:
                        lighthouseStatus.step ===
                        "applying-conditions"
                          ? "#f8ede0"
                          : lighthouseStatus.step ===
                            "success"
                          ? "#10B981"
                          : "#5d606c",
                      color:
                        lighthouseStatus.step ===
                        "applying-conditions"
                          ? "#161823"
                          : "#fff",
                    }}
                  >
                    {lighthouseStatus.step ===
                    "applying-conditions" ? (
                      <div className="w-3 h-3 border-2 border-[#161823] border-t-transparent rounded-full animate-spin"></div>
                    ) : lighthouseStatus.step ===
                      "success" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold">
                        2
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#f8ede0]">
                      Step 2: Apply Access
                      Conditions
                    </div>
                    <div className="text-xs text-[#5d606c]">
                      {lighthouseStatus.step ===
                      "applying-conditions"
                        ? "Applying token-gated access conditions..."
                        : lighthouseStatus.step ===
                          "success"
                        ? "✓ Access conditions applied successfully!"
                        : "Waiting for step 1 to complete..."}
                    </div>
                  </div>
                </div>

                {/* error state */}
                {lighthouseStatus.step ===
                  "error" && (
                  <div
                    className="p-3 rounded-md border border-red-500"
                    style={{
                      backgroundColor: "#1C1F2B",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-red-500 mb-1">
                          {lighthouseStatus.encryptionComplete
                            ? "Step 2 Failed"
                            : "Upload Failed"}
                        </h3>

                        {lighthouseStatus.message && (
                          <p className="text-sm text-green-400 mb-1">
                            {lighthouseStatus.message}
                          </p>
                        )}

                        <p className="text-sm text-red-400">
                          {lighthouseStatus.error}
                        </p>

                        {lighthouseStatus.encryptionComplete && (
                          <button
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="mt-2 px-3 py-1 text-xs bg-[#f8ede0] text-[#161823] rounded hover:bg-opacity-90 disabled:opacity-50"
                          >
                            {isUploading
                              ? "Retrying..."
                              : "Retry Step 2"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full h-14 rounded-md text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#f8ede0",
                color: "#161823",
                boxShadow:
                  "0 4px 12px rgba(248, 237, 224, 0.2)",
              }}
              onMouseEnter={(e) => {
                if (!isUploading) {
                  e.currentTarget.style.transform =
                    "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(248, 237, 224, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isUploading) {
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(248, 237, 224, 0.2)";
                }
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                <span className="text-lg font-medium">
                  {isUploading
                    ? "Uploading..."
                    : "Upload to Lighthouse"}
                </span>
              </div>
            </button>
          </div>

          {/* upload progress bar */}
          {isUploading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#f8ede0]">
                  Uploading to Lighthouse...
                </span>
                <span className="text-[#f8ede0] font-medium">
                  {uploadProgress}%
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "#5d606c" }}
              >
                <div
                  className="h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${uploadProgress}%`,
                    backgroundColor: "#f8ede0",
                  }}
                />
              </div>
            </div>
          )}

          {/* final success w/CID */}
          {uploadSuccess && (
            <div
              className="rounded-md p-6 flex items-center justify-between border border-[#f8ede0]"
              style={{ backgroundColor: "#1C1F2B" }}
            >
              <div className="flex items-center gap-3">
                <Check
                  className="w-6 h-6"
                  style={{ color: "#f8ede0" }}
                />
                <div>
                  <div className="mb-1 text-[#f8ede0] font-medium">
                    Upload successful!
                  </div>
                  <div className="text-sm text-[#5d606c] font-mono">
                    CID: {cid}
                  </div>
                </div>
              </div>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-300 bg-transparent border border-[#f8ede0] text-[#f8ede0] hover:bg-[#f8ede0] hover:text-[#161823]"
                style={
                  copied
                    ? {
                        backgroundColor:
                          "#f8ede0",
                        color: "#161823",
                      }
                    : {}
                }
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy CID
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#161823]">
      {/* Navigation */}
      <Navigation />
      
      {/* header (breadcrumb like CategoryHeader) */}
      <section className="max-w-[1400px] mx-auto px-6 pt-24 pb-0 bg-gradient-to-r from-[#161823] to-[#161823] text-[#f8ede0]">
        <nav className="mb-4 text-sm text-[#5d606c]">
          <Link
            href="/"
            className="hover:underline cursor-pointer"
          >
            Home
          </Link>
          <span className="mx-1">&gt;</span>
          <Link
            href="/agents"
            className="hover:underline cursor-pointer"
          >
            My Agents
          </Link>
          <span className="mx-1">&gt;</span>
          <Link
            href="/agents/create"
            className="hover:underline cursor-pointer text-[#f8ede0]"
          >
            Create Agent
          </Link>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Upload Your Agent
        </h1>
        <p className="text-base md:text-lg text-[#5d606c] mb-6">
          Store your AI securely with Lighthouse
          integration and monetize on the
          marketplace.
        </p>
      </section>

      {/* timeline wizard steps */}
      <Timeline data={timelineData} />

      {/* footer help */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 text-center">
        <span className="text-[#5d606c]">
          Need help?{" "}
          <a
            href="#"
            className="text-[#f8ede0] hover:underline transition-all"
          >
            Visit Support
          </a>
        </span>
      </div>
    </div>
  );
}
