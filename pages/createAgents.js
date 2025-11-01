"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, Check, Copy, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Timeline } from "@/components/ui/timeline";
import FileUpload from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";

export default function CreateAgentPage() {
  // Placeholder wallet functionality (can be replaced with actual wallet integration later)
  const isConnected = true;
  const address = "0x1234...5678";

  // form states
  const [agentName, setAgentName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [selectedFiles, setSelectedFiles] = useState([]);

  // access / pricing
  const [selectedAccessOptions, setSelectedAccessOptions] = useState([]);
  const [monthlyTokens, setMonthlyTokens] = useState("");
  const [tokensPerQuery, setTokensPerQuery] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  // UI state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [savedAgentId, setSavedAgentId] = useState(""); // DB id
  const [copied, setCopied] = useState(false);

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryDropdownRef = useRef(null);

  const [validationErrors, setValidationErrors] = useState([]);

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

  // handle files from FileUpload child
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
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleAccessOption = (option) => {
    setSelectedAccessOptions((prev) => {
      // "public" is special: we also reflect it in isPublic
      if (option === "public") {
        const nextPublic = !prev.includes("public");
        setIsPublic(nextPublic);
      }

      return prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option];
    });
  };

  // form validation
  const validateForm = () => {
    const errors = [];

    // (Optional) If you don't want wallet to be mandatory, remove this block.
    if (!isConnected || !address) {
      errors.push("Please connect your wallet first (owner address).");
    }
    if (!agentName.trim()) {
      errors.push("Agent name is required.");
    }
    if (!category) {
      errors.push("Category is required.");
    }
    if (!description.trim()) {
      errors.push("Description is required.");
    }
    if (selectedFiles.length === 0) {
      errors.push("Please upload at least one file.");
    }
    if (selectedAccessOptions.length === 0) {
      errors.push("Please select at least one access option.");
    }

    // subscribers option requires monthlyTokens
    if (
      selectedAccessOptions.includes("subscribers") &&
      !monthlyTokens.trim()
    ) {
      errors.push("Monthly tokens are required for Subscribers option.");
    }

    // pay-per-use option requires tokensPerQuery
    if (
      selectedAccessOptions.includes("payperuse") &&
      !tokensPerQuery.trim()
    ) {
      errors.push("Tokens per query is required for Pay-Per-Use option.");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // submit handler that saves to your DB (via /api/agents)
  // This will:
  // 1. POST metadata (name, desc, pricing, etc.)
  // 2. upload files with FormData
  // You can adjust backend however you like.
  const handleUpload = async () => {
    if (!validateForm()) return;

    setIsUploading(true);
    setUploadProgress(10);
    setUploadSuccess(false);
    setSavedAgentId("");
    try {
      // build multipart form data
      const formData = new FormData();
      formData.append("agentName", agentName);
      formData.append("category", category);
      formData.append("description", description);

      formData.append(
        "accessOptions",
        JSON.stringify(selectedAccessOptions)
      );
      formData.append("monthlyTokens", monthlyTokens || "");
      formData.append("tokensPerQuery", tokensPerQuery || "");
      formData.append("isPublic", isPublic ? "true" : "false");

      if (address) {
        formData.append("ownerAddress", address);
      }

      selectedFiles.forEach((file, idx) => {
        formData.append(`files[${idx}]`, file);
      });

      // call your Next.js route: /api/agents (you implement this server-side)
      const res = await fetch("/api/agents", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(70);

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || "Failed to save agent.");
      }

      const data = await res.json();
      // assume backend returns { agentId: "abc123" }
      const newId = data.agentId || data.id || "";
      setSavedAgentId(newId);

      setUploadProgress(100);
      setUploadSuccess(true);
      setIsUploading(false);

      // optional redirect after success
      setTimeout(() => {
        const agentNameParam = encodeURIComponent(
          agentName || "New Agent"
        );
        window.location.href = `/agents?created=true&agentName=${agentNameParam}`;
      }, 2000);
    } catch (err) {
      console.error("Upload failed:", err);
      setValidationErrors([
        "Upload failed: " + (err?.message || "Unknown error"),
      ]);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const copyToClipboard = () => {
    if (!savedAgentId) return;
    navigator.clipboard.writeText(savedAgentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // timeline steps (updated to remove Lighthouse, encryption, token-gating chain stuff)
  const timelineData = [
    {
      title: "Step 1",
      subtitle: "Agent Information",
      description: "Provide basic details about your AI agent",
      content: (
        <div className="space-y-6">
          {/* Agent Name */}
          <div className="relative">
            <Input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="w-full h-12 bg-transparent text-white placeholder-transparent peer"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            />
            <Label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
              agentName && agentName.trim() !== ''
                ? '-top-2 text-xs text-white bg-black px-1'
                : 'top-3 text-sm text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-white peer-focus:bg-black peer-focus:px-1'
            }`}>
              Agent Name <span className="text-red-500">*</span>
            </Label>
          </div>

          {/* Category */}
          <div>
            <Label className="block mb-3 text-sm font-medium text-white">
              Category <span className="text-red-500">*</span>
            </Label>
            <div className="relative" ref={categoryDropdownRef}>
              <button
                onClick={() =>
                  setShowCategoryDropdown(!showCategoryDropdown)
                }
                className="w-full h-12 px-4 rounded-md outline-none transition-all duration-300 bg-transparent border text-left flex items-center justify-between hover:bg-white hover:bg-opacity-10"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: category ? "white" : "rgba(255, 255, 255, 0.6)",
                }}
              >
                <span>{category || "Select category"}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-2 w-full rounded-md shadow-lg z-10 max-h-64 overflow-y-auto scrollbar-hide" style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
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
                        className="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3 hover:bg-white hover:bg-opacity-10"
                      >
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor:
                              category === cat
                                ? "oklch(89.9% 0.061 343.231)"
                                : "transparent",
                            border: `2px solid ${
                              category === cat
                                ? "oklch(89.9% 0.061 343.231)"
                                : "rgba(255, 255, 255, 0.3)"
                            }`,
                          }}
                        >
                          {category === cat && (
                            <div
                              className="w-2 h-2 rounded-full bg-black"
                            />
                          )}
                        </div>
                        <span className="text-white">{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="relative">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full resize-none bg-transparent text-white placeholder-transparent peer"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            />
            <Label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
              description && description.trim() !== ''
                ? '-top-2 text-xs text-white bg-black px-1'
                : 'top-3 text-sm text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-white peer-focus:bg-black peer-focus:px-1'
            }`}>
              Description <span className="text-red-500">*</span>
            </Label>
          </div>
        </div>
      ),
    },
    {
      title: "Step 2",
      subtitle: "Upload Files",
      description: "Upload your model files, datasets, docs, etc.",
      content: (
        <div className="space-y-6">
          <div>
            <Label className="block mb-3 text-sm font-medium text-white">
              Model / Dataset / Agent Bundle{" "}
              <span className="text-red-500">*</span>
            </Label>
            <FileUpload onFilesChange={handleFilesChange} />
            <p className="text-xs mt-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              These files will be stored in our database / storage backend,
              linked to your agent profile.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Step 3",
      subtitle: "Access & Pricing",
      description: "Choose how users can access and pay for your agent",
      content: (
        <div className="space-y-6">
          <div>
            <Label className="block mb-3 text-sm font-medium text-white">
              Monetization Options{" "}
              <span className="text-red-500">*</span>
            </Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Subscribers */}
              <div
                className="rounded-md p-5 cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: selectedAccessOptions.includes("subscribers")
                    ? "1px solid oklch(89.9% 0.061 343.231)"
                    : "1px solid rgba(255, 255, 255, 0.2)",
                }}
                onClick={() => toggleAccessOption("subscribers")}
              >
                <div className="flex items-start gap-4">
                  {/* checkbox visual */}
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-1"
                    style={{
                      background: selectedAccessOptions.includes("subscribers")
                        ? 'linear-gradient(45deg, oklch(89.9% 0.061 343.231), oklch(91.7% 0.08 205.041))'
                        : "transparent",
                      border: selectedAccessOptions.includes("subscribers")
                        ? 'none'
                        : '2px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {selectedAccessOptions.includes("subscribers") && (
                      <Check
                        className="w-4 h-4"
                        style={{ color: "#000000" }}
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="mb-1 font-semibold text-white">
                      Subscribers (monthly tokens)
                    </h4>
                    <p className="text-sm mb-3" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Users get monthly tokens to query this agent.
                    </p>

                    {selectedAccessOptions.includes("subscribers") && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="space-y-4"
                      >
                        {/* Monthly tokens */}
                        <div className="relative" style={{ width: "200px" }}>
                          <Input
                            type="text"
                            value={monthlyTokens}
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^0-9]/g,
                                ""
                              );
                              setMonthlyTokens(value);
                            }}
                            className="h-11 bg-transparent text-white placeholder-transparent peer w-full"
                            style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}
                          />
                          <Label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                            monthlyTokens && monthlyTokens.trim() !== ''
                              ? '-top-2 text-xs text-white bg-black px-1'
                              : 'top-3 text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-white peer-focus:bg-black peer-focus:px-1'
                          }`} style={{ color: monthlyTokens && monthlyTokens.trim() !== '' ? '#ffffff' : 'rgba(255, 255, 255, 0.6)' }}>
                            Monthly Tokens
                          </Label>
                          <p className="mt-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            Tokens users get monthly for queries (e.g., 10000).
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pay Per Use */}
              <div
                className="rounded-md p-5 cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: selectedAccessOptions.includes("payperuse")
                    ? "1px solid oklch(89.9% 0.061 343.231)"
                    : "1px solid rgba(255, 255, 255, 0.2)",
                }}
                onClick={() => toggleAccessOption("payperuse")}
              >
                <div className="flex items-start gap-4">
                  {/* checkbox visual */}
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-1"
                    style={{
                      backgroundColor: selectedAccessOptions.includes(
                        "payperuse"
                      )
                        ? "oklch(89.9% 0.061 343.231)"
                        : "transparent",
                      border: `2px solid ${
                        selectedAccessOptions.includes("payperuse")
                          ? "oklch(89.9% 0.061 343.231)"
                          : "rgba(255, 255, 255, 0.3)"
                      }`,
                    }}
                  >
                    {selectedAccessOptions.includes("payperuse") && (
                      <Check
                        className="w-4 h-4 text-black"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="mb-1 font-semibold text-white">
                      Pay-Per-Query (token-based)
                    </h4>
                    <p className="text-sm mb-3" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Users pay tokens each time they query this agent.
                    </p>

                    {selectedAccessOptions.includes("payperuse") && (
                      <div className="relative" onClick={(e) => e.stopPropagation()} style={{ width: "200px" }}>
                        <Input
                          type="text"
                          value={tokensPerQuery}
                          onChange={(e) => {
                            const value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                            setTokensPerQuery(value);
                          }}
                          className="h-11 bg-transparent text-white placeholder-transparent peer w-full"
                          style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}
                        />
                        <Label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                          tokensPerQuery && tokensPerQuery.trim() !== ''
                            ? '-top-2 text-xs text-white bg-black px-1'
                            : 'top-3 text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-white peer-focus:bg-black peer-focus:px-1'
                        }`} style={{ color: tokensPerQuery && tokensPerQuery.trim() !== '' ? '#ffffff' : 'rgba(255, 255, 255, 0.6)' }}>
                          Tokens Per Query
                        </Label>
                        <p className="mt-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          Tokens required per query (e.g., 100).
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Public / Free */}
              <div
                className="rounded-md p-5 cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: selectedAccessOptions.includes("public")
                    ? "1px solid oklch(89.9% 0.061 343.231)"
                    : "1px solid rgba(255, 255, 255, 0.2)",
                }}
                onClick={() => toggleAccessOption("public")}
              >
                <div className="flex items-start gap-4">
                  {/* checkbox visual */}
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-1"
                    style={{
                      background: selectedAccessOptions.includes("public")
                        ? 'linear-gradient(45deg, oklch(89.9% 0.061 343.231), oklch(91.7% 0.08 205.041))'
                        : "transparent",
                      border: selectedAccessOptions.includes("public")
                        ? 'none'
                        : '2px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {selectedAccessOptions.includes("public") && (
                      <Check
                        className="w-4 h-4"
                        style={{ color: "#000000" }}
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="mb-1 font-semibold text-white">
                      Public (free access)
                    </h4>
                    <p className="text-sm mb-3" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Anyone can access this agent freely - no payment
                      required.
                    </p>
                    {selectedAccessOptions.includes("public") && (
                      <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        We'll mark this agent as public in the database.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* summary chips */}
            {selectedAccessOptions.length > 0 && (
              <div
                className="mt-6 p-4 rounded-md"
                style={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.05)", 
                  border: '1px solid rgba(255, 255, 255, 0.2)' 
                }}
              >
                <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  <span className="mr-2">Selected Options:</span>
                  <span className="text-white font-medium">
                    {selectedAccessOptions
                      .map((option) => {
                        const labels = {
                          subscribers: "Subscribers",
                          payperuse: "Pay-Per-Use",
                          public: "Public",
                        };
                        return labels[option] || option;
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
      subtitle: "Review & Create",
      description:
        "Check your configuration and save it to the marketplace database",
      content: (
        <div className="space-y-6">
          {/* validation errors */}
          {validationErrors.length > 0 && (
            <div
              className="rounded-md p-4 border border-red-500"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
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
                    Please complete the following required fields:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-400">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* main action */}
          <div>
            <Label className="block mb-3 text-sm font-medium text-white">
              Create Your Agent
            </Label>

            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full h-14 rounded-md text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              style={{
                background: 'linear-gradient(45deg, oklch(89.9% 0.061 343.231), oklch(91.7% 0.08 205.041))',
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                if (!isUploading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isUploading) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                }
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                <span className="text-lg font-medium">
                  {isUploading ? "Saving..." : "Save to Marketplace"}
                </span>
              </div>
            </button>
          </div>

          {/* upload progress bar */}
          {isUploading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white">Saving to database...</span>
                <span className="text-white font-medium">
                  {uploadProgress}%
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <div
                  className="h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${uploadProgress}%`,
                    background: 'linear-gradient(45deg, oklch(89.9% 0.061 343.231), oklch(91.7% 0.08 205.041))',
                  }}
                />
              </div>
            </div>
          )}

          {/* final success */}
          {uploadSuccess && (
            <div
              className="rounded-md p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              style={{ 
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: '1px solid oklch(89.9% 0.061 343.231)'
              }}
            >
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-white" />
                <div>
                  <div className="mb-1 text-white font-medium">
                    Agent created successfully!
                  </div>
                  <div className="text-sm font-mono break-all" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Agent ID: {savedAgentId || "(not returned)"}
                  </div>
                </div>
              </div>

              {savedAgentId && (
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-300 bg-transparent text-white hover:bg-white hover:bg-opacity-10"
                  style={{
                    border: copied 
                      ? '1px solid oklch(89.9% 0.061 343.231)'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                    background: copied 
                      ? 'linear-gradient(45deg, oklch(89.9% 0.061 343.231), oklch(91.7% 0.08 205.041))'
                      : 'transparent',
                    color: copied ? '#000000' : '#ffffff'
                  }}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy ID
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      {/* Navigation */}
      <Navigation />

      {/* header / breadcrumb */}
      <section className="max-w-[1400px] mx-auto px-6 pt-24 pb-0 text-white" style={{ backgroundColor: "#000000" }}>
        <nav className="mb-4 text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          <Link href="/" className="hover:underline cursor-pointer">
            Home
          </Link>
          <span className="mx-1">&gt;</span>
          <Link href="/agents" className="hover:underline cursor-pointer">
            My Agents
          </Link>
          <span className="mx-1">&gt;</span>
          <Link
            href="/agents/create"
            className="hover:underline cursor-pointer text-white"
          >
            Create Agent
          </Link>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Create Your Agent
        </h1>
        <p className="text-base md:text-lg mb-6" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          Upload your AI agent code or model, describe it, set pricing, and
          publish it to the marketplace. We'll save everything in our database.
        </p>
      </section>

      {/* timeline wizard steps */}
      <Timeline data={timelineData} />

      {/* footer help */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 text-center">
        <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          Need help?{" "}
          <a
            href="#"
            className="text-white hover:underline transition-all"
            style={{
              background: 'linear-gradient(45deg, oklch(89.9% 0.061 343.231), oklch(91.7% 0.08 205.041))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Visit Support
          </a>
        </span>
      </div>
    </div>
  );
}
