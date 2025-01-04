"use client";

import { useChessStore } from "@/store/useChessStore";
import Image from "next/image";
import Link from "next/link";

interface GameModeCardProps {
  href: string;
  title: string;
  description: string;
  color: string;
  hoverColor: string;
  icon: string;
}

export function GameModeCard({
  href,
  title,
  description,
  color,
  hoverColor,
  icon,
}: GameModeCardProps) {
  const { updateComputer, refetchStore } = useChessStore((state) => state);

  return (
    <Link
      onClick={() => {
        if (href === "/two-player") {
          updateComputer(null);
        } else if (href === "/computer") refetchStore();
      }}
      href={href}
      className={`group ${color} ${hoverColor} rounded-2xl p-4 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-lg shadow-sm backdrop-blur-sm relative overflow-hidden`}
    >
      <div className="flex flex-col items-center relative z-10">
        <div className="relative mb-6">
          <Image
            src={icon}
            alt={title}
            width={96}
            height={96}
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <h2 className="text-2xl font-bold mb-3 text-slate-700 dark:text-white transition-colors duration-300">
          {title}
        </h2>
        <p className="text-sm text-slate-600 dark:text-blue-100/80 transition-colors duration-300">
          {description}
        </p>
      </div>
    </Link>
  );
}
