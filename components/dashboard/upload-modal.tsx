"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, File, CheckCircle2 } from "lucide-react";
import { DriveFileItem, MOCK_USERS } from "@/lib/drive-data";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newFile: DriveFileItem) => void;
}

export function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsUploading(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Determine file type
            const ext = file.name.split(".").pop()?.toLowerCase() || "";
            let fileType: DriveFileItem["fileType"] = "doc";
            if (["xls", "xlsx", "csv"].includes(ext)) fileType = "sheet";
            else if (["pdf"].includes(ext)) fileType = "pdf";
            else if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) fileType = "image";
            else if (["doc", "docx"].includes(ext)) fileType = "word";

            const formattedSize =
              file.size > 1024 * 1024
                ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                : `${(file.size / 1024).toFixed(0)} KB`;

            const newDoc: DriveFileItem = {
              id: `file-upload-${Date.now()}`,
              name: file.name,
              fileType,
              owners: [MOCK_USERS.jessica],
              lastModified: "Just now",
              fileSize: formattedSize,
              sizeInBytes: file.size,
              category: "my-drive",
              description: "Uploaded document",
            };

            onUploadSuccess(newDoc);
            setIsUploading(false);
            setUploadProgress(0);
            onClose();
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Upload New Files</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            isDragging
              ? "border-[#1c64ec] bg-blue-50/50 scale-[1.01]"
              : "border-gray-200 hover:border-blue-400 hover:bg-gray-50/60"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1c64ec] flex items-center justify-center mb-3">
            <UploadCloud className="w-7 h-7" />
          </div>

          <p className="text-sm font-semibold text-gray-800">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PDF, DOCX, XLSX, JPG, PNG up to 50MB
          </p>
        </div>

        {/* Uploading progress state */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-gray-700">
              <span>Uploading file...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#1c64ec] h-full rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
