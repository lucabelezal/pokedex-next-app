"use client";

import { useRef } from "react";
import { TrashIcon } from "@/components/icons";

const THRESHOLD = 80; // px mínimo para confirmar delete

type SwipeToDeleteProps = {
  onDelete: () => void;
  children: React.ReactNode;
};

export function SwipeToDelete({ onDelete, children }: SwipeToDeleteProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentOffset = useRef(0);
  const isDragging = useRef(false);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    startX.current = e.clientX;
    isDragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    if (cardRef.current) {
      cardRef.current.style.transition = "none";
    }
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current) return;
    const diff = Math.min(0, e.clientX - startX.current);
    currentOffset.current = diff;
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${diff}px)`;
    }
  }

  function handlePointerUp() {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (cardRef.current) {
      cardRef.current.style.transition = "transform 0.25s ease";
      cardRef.current.style.transform = "translateX(0)";
    }

    if (currentOffset.current < -THRESHOLD) {
      onDelete();
    }

    currentOffset.current = 0;
  }

  return (
    <div className="relative overflow-hidden rounded-[16px]">
      {/* Fundo vermelho com ícone de lixo */}
      <div
        className="absolute inset-0 flex items-center justify-end bg-[#E03222] pr-6"
        aria-hidden="true"
      >
        <TrashIcon className="h-6 w-6 text-white" />
      </div>

      {/* Card deslizável */}
      <div
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative touch-pan-y select-none"
      >
        {children}
      </div>
    </div>
  );
}
