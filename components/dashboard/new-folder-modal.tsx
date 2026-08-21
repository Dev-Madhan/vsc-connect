"use client";

import React, { useState } from "react";
import { FolderPlus, X } from "lucide-react";
import { QuickAccessFolder, MOCK_USERS } from "@/lib/drive-data";

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (newFolder: QuickAccessFolder) => void;
}

export function NewFolderModal({
  isOpen,
  onClose,
  onCreateFolder,
}: NewFolderModalProps) {
  const [folderName, setFolderName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    const newFolder: QuickAccessFolder = {
      id: `folder-${Date.now()}`,
      title: folderName.trim(),
      type: "folder",
      itemCount: 0,
      sharedWith: [MOCK_USERS.jessica],
    };

    onCreateFolder(newFolder);
    setFolderName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1c64ec] flex items-center justify-center">
              <FolderPlus className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-gray-900">New Folder</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
              Folder Name
            </label>
            <input
              type="text"
              autoFocus
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="e.g. Q4 Marketing Campaigns"
              className="w-full bg-gray-50 border border-gray-200 focus:border-[#1c64ec] focus:bg-white text-sm rounded-xl px-3.5 py-2.5 outline-none transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!folderName.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1c64ec] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all"
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
