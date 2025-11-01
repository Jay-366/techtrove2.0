"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import {
  UploadCloud,
  File as FileIcon,
  Trash2,
  Loader,
  CheckCircle,
} from "lucide-react";

export default function FileUpload({ onFilesChange }) {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  // Process dropped or selected files
  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map((file) => ({
      id: `${URL.createObjectURL(file)}-${Date.now()}`,
      preview: URL.createObjectURL(file),
      progress: 0,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      file,
    }));

    setFiles((prev) => {
      const updated = [...prev, ...newFiles];

      // Notify parent of file changes
      if (onFilesChange) {
        onFilesChange(
          updated
            .map((f) => f.file)
            .filter((f) => f !== undefined)
        );
      }

      return updated;
    });

    // fake upload for each file
    newFiles.forEach((f) => simulateUpload(f.id));
  };

  // Simulate upload progress
  const simulateUpload = (id) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, progress: Math.min(progress, 100) } : f
        )
      );
      if (progress >= 100) {
        clearInterval(interval);
        if (navigator.vibrate) navigator.vibrate(100);
      }
    }, 300);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onSelect = (e) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="w-full mx-auto">
      {/* Drop zone */}
      <motion.div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        initial={false}
        animate={{
          borderColor: isDragging ? "oklch(89.9% 0.061 343.231)" : "rgba(255, 255, 255, 0.2)",
          scale: isDragging ? 1.02 : 1,
        }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className={clsx(
          "relative rounded-md p-8 md:p-12 text-center cursor-pointer border-2 border-dashed shadow-sm hover:shadow-md backdrop-blur group",
          isDragging && "ring-4 ring-[oklch(89.9% 0.061 343.231)]/30"
        )}
        style={{
          backgroundColor: "#000000",
          borderColor: isDragging ? "oklch(89.9% 0.061 343.231)" : "rgba(255, 255, 255, 0.2)",
        }}
      >
        <div className="flex flex-col items-center gap-5">
          <motion.div
            animate={{ y: isDragging ? [-5, 0, -5] : 0 }}
            transition={{
              duration: 1.5,
              repeat: isDragging ? Infinity : 0,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <motion.div
              animate={{
                opacity: isDragging ? [0.5, 1, 0.5] : 1,
                scale: isDragging ? [0.95, 1.05, 0.95] : 1,
              }}
              transition={{
                duration: 2,
                repeat: isDragging ? Infinity : 0,
                ease: "easeInOut",
              }}
              className="absolute -inset-4 rounded-full blur-md"
              style={{ 
                display: isDragging ? "block" : "none",
                background: 'linear-gradient(45deg, oklch(89.9% 0.061 343.231), oklch(91.7% 0.08 205.041))',
                opacity: 0.1
              }}
            />
            <UploadCloud
              className={clsx(
                "w-16 h-16 md:w-20 md:h-20 drop-shadow-sm",
                isDragging
                  ? "text-white"
                  : "text-white group-hover:opacity-80 transition-all duration-300"
              )}
              style={{
                filter: isDragging 
                  ? 'drop-shadow(0 0 8px oklch(89.9% 0.061 343.231))'
                  : 'none'
              }}
            />
          </motion.div>

          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-semibold text-white">
              {isDragging
                ? "Drop files here"
                : files.length
                ? "Add more files"
                : "Upload your files"}
            </h3>
            <p className="md:text-lg max-w-md mx-auto" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              {isDragging ? (
                <span className="font-medium text-white">
                  Release to upload
                </span>
              ) : (
                <>
                  Drag & drop files here, or{" "}
                  <span 
                    className="font-medium"
                    style={{
                      background: 'linear-gradient(45deg, oklch(89.9% 0.061 343.231), oklch(91.7% 0.08 205.041))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    browse
                  </span>
                </>
              )}
            </p>
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>All file types supported</p>
          </div>

          <input
            ref={inputRef}
            type="file"
            multiple
            hidden
            onChange={onSelect}
          />
        </div>
      </motion.div>

      {/* Uploaded files list */}
      <div className="mt-8">
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-between items-center mb-3 px-2"
            >
              <h3 className="font-semibold text-lg md:text-xl text-white">
                Uploaded files ({files.length})
              </h3>

              {files.length > 1 && (
                <button
                  onClick={() => {
                    setFiles([]);
                    if (onFilesChange) {
                      onFilesChange([]);
                    }
                  }}
                  className="text-sm font-medium px-3 py-1 rounded-md transition-colors duration-200 text-white hover:bg-white hover:bg-opacity-10"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  Clear all
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={clsx(
            "flex flex-col gap-3 overflow-y-auto pr-2",
            files.length > 3 &&
              "max-h-96 scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent"
          )}
        >
          <AnimatePresence>
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="px-4 py-4 flex items-start gap-4 rounded-md shadow hover:shadow-md transition-all duration-200"
                style={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* Thumbnail */}
                <div className="relative flex-shrink-0">
                  {file.type.startsWith("image/") ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover shadow-sm"
                      style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}
                    />
                  ) : file.type.startsWith("video/") ? (
                    <video
                      src={file.preview}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover shadow-sm"
                      style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}
                      controls={false}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <FileIcon className="w-16 h-16 md:w-20 md:h-20" style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                  )}

                  {file.progress === 100 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -right-2 -bottom-2 rounded-full shadow-sm"
                      style={{ backgroundColor: "#000000" }}
                    >
                      <CheckCircle 
                        className="w-5 h-5" 
                        style={{ 
                          color: 'oklch(89.9% 0.061 343.231)'
                        }}
                      />
                    </motion.div>
                  )}
                </div>

                {/* File info & progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-1 w-full">
                    {/* Filename */}
                    <div className="flex items-center gap-2 min-w-0">
                      <FileIcon className="w-5 h-5 flex-shrink-0 text-white" />
                      <h4
                        className="font-medium text-base md:text-lg truncate text-white"
                        title={file.name}
                      >
                        {file.name}
                      </h4>
                    </div>

                    {/* Details & remove/loading */}
                    <div className="flex items-center justify-between gap-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      <span className="text-xs md:text-sm">
                        {formatFileSize(file.size)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="font-medium">
                          {Math.round(file.progress)}%
                        </span>

                        {file.progress < 100 ? (
                          <Loader 
                            className="w-4 h-4 animate-spin" 
                            style={{ color: 'oklch(89.9% 0.061 343.231)' }}
                          />
                        ) : (
                          <Trash2
                            className="w-4 h-4 cursor-pointer hover:text-red-500 transition-colors duration-200"
                            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setFiles((prev) => {
                                const updated = prev.filter(
                                  (f) => f.id !== file.id
                                );
                                if (onFilesChange) {
                                  onFilesChange(
                                    updated
                                      .map((f) => f.file)
                                      .filter((f) => f !== undefined)
                                  );
                                }
                                return updated;
                              });
                            }}
                            aria-label="Remove file"
                          />
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div
                    className="w-full h-2 rounded-full overflow-hidden mt-3"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${file.progress}%` }}
                      transition={{
                        duration: 0.4,
                        type: "spring",
                        stiffness: 100,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full shadow-inner"
                      style={{
                        background: 'linear-gradient(45deg, oklch(89.9% 0.061 343.231), oklch(91.7% 0.08 205.041))',
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
