"use client";

// ImagePreview.tsx
import React from "react";
import Image from "next/image";

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
  size?: string; // Tailwind size, e.g. "w-32 h-32"
}

export default function ImagePreview({
  file,
  onRemove,
  size = "w-32 h-32",
}: ImagePreviewProps) {
  return (
    <div className={`relative group ${size}`}>
      {/* Image */}
      <Image
        width={32}
        height={32}
        src={URL.createObjectURL(file)}
        alt={"Preview"}
        className={`rounded-lg border object-cover transition duration-300 group-hover:blur-sm ${size}`}
      ></Image>

      {/* Overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center
                   text-white text-sm font-medium
                   bg-black/40 opacity-0 group-hover:opacity-100
                   rounded-lg cursor-pointer transition duration-300"
        onClick={onRemove}
      >
        Remove
      </div>
    </div>
  );
}
