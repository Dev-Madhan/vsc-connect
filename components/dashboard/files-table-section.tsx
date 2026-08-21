"use client";

import React, { useState } from "react";
import {
  DriveFileItem,
} from "@/lib/drive-data";
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon,
  Link2,
  MoreHorizontal,
  ArrowUpDown,
  Download,
  Trash2,
  Star,
  Info,
  Check,
} from "lucide-react";

interface FilesTableSectionProps {
  files: DriveFileItem[];
  selectedFileId: string | null;
  onSelectFile: (file: DriveFileItem) => void;
  onOpenFileDetails: (file: DriveFileItem) => void;
  onDeleteFile: (fileId: string) => void;
  onToggleStar: (fileId: string) => void;
  isGridView: boolean;
}

export function FilesTableSection({
  files,
  selectedFileId,
  onSelectFile,
  onOpenFileDetails,
  onDeleteFile,
  onToggleStar,
  isGridView,
}: FilesTableSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleCopyLink = (file: DriveFileItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const dummyUrl = `https://drive.goodle.com/file/d/${file.id}/view?usp=sharing`;
    navigator.clipboard.writeText(dummyUrl).catch(() => {});
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to render authentic file type icons matching the mockup
  const renderFileTypeIcon = (fileType: DriveFileItem["fileType"]) => {
    switch (fileType) {
      case "doc":
      case "word":
        return (
          <div className="w-5 h-5 rounded-md bg-[#2684fc] text-white flex items-center justify-center shadow-xs shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            </svg>
          </div>
        );
      case "sheet":
        return (
          <div className="w-5 h-5 rounded-md bg-[#0f9d58] text-white flex items-center justify-center shadow-xs shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H6v-2h3v2zm0-4H6v-2h3v2zm0-4H6V7h3v2zm5 8h-3v-2h3v2zm0-4h-3v-2h3v2zm0-4h-3V7h3v2zm5 8h-3v-2h3v2zm0-4h-3v-2h3v2zm0-4h-3V7h3v2z" />
            </svg>
          </div>
        );
      case "pdf":
        return (
          <div className="w-5 h-5 rounded-md bg-[#ea4335] text-white flex items-center justify-center shadow-xs shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 8.5h1v1H9v-1zm4 1.5h1v1.5h-1V10z" />
            </svg>
          </div>
        );
      case "image":
        return (
          <div className="w-5 h-5 rounded-md bg-[#ff9800] text-white flex items-center justify-center shadow-xs shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-5 h-5 rounded-md bg-gray-400 text-white flex items-center justify-center shadow-xs shrink-0">
            <FileText className="w-3 h-3" />
          </div>
        );
    }
  };

  return (
    <section className="space-y-3">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs sm:text-sm font-bold tracking-wider text-gray-800 uppercase">
          ALL FILES
        </h2>
        <span className="text-xs text-gray-400 font-medium">
          {files.length} items
        </span>
      </div>

      {/* Grid View Mode */}
      {isGridView ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {files.map((file) => {
            const isSelected = selectedFileId === file.id;
            return (
              <div
                key={file.id}
                onClick={() => onSelectFile(file)}
                onDoubleClick={() => onOpenFileDetails(file)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-40 ${
                  isSelected
                    ? "bg-blue-50/80 border-blue-300 ring-2 ring-blue-400/30"
                    : "bg-[#f8fafd] hover:bg-gray-50 border-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  {renderFileTypeIcon(file.fileType)}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStar(file.id);
                    }}
                    className="text-gray-300 hover:text-amber-400"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        file.starred ? "text-amber-400 fill-amber-400" : ""
                      }`}
                    />
                  </button>
                </div>

                <div className="my-2">
                  <p className="text-xs font-semibold text-gray-800 truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-gray-400">{file.fileSize}</p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-gray-100/80">
                  <div className="flex -space-x-1.5">
                    {file.owners.map((owner, idx) => (
                      <img
                        key={owner.id || idx}
                        src={owner.avatarUrl}
                        alt={owner.name}
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
                      />
                    ))}
                  </div>
                  <button
                    onClick={(e) => handleCopyLink(file, e)}
                    className="text-gray-400 hover:text-blue-600"
                    title="Copy share link"
                  >
                    {copiedId === file.id ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Link2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View Mode (Mockup Match) */
        <div className="overflow-x-auto select-none">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <th className="py-2.5 px-3 font-bold">NAME</th>
                <th className="py-2.5 px-3 font-bold">OWNERS</th>
                <th className="py-2.5 px-3 font-bold">LAST MODIFIED</th>
                <th className="py-2.5 px-3 font-bold">FILE SIZE</th>
                <th className="py-2.5 px-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/70 text-xs">
              {files.map((file) => {
                const isSelected = selectedFileId === file.id;

                return (
                  <tr
                    key={file.id}
                    onClick={() => onSelectFile(file)}
                    onDoubleClick={() => onOpenFileDetails(file)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected
                        ? "bg-[#eaf1fb] text-gray-900 font-medium"
                        : "hover:bg-[#f8fafd] text-gray-700"
                    }`}
                  >
                    {/* File Name & Icon */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        {renderFileTypeIcon(file.fileType)}
                        <span className="font-medium text-xs text-gray-900 truncate max-w-xs md:max-w-md">
                          {file.name}
                        </span>
                      </div>
                    </td>

                    {/* Owners Avatar Stack */}
                    <td className="py-3 px-3">
                      <div className="flex items-center -space-x-1.5">
                        {file.owners.map((owner, idx) => (
                          <div
                            key={owner.id || idx}
                            className="w-6 h-6 rounded-full overflow-hidden ring-2 ring-white shadow-2xs shrink-0"
                            title={owner.name}
                          >
                            <img
                              src={owner.avatarUrl}
                              alt={owner.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Last Modified */}
                    <td className="py-3 px-3 text-gray-500 font-normal">
                      {file.lastModified}
                    </td>

                    {/* File Size */}
                    <td className="py-3 px-3 text-gray-500 font-normal">
                      {file.fileSize}
                    </td>

                    {/* Actions: Link icon & 3 dots */}
                    <td className="py-3 px-3 text-right relative">
                      <div className="flex items-center justify-end gap-3 text-gray-400">
                        {/* Copy Link button */}
                        <button
                          onClick={(e) => handleCopyLink(file, e)}
                          type="button"
                          className="p-1 rounded hover:text-[#1c64ec] hover:bg-white/80 transition-colors"
                          title="Copy share link"
                        >
                          {copiedId === file.id ? (
                            <span className="flex items-center text-green-600 text-[11px] font-semibold gap-1">
                              <Check className="w-3.5 h-3.5" /> Copied
                            </span>
                          ) : (
                            <Link2 className="w-4 h-4" />
                          )}
                        </button>

                        {/* More Menu */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(
                                activeMenuId === file.id ? null : file.id
                              );
                            }}
                            type="button"
                            className="p-1 rounded hover:text-gray-700 hover:bg-white/80 transition-colors"
                            title="More actions"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {/* Context dropdown menu */}
                          {activeMenuId === file.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 text-xs text-gray-700 animate-in fade-in zoom-in-95 duration-100"
                            >
                              <button
                                onClick={() => {
                                  onOpenFileDetails(file);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left"
                              >
                                <Info className="w-3.5 h-3.5 text-blue-500" />
                                File details
                              </button>
                              <button
                                onClick={() => {
                                  onToggleStar(file.id);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left"
                              >
                                <Star
                                  className={`w-3.5 h-3.5 ${
                                    file.starred
                                      ? "text-amber-500 fill-amber-500"
                                      : "text-gray-400"
                                  }`}
                                />
                                {file.starred ? "Unstar" : "Add to starred"}
                              </button>
                              <button
                                onClick={() => {
                                  alert(`Downloading ${file.name}...`);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left"
                              >
                                <Download className="w-3.5 h-3.5 text-gray-500" />
                                Download
                              </button>
                              <div className="h-px bg-gray-100 my-1" />
                              <button
                                onClick={() => {
                                  onDeleteFile(file.id);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 text-left"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
