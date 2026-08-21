"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  HelpCircle,
  Settings,
  SlidersHorizontal,
  Menu,
  X,
  CheckCircle2,
} from "lucide-react";
import { CURRENT_USER } from "@/lib/drive-data";

interface DriveHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleMobileMenu?: () => void;
  onOpenSettings?: () => void;
}

export function DriveHeader({
  searchQuery,
  onSearchChange,
  onToggleMobileMenu,
  onOpenSettings,
}: DriveHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="flex items-center justify-between gap-4 px-6 md:px-8 py-4 bg-white border-b border-gray-100 select-none shrink-0">
      {/* Brand & Mobile Toggle */}
      <div className="flex items-center gap-4 w-60 shrink-0">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative flex items-center justify-center shrink-0">
            <svg viewBox="0 0 87.3 78" className="w-7 h-7 drop-shadow-xs">
              <path
                d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z"
                fill="#0066da"
              />
              <path
                d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44A9.06 9.06 0 0 0 0 53h27.5z"
                fill="#00ac47"
              />
              <path
                d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.15z"
                fill="#ea4335"
              />
              <path
                d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z"
                fill="#00832d"
              />
              <path
                d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
                fill="#2684fc"
              />
              <path
                d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25 59.8 53h27.5c0-1.55-.4-3.1-1.2-4.5z"
                fill="#ffba00"
              />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1c64ec] font-sans hidden sm:inline-block">
            Goodle Drive
          </span>
        </div>
      </div>

      {/* Pill Search Bar */}
      <div className="flex-1 max-w-xl mx-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Drive..."
            className="w-full bg-[#f1f4f9] hover:bg-[#ebf0f7] focus:bg-white text-gray-800 placeholder-gray-400 text-sm rounded-full pl-10 pr-9 py-2.5 outline-none focus:ring-2 focus:ring-blue-400/40 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right Icons & User Profile */}
      <div className="flex items-center gap-3 sm:gap-4 relative shrink-0">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowHelp(false);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="font-semibold text-sm text-gray-900">Notifications</span>
                <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="py-2 space-y-3">
                <div className="flex gap-3 text-xs text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Sarah shared "Design Files" with you</p>
                    <span className="text-[10px] text-gray-400">10 minutes ago</span>
                  </div>
                </div>
                <div className="flex gap-3 text-xs text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Weekly report backup completed</p>
                    <span className="text-[10px] text-gray-400">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Circle */}
        <div className="relative">
          <button
            onClick={() => {
              setShowHelp(!showHelp);
              setShowNotifications(false);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {showHelp && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
              <p className="font-semibold text-gray-900 mb-2">Keyboard Shortcuts</p>
              <div className="space-y-1.5 text-gray-600">
                <div className="flex justify-between">
                  <span>Search</span> <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">Ctrl+K</kbd>
                </div>
                <div className="flex justify-between">
                  <span>New Upload</span> <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">U</kbd>
                </div>
                <div className="flex justify-between">
                  <span>New Folder</span> <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">F</kbd>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* User Badge: "Jessica" + blue circle avatar "J" */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
              setShowHelp(false);
            }}
            className="flex items-center gap-2.5 py-1 px-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <span className="text-sm font-medium text-gray-700 hidden lg:inline-block">
              {CURRENT_USER.name}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#1c64ec] text-white flex items-center justify-center font-semibold text-xs shadow-xs ring-2 ring-blue-100">
              J
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">Jessica Miller</p>
                <p className="text-xs text-gray-500">jessica@vistara.io</p>
              </div>
              <div className="py-1 text-xs text-gray-700">
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg">
                  Account Settings
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg">
                  Manage Storage (60.7 GB)
                </button>
                <button className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sliders / View Adjuster */}
        <button
          onClick={() => alert("Dashboard filters and preferences")}
          className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="View options"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
