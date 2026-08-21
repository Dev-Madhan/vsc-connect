"use client";

import React from "react";
import { DriveFileItem } from "@/lib/drive-data";
import {
  X,
  FileText,
  Download,
  Share2,
  Calendar,
  HardDrive,
  Users,
  Eye,
  Star,
  ExternalLink,
} from "lucide-react";

interface FileDetailsPanelProps {
  file: DriveFileItem | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleStar: (fileId: string) => void;
}

export function FileDetailsPanel({
  file,
  isOpen,
  onClose,
  onToggleStar,
}: FileDetailsPanelProps) {
  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-80 md:w-96 bg-white shadow-2xl border-l border-gray-100 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
      <div className="space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900 truncate">
              File Details
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleStar(file.id)}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-amber-500 transition-colors"
            >
              <Star
                className={`w-4 h-4 ${
                  file.starred ? "text-amber-500 fill-amber-500" : ""
                }`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Thumbnail */}
        <div className="rounded-2xl bg-[#f4f6fb] border border-gray-100 p-6 flex flex-col items-center justify-center text-center overflow-hidden min-h-[160px] relative group">
          {file.previewUrl ? (
            <img
              src={file.previewUrl}
              alt={file.name}
              className="w-full h-36 object-cover rounded-xl shadow-xs"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#1c64ec] mb-2">
              <FileText className="w-8 h-8" />
            </div>
          )}
          <span className="text-xs font-semibold text-gray-800 mt-2 block truncate max-w-full">
            {file.name}
          </span>
        </div>

        {/* Metadata Details */}
        <div className="space-y-4 text-xs">
          <h4 className="font-bold text-gray-800 uppercase tracking-wider text-[11px]">
            Properties
          </h4>

          <div className="space-y-3 divide-y divide-gray-50 text-gray-600">
            <div className="flex justify-between py-1.5">
              <span className="flex items-center gap-2 text-gray-400">
                <FileText className="w-3.5 h-3.5" /> Type
              </span>
              <span className="font-semibold text-gray-800 uppercase">
                {file.fileType}
              </span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="flex items-center gap-2 text-gray-400">
                <HardDrive className="w-3.5 h-3.5" /> Size
              </span>
              <span className="font-semibold text-gray-800">
                {file.fileSize}
              </span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-3.5 h-3.5" /> Modified
              </span>
              <span className="font-semibold text-gray-800">
                {file.lastModified}
              </span>
            </div>

            <div className="py-2 space-y-2">
              <span className="flex items-center gap-2 text-gray-400">
                <Users className="w-3.5 h-3.5" /> Collaborators & Owners
              </span>
              <div className="flex flex-col gap-2 pt-1">
                {file.owners.map((owner) => (
                  <div
                    key={owner.id}
                    className="flex items-center gap-2.5 bg-gray-50 p-2 rounded-xl"
                  >
                    <img
                      src={owner.avatarUrl}
                      alt={owner.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">
                        {owner.name}
                      </p>
                      <p className="text-[10px] text-gray-400">Owner (Full Access)</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {file.description && (
              <div className="py-2">
                <span className="text-gray-400 block mb-1">Description</span>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-2.5 rounded-xl">
                  {file.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-gray-100 flex gap-2">
        <button
          onClick={() => alert(`Downloading ${file.name}`)}
          className="flex-1 py-2.5 bg-[#1c64ec] hover:bg-blue-700 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(
              `https://drive.goodle.com/file/d/${file.id}`
            );
            alert("Share link copied to clipboard!");
          }}
          className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs flex items-center justify-center transition-colors cursor-pointer"
          title="Share"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
