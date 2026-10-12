"use client";

import React, { useState } from "react";
import { Upload, Plus, Trash2, Image as ImageIcon, Link as LinkIcon, Eye, X } from "lucide-react";
import { ProjectImageModel } from "@/types";

interface ScreenshotUploaderProps {
  projectId: string;
  images: ProjectImageModel[];
  onImagesChange: (updated: ProjectImageModel[]) => void;
  maxImages?: number;
}

export default function ScreenshotUploader({
  projectId,
  images,
  onImagesChange,
  maxImages = 6,
}: ScreenshotUploaderProps) {
  const [urlInput, setUrlInput] = useState("");
  const [captionInput, setCaptionInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showUrlField, setShowUrlField] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        await addImage(base64, captionInput || file.name.replace(/\.[^/.]+$/, ""));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    await addImage(urlInput.trim(), captionInput);
    setUrlInput("");
    setCaptionInput("");
    setShowUrlField(false);
  };

  const addImage = async (imageUrl: string, caption?: string) => {
    if (images.length >= maxImages) {
      alert(`Maximum of ${maxImages} screenshots allowed.`);
      return;
    }

    setIsUploading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          caption,
          sortOrder: images.length + 1,
        }),
      });

      const data = await res.json();
      if (data.success && data.image) {
        onImagesChange([...images, data.image]);
      } else {
        alert(data.error || "Failed to add screenshot.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading screenshot.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/images/${imageId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        onImagesChange(images.filter((img) => img.id !== imageId));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete screenshot.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* File upload button */}
        <label className="flex-1 border-2 border-dashed border-[#2A2A2F] hover:border-[#3E3E46] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-[#121214] hover:bg-[#17171A] transition-all text-center group">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading || images.length >= maxImages}
          />
          <Upload className="w-5 h-5 text-[#FAFAFA] group-hover:scale-105 transition-transform mb-1.5" />
          <span className="text-xs font-semibold text-[#FAFAFA]">
            {isUploading ? "Uploading Screenshot..." : "Upload Screenshot from Device"}
          </span>
          <span className="text-[11px] text-[#71717A] mt-0.5">
            PNG, JPG, or WebP (up to {maxImages} total)
          </span>
        </label>

        {/* URL upload button */}
        <button
          type="button"
          onClick={() => setShowUrlField(!showUrlField)}
          className="sm:w-48 border border-[#2A2A2F] hover:border-[#3E3E46] bg-[#121214] hover:bg-[#17171A] rounded-xl p-4 flex flex-col items-center justify-center transition-all text-center group cursor-pointer"
        >
          <LinkIcon className="w-5 h-5 text-[#A1A1AA] group-hover:scale-105 transition-transform mb-1.5" />
          <span className="text-xs font-semibold text-[#FAFAFA]">Add by Image URL</span>
          <span className="text-[11px] text-[#71717A] mt-0.5">Paste direct image link</span>
        </button>
      </div>

      {/* URL input modal / accordion */}
      {showUrlField && (
        <form
          onSubmit={handleUrlSubmit}
          className="p-4 rounded-xl border border-[#2A2A2F] bg-[#17171A] space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#FAFAFA]">Image Web URL</span>
            <button
              type="button"
              onClick={() => setShowUrlField(false)}
              className="text-[#A1A1AA] hover:text-[#FAFAFA]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/screenshot.png"
            className="w-full px-3 py-2 rounded-lg bg-[#101012] border border-[#2A2A2F] text-xs text-[#FAFAFA] placeholder-[#71717A] focus:outline-none focus:border-[#FAFAFA]"
            required
          />
          <input
            type="text"
            value={captionInput}
            onChange={(e) => setCaptionInput(e.target.value)}
            placeholder="Screenshot caption (e.g., Real-time Analytics Dashboard)"
            className="w-full px-3 py-2 rounded-lg bg-[#101012] border border-[#2A2A2F] text-xs text-[#FAFAFA] placeholder-[#71717A] focus:outline-none focus:border-[#FAFAFA]"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowUrlField(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-[#A1A1AA] hover:text-[#FAFAFA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-1.5 rounded-lg bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#111111] text-xs font-semibold cursor-pointer"
            >
              {isUploading ? "Adding..." : "Add Screenshot"}
            </button>
          </div>
        </form>
      )}

      {/* Screenshots Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="group relative rounded-xl border border-[#2A2A2F] bg-[#121214] overflow-hidden shadow-sm flex flex-col"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-[#101012]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.image_url}
                  alt={img.caption || `Screenshot ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setPreviewImage(img.image_url)}
                    className="p-2 rounded-lg bg-[#17171A] hover:bg-[#1E1E22] text-[#FAFAFA] border border-[#2A2A2F]"
                    title="View Full Size"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(img.id)}
                    className="p-2 rounded-lg bg-[#EF4444] hover:bg-[#EF4444]/90 text-white"
                    title="Delete Screenshot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-2.5 text-xs">
                <span className="text-[10px] uppercase font-mono text-[#71717A] block mb-0.5">
                  Screenshot #{idx + 1}
                </span>
                <p className="text-[#FAFAFA] truncate font-medium">
                  {img.caption || "No caption added"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 border border-[#2A2A2F] rounded-xl bg-[#121214] text-center">
          <ImageIcon className="w-8 h-8 text-[#52525B] mx-auto mb-2" />
          <p className="text-xs text-[#FAFAFA] font-medium">No screenshots uploaded yet</p>
          <p className="text-[11px] text-[#71717A] mt-1">
            Adding screenshots gives recruiters and clients proof of your work.
          </p>
        </div>
      )}

      {/* Lightbox Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300"
            >
              <X className="w-6 h-6" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt="Screenshot Preview"
              className="rounded-xl max-h-[85vh] w-auto object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
