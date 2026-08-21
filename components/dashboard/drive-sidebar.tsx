"use client";

import React from "react";
import {
  HardDrive,
  Monitor,
  Users,
  Clock,
  Trash2,
  Star,
  RotateCcw,
  Cloud,
  Image as ImageIcon,
  Plus,
  ArrowUpRight,
} from "lucide-react";

export type NavCategory =
  | "my-drive"
  | "computers"
  | "shared"
  | "recents"
  | "trash"
  | "starred"
  | "backups";

interface DriveSidebarProps {
  activeCategory: NavCategory;
  onSelectCategory: (category: NavCategory) => void;
  onOpenUpload: () => void;
  storageUsedGB?: number;
  photosUsedGB?: number;
  totalStorageGB?: number;
  className?: string;
  onCloseMobile?: () => void;
}

export function DriveSidebar({
  activeCategory,
  onSelectCategory,
  onOpenUpload,
  storageUsedGB = 60.7,
  photosUsedGB = 10.7,
  totalStorageGB = 1000,
  className = "",
  onCloseMobile,
}: DriveSidebarProps) {
  const navItems: { id: NavCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "my-drive", label: "My Drive", icon: HardDrive },
    { id: "computers", label: "Computers", icon: Monitor },
    { id: "shared", label: "Shared With Me", icon: Users },
    { id: "recents", label: "Recents", icon: Clock },
    { id: "trash", label: "Trash", icon: Trash2 },
    { id: "starred", label: "Starred", icon: Star },
    { id: "backups", label: "Backups", icon: RotateCcw },
  ];

  const handleNavClick = (id: NavCategory) => {
    onSelectCategory(id);
    if (onCloseMobile) onCloseMobile();
  };

  const storagePercentage = Math.min(100, Math.round((storageUsedGB / totalStorageGB) * 100));
  const photosPercentage = Math.min(100, Math.round((photosUsedGB / totalStorageGB) * 100));

  return (
    <aside
      className={`w-60 lg:w-64 shrink-0 bg-[#2264e5] text-white flex flex-col justify-between p-6 select-none transition-all rounded-tr-[36px] md:rounded-tr-[40px] shadow-sm ${className}`}
    >
      {/* Top Upload & Nav */}
      <div className="flex flex-col space-y-6">
        {/* Upload Button */}
        <div className="pt-1">
          <button
            onClick={onOpenUpload}
            type="button"
            className="w-full bg-white hover:bg-blue-50 text-[#2264e5] font-semibold text-sm py-3 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#2264e5] group-hover:rotate-90 transition-transform duration-200" />
            <span>Upload New Files</span>
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                type="button"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer ${
                  isActive
                    ? "bg-white/20 text-white font-semibold shadow-inner"
                    : "text-blue-100/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-blue-200"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Storage Details */}
      <div className="pt-6 border-t border-white/15 space-y-4">
        <div className="text-[11px] font-semibold tracking-wider text-blue-200/90 uppercase">
          STORAGE DETAILS
        </div>

        {/* Cloud Storage Meter */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-blue-100 font-medium">
            <Cloud className="w-3.5 h-3.5 text-blue-200" />
            <span>Storage</span>
          </div>
          <div className="w-full bg-white/25 rounded-full h-1 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(8, storagePercentage)}%` }}
            />
          </div>
          <div className="text-[11px] text-blue-200/90 font-normal">
            {storageUsedGB.toFixed(2)} GB of {totalStorageGB >= 1000 ? `${totalStorageGB / 1000} TB` : `${totalStorageGB} GB`} used
          </div>
        </div>

        {/* Photos Meter */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-blue-100 font-medium">
            <ImageIcon className="w-3.5 h-3.5 text-blue-200" />
            <span>Photos</span>
          </div>
          <div className="w-full bg-white/25 rounded-full h-1 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, photosPercentage)}%` }}
            />
          </div>
          <div className="text-[11px] text-blue-200/90 font-normal">
            {photosUsedGB.toFixed(2)} GB of {totalStorageGB >= 1000 ? `${totalStorageGB / 1000} TB` : `${totalStorageGB} GB`} used
          </div>
        </div>

        {/* Upgrade Link */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => alert("Storage Upgrade plan options: 2 TB @ $9.99/mo, 5 TB @ $19.99/mo.")}
            className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-blue-100 transition-colors cursor-pointer hover:underline"
          >
            <span>Upgrade Storage</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
