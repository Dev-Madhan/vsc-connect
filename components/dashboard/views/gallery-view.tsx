"use client";

import React, { useState } from "react";
import {
  Images,
  Upload,
  Trash2,
  X,
  FolderPlus,
} from "lucide-react";
import { createAlbumAction, addImageToAlbumAction, deleteImageAction } from "@/app/dashboard/gallery/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface AlbumItem {
  id: string;
  title: string;
  description: string | null;
  images: {
    id: string;
    imageUrl: string;
    caption: string | null;
    createdAt: string;
  }[];
}

interface GalleryViewProps {
  albums: AlbumItem[];
}

export function GalleryView({ albums: initialAlbums }: GalleryViewProps) {
  const [albums, setAlbums] = useState<AlbumItem[]>(initialAlbums);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>(initialAlbums[0]?.id ?? "");
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumDesc, setAlbumDesc] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [imgCaption, setImgCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeAlbum = albums.find((a) => a.id === selectedAlbumId) ?? albums[0];

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumTitle.trim()) return;
    setIsSubmitting(true);
    const res = await createAlbumAction(albumTitle, albumDesc);
    setIsSubmitting(false);
    if (res.ok) {
      const newAlbum: AlbumItem = {
        id: res.data.id,
        title: albumTitle,
        description: albumDesc || null,
        images: [],
      };
      setAlbums([newAlbum, ...albums]);
      setSelectedAlbumId(newAlbum.id);
      setIsAlbumModalOpen(false);
      setAlbumTitle("");
      setAlbumDesc("");
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imgUrl.trim() || !activeAlbum) return;
    setIsSubmitting(true);
    const res = await addImageToAlbumAction({
      galleryId: activeAlbum.id,
      imageUrl: imgUrl,
      caption: imgCaption,
    });
    setIsSubmitting(false);
    if (res.ok) {
      const newImage = {
        id: res.data.id,
        imageUrl: imgUrl,
        caption: imgCaption || null,
        createdAt: new Date().toISOString(),
      };
      setAlbums((prev) =>
        prev.map((a) =>
          a.id === activeAlbum.id ? { ...a, images: [newImage, ...a.images] } : a
        )
      );
      setIsUploadModalOpen(false);
      setImgUrl("");
      setImgCaption("");
    }
  };

  const handleDeleteImage = async (imgId: string) => {
    if (!confirm("Are you sure you want to remove this photo?")) return;
    const res = await deleteImageAction(imgId);
    if (res.ok) {
      setAlbums((prev) =>
        prev.map((a) =>
          a.id === activeAlbum.id
            ? { ...a, images: a.images.filter((img) => img.id !== imgId) }
            : a
        )
      );
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Media & Gallery Management</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Organize albums and assets stored on Cloudflare R2 object storage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsAlbumModalOpen(true)}
            className="h-10 px-4 rounded-xl text-xs font-bold border-border"
          >
            <FolderPlus className="w-4 h-4 mr-1.5 text-[#5B50E5]" />
            <span>New Album</span>
          </Button>
          {activeAlbum && (
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="h-10 px-4 rounded-xl bg-[#5B50E5] hover:bg-[#4C40D4] text-white text-xs font-bold shadow-md"
            >
              <Upload className="w-4 h-4 mr-1.5" />
              <span>Add Photo</span>
            </Button>
          )}
        </div>
      </div>

      {/* Album Switcher Tabs */}
      {albums.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {albums.map((alb) => (
            <button
              key={alb.id}
              onClick={() => setSelectedAlbumId(alb.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                selectedAlbumId === alb.id
                  ? "bg-[#5B50E5] text-white border-[#5B50E5] shadow-sm"
                  : "bg-white text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              <span>{alb.title}</span>
              <span className="ml-2 text-[10px] opacity-75 font-normal">({alb.images.length})</span>
            </button>
          ))}
        </div>
      )}

      {/* Album Content Grid */}
      {!activeAlbum ? (
        <div className="p-16 text-center rounded-2xl border border-dashed border-border bg-white space-y-3">
          <Images className="w-12 h-12 text-muted-foreground/40 mx-auto" />
          <h3 className="text-sm font-bold text-foreground">No albums created yet</h3>
          <p className="text-xs text-muted-foreground">Click &ldquo;New Album&rdquo; to create your first media collection.</p>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-foreground">{activeAlbum.title}</h2>
            {activeAlbum.description && (
              <p className="text-xs text-muted-foreground mt-0.5">{activeAlbum.description}</p>
            )}
          </div>

          {activeAlbum.images.length === 0 ? (
            <div className="p-16 text-center rounded-2xl border border-dashed border-border bg-white space-y-3">
              <Upload className="w-10 h-10 text-muted-foreground/40 mx-auto" />
              <h3 className="text-sm font-bold text-foreground">This album is empty</h3>
              <p className="text-xs text-muted-foreground">Upload photos from campus events or paste high-res media links.</p>
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                className="mt-2 h-9 px-4 rounded-xl bg-[#5B50E5] text-white text-xs font-bold"
              >
                Add First Photo
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {activeAlbum.images.map((img) => (
                <div
                  key={img.id}
                  className="group relative rounded-2xl border border-border/70 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all"
                >
                  <div className="h-44 w-full bg-slate-100 flex items-center justify-center relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.imageUrl}
                      alt={img.caption ?? "Gallery photo"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                      <p className="text-white text-xs font-semibold truncate">{img.caption ?? "Vistara archive"}</p>
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors shrink-0"
                        title="Delete image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: New Album */}
      {isAlbumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-border bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAlbumModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-muted text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-foreground">Create Album</h3>
            <form onSubmit={handleCreateAlbum} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="alb-title" className="text-xs font-semibold">Album Title</Label>
                <Input
                  id="alb-title"
                  required
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  placeholder="e.g. Acoustica Concert 2026"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="alb-desc" className="text-xs font-semibold">Description</Label>
                <textarea
                  id="alb-desc"
                  rows={2}
                  value={albumDesc}
                  onChange={(e) => setAlbumDesc(e.target.value)}
                  placeholder="Brief context..."
                  className="mt-1 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 rounded-xl bg-[#5B50E5] hover:bg-[#4C40D4] text-white font-bold text-xs"
              >
                {isSubmitting ? "Creating..." : "Create Album"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Photo */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-border bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-muted text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-foreground">Add Photo to {activeAlbum?.title}</h3>
            <form onSubmit={handleAddImage} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="photo-url" className="text-xs font-semibold">Image URL (CDN / R2 / Unsplash)</Label>
                <Input
                  id="photo-url"
                  required
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="photo-cap" className="text-xs font-semibold">Caption</Label>
                <Input
                  id="photo-cap"
                  value={imgCaption}
                  onChange={(e) => setImgCaption(e.target.value)}
                  placeholder="e.g. Lead guitarist performing solo"
                  className="mt-1"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 rounded-xl bg-[#5B50E5] hover:bg-[#4C40D4] text-white font-bold text-xs"
              >
                {isSubmitting ? "Adding..." : "Add to Album"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
