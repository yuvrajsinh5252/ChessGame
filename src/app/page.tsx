"use client";

import { useChessStore } from "@/store/useChessStore";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-300 via-white to-slate-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 pt-36 relative z-10">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <Image
              src={"/chess.png"}
              alt="chess"
              width={250}
              height={250}
              className="animate-gentle-float drop-shadow-2xl"
            />
            <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-2xl scale-110" />
          </div>

          <div className="text-center space-y-6 mb-12 mt-6">
            <h1 className="text-6xl font-bold max-sm:text-4xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent drop-shadow-lg">
              Chessmate
            </h1>
            <p className="text-xl text-slate-600/90 dark:text-blue-100/80 max-w-2xl mx-auto leading-relaxed font-medium">
              Play chess against friends, global players, or test your skills
              against AI.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl px-4">
            <GameModeCard
              href="/two-player"
              title="Local Match"
              description="Face off against a friend in person"
              color="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-600/90 dark:to-blue-900/90"
              hoverColor="hover:from-blue-200/90 hover:to-blue-300/90 dark:hover:from-blue-500/80 dark:hover:to-blue-800/80"
              icon="/2Player.png"
            />
            <GameModeCard
              href="/online-multiplayer"
              title="Global Arena"
              description="Join the worldwide chess community"
              color="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-600/90 dark:to-purple-900/90"
              hoverColor="hover:from-purple-200 hover:to-purple-300 dark:hover:from-purple-500/90 dark:hover:to-purple-800/90"
              icon="/online.png"
            />
            <GameModeCard
              href="/computer"
              title="AI Challenge"
              description="Battle against intelligent AI opponents"
              color="bg-gradient-to-br from-slate-200 to-slate-300 dark:from-gray-600/90 dark:to-gray-900/90"
              hoverColor="hover:from-slate-300 hover:to-slate-400 dark:hover:from-gray-500/90 dark:hover:to-gray-800/90"
              icon="/computer.png"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-16">
            {["Real-time Matches", "Smart AI", "Free to Play"].map(
              (feature) => (
                <span
                  key={feature}
                  className="px-4 py-2 bg-white/60 dark:bg-white/5 rounded-full text-sm text-slate-600 dark:text-blue-100/80 backdrop-blur-sm shadow-sm hover:bg-white/80 dark:hover:bg-white/10 transition-colors duration-300"
                >
                  {feature}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface GameModeCardProps {
  href: string;
  title: string;
  description: string;
  color: string;
  hoverColor: string;
  icon: string;
}

function GameModeCard({
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
