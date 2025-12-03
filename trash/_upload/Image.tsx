"use client";

import { useEffect, useState } from "react";
import api from "@/lib/auth";

export default function ImageViewer({ fileId }: { fileId: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!fileId) return;

    let objectUrl: string;

    const loadImage = async () => {
      try {
        const res = await api.get(`/api/file/${fileId}/view`, {
          responseType: "blob",   // 👈 important
        });

        const blob = res.data;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);

      } catch (err) {
        console.error("Image fetch failed:", err);
      }
    };

    loadImage();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [fileId]);

  if (!url) return <div>Loading image...</div>;

  return (
    <img
      src={url}
      alt="File"
      className="rounded-md max-w-full h-auto object-contain"
    />
  );
}
