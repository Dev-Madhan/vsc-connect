"use client";

import React from "react";
import Image from "next/image";
import { QuickAccessFolder } from "@/lib/drive-data";
import { FileText } from "lucide-react";

interface QuickAccessSectionProps {
  items: QuickAccessFolder[];
  onSelectFolder: (folder: QuickAccessFolder) => void;
  selectedId?: string;
}

export function QuickAccessSection({
  items,
  onSelectFolder,
  selectedId,
}: QuickAccessSectionProps) {
  return (
    <section className="space-y-4">
      {/* Title */}
      <h2 className="text-xs sm:text-sm font-bold tracking-wider text-gray-800 uppercase">
        QUICK ACCESS
      </h2>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item) => {
          const isSelected = selectedId === item.id || (!selectedId && item.isPrimaryActive);

          // Card 4: Document Type
          if (item.type === "file") {
            return (
              <div
                key={item.id}
                onClick={() => onSelectFolder(item)}
                className="relative bg-[#f4f6fb] hover:bg-[#ebf0f8] rounded-3xl p-5 flex flex-col justify-between h-44 cursor-pointer transition-all duration-200 border border-transparent hover:border-blue-200 hover:shadow-sm group"
              >
                {/* Top: Document Icon + Owner Avatar */}
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-white text-[#1c64ec] shadow-sm flex items-center justify-center border border-blue-50">
                    <FileText className="w-4 h-4 text-[#1c64ec]" />
                  </div>
                  {item.sharedWith && item.sharedWith[0] && (
                    <div className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-white shadow-sm shrink-0">
                      <img
                        src={item.sharedWith[0].avatarUrl}
                        alt={item.sharedWith[0].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Middle: Document Title */}
                <div className="py-2">
                  <p className="text-sm font-semibold text-[#1c64ec] group-hover:text-blue-700 leading-snug line-clamp-2">
                    {item.title}
                  </p>
                </div>

                {/* Bottom: Last Modified */}
                <div>
                  <div className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    LAST MODIFIED
                  </div>
                  <div className="text-xs font-semibold text-gray-800">
                    {item.lastModified || "Sep 9 ,2019 - 4:30 AM"}
                  </div>
                </div>
              </div>
            );
          }

          // Folders (Primary Active Blue Folder or Light Folder)
          if (isSelected) {
            return (
              <div
                key={item.id}
                onClick={() => onSelectFolder(item)}
                className="relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg h-44 flex flex-col justify-between"
              >
                {/* Folder Silhouette with Custom Tab */}
                <div className="absolute inset-0 bg-[#1c64ec] rounded-3xl" />
                {/* Top Tab Overlay accent */}
                <div className="relative p-5 flex flex-col justify-between h-full z-10 text-white">
                  {/* Shared with & Avatars */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold tracking-wider text-blue-200 uppercase">
                      SHARED WITH
                    </span>
                    <div className="flex items-center -space-x-2">
                      {item.sharedWith?.slice(0, 4).map((user, idx) => (
                        <div
                          key={user.id || idx}
                          className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-[#1c64ec] shadow-sm shrink-0 bg-blue-400"
                        >
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Folder Label & Name */}
                  <div className="pt-2">
                    <span className="text-[11px] font-medium tracking-wider text-blue-200 uppercase block">
                      FOLDER
                    </span>
                    <span className="text-base font-bold text-white tracking-tight block truncate">
                      {item.title}
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          // Light Soft Gray Folder Card
          return (
            <div
              key={item.id}
              onClick={() => onSelectFolder(item)}
              className="relative bg-[#f4f6fb] hover:bg-[#ebf0f8] rounded-3xl p-5 flex flex-col justify-between h-44 cursor-pointer transition-all duration-200 border border-transparent hover:border-blue-200 hover:shadow-sm group"
            >
              {/* Top: Shared With & Avatars */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold tracking-wider text-gray-700 uppercase">
                  SHARED WITH
                </span>
                <div className="flex items-center -space-x-2">
                  {item.sharedWith?.slice(0, 4).map((user, idx) => (
                    <div
                      key={user.id || idx}
                      className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-white shadow-sm shrink-0 bg-gray-200"
                    >
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom: Folder Label & Title */}
              <div className="pt-2">
                <span className="text-[11px] font-medium tracking-wider text-gray-400 uppercase block">
                  FOLDER
                </span>
                <span className="text-base font-semibold text-[#1c64ec] group-hover:text-blue-700 tracking-tight block truncate">
                  {item.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
