"use client";

import { useState } from "react";
import { RoomType } from "@prisma/client";

const defaultImages: Record<RoomType, string> = {
  KELAS: "/uploads/c6be9e5e-c8cc-4cc8-8607-2e4e01154d27.jpeg",
  LAB: "/uploads/9e686415-5288-4e83-9373-198bbca4a922.jpeg",
  AULA: "/uploads/53a74ea0-84cc-4abc-b70f-db1059aa30ea.jpeg",
  RAPAT: "/uploads/502cbb3a-3e65-4bee-ae75-45dd5de75d98.jpeg",
};

export default function RoomImage({
  type,
  imageUrl,
  name,
  className,
}: {
  type: RoomType;
  imageUrl?: string | null;
  name: string;
  className: string;
}) {
  const fallback = defaultImages[type];
  const [src, setSrc] = useState(imageUrl || fallback);

  return (
    <img
      src={src}
      alt={`Foto ${name}`}
      className={className}
      onError={() => {
        if (src !== fallback) setSrc(fallback);
      }}
    />
  );
}
