"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Images } from "lucide-react";
import {
  FolderCard,
  DEFAULT_GALLERY_FOLDERS,
  type GalleryFolderItem,
} from "@/components/public/cards-folder";
import { GalleryAlbumLightbox } from "@/components/public/gallery-album-lightbox";

export function GallerySection() {
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryFolderItem | null>(null);

  // Take the signature 3 cards for the homepage featured showcase
  const featuredFolders = DEFAULT_GALLERY_FOLDERS.slice(0, 3);

  return (
    <section id="gallery" className="py-20 md:py-28 relative border-t border-border/40 bg-muted/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B50E5]/10 text-[#5B50E5] dark:text-[#A78BFA] text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3 h-3" />
              <span>Signature Moments</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Life at Vistara
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl">
              Hover each folder to reveal the signature 3D artwork. Click to explore photographic archives of campus hackathons, fests, and competitions.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#5B50E5] text-white text-xs font-bold hover:bg-[#4E43D8] transition-all shadow-md shadow-[#5B50E5]/25 group shrink-0"
          >
            <Images className="w-4 h-4" />
            <span>Explore All 6 Albums</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Featured Folder Cards */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 py-4">
          {featuredFolders.map((folder) => (
            <FolderCard
              key={folder.id}
              item={folder}
              onClick={(item) => setSelectedAlbum(item)}
            />
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <span>Looking for full archives, high-res downloads, and behind-the-scenes?</span>
            <span className="text-[#5B50E5] dark:text-[#A78BFA] underline underline-offset-4 group-hover:no-underline">
              Open Gallery Vault &rarr;
            </span>
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      <GalleryAlbumLightbox
        album={selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
      />
    </section>
  );
}
