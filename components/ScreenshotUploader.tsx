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
        <label className="flex-1 border-2 border-dashed border-slate-700/80 hover:border-indigo-500/80 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all text-center group">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading || images.length >= maxImages}
          />
          <Upload className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform mb-1.5" />
          <span className="text-xs font-semibold text-slate-200">
            {isUploading ? "Uploading Screenshot..." : "Upload Screenshot from Device"}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5">
            PNG, JPG, or WebP (up to {maxImages} total)
          </span>
        </label>

        {/* URL upload button */}
        <button
          type="button"
          onClick={() => setShowUrlField(!showUrlField)}
          className="sm:w-48 border border-slate-700/80 hover:border-slate-600 bg-slate-900/40 hover:bg-slate-900/80 rounded-xl p-4 flex flex-col items-center justify-center transition-all text-center group cursor-pointer"
        >
          <LinkIcon className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform mb-1.5" />
          <span className="text-xs font-semibold text-slate-200">Add by Image URL</span>
          <span className="text-[11px] text-slate-500 mt-0.5">Paste Unsplash/Cloud link</span>
        </button>
      </div>

      {/* URL input modal / accordion */}
      {showUrlField && (
        <form
          onSubmit={handleUrlSubmit}
          className="p-4 rounded-xl border border-indigo-500/30 bg-slate-900/80 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">Image Web URL</span>
            <button
              type="button"
              onClick={() => setShowUrlField(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/screenshot.png"
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            required
          />
          <input
            type="text"
            value={captionInput}
            onChange={(e) => setCaptionInput(e.target.value)}
            placeholder="Screenshot caption (e.g., Real-time Analytics Dashboard)"
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowUrlField(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium cursor-pointer"
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
              className="group relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-md flex flex-col"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.image_url}
                  alt={img.caption || `Screenshot ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setPreviewImage(img.image_url)}
                    className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white"
                    title="View Full Size"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(img.id)}
                    className="p-2 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white"
                    title="Delete Screenshot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-2.5 text-xs">
                <span className="text-[10px] uppercase font-mono text-indigo-400 block mb-0.5">
                  Screenshot #{idx + 1}
                </span>
                <p className="text-slate-300 truncate font-medium">
                  {img.caption || "No caption added"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 border border-slate-800 rounded-xl bg-slate-950/40 text-center">
          <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-medium">No screenshots uploaded yet</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Adding 2–4 screenshots dramatically increases recruiter trust and proves your project is real!
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
