"use client";

import { useChessStore } from "@/store/useChessStore";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="container mx-auto px-4 py-16 max-sm:mt-10">
        <div className="flex flex-col items-center justify-center">
          <Image src={"/chess.png"} alt="chess" width={250} height={250} />
          <h1 className="text-6xl font-bold mb-4 text-center max-sm:text-4xl">
            Chessmate
          </h1>
          <p className="text-xl mb-12 text-center">
            Challenge your mind with the ultimate game of strategy
          </p>

          <div className="flex max-sm:flex-col gap-5 w-full max-w-3xl">
            <GameModeCard
              href="/two-player"
              title="Two Player"
              description="Play against a friend on the same device"
              color="bg-blue-500 hover:bg-blue-600"
            />
            <GameModeCard
              href="/online-multiplayer"
              title="Online Multiplayer"
              description="Challenge players from around the world"
              color="bg-green-500 hover:bg-green-600"
            />
            <GameModeCard
              href="/computer"
              title="Play Against Computer"
              description="Test your skills against AI opponents"
              color="
              bg-gray-400/70 hover:bg-gray-500/70
              dark:bg-gray-400/50 dark:hover:bg-gray-500/50
              "
            />
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
}

function GameModeCard({ href, title, description, color }: GameModeCardProps) {
  const { updateComputer } = useChessStore((state) => state);

  return (
    <Link
      onClick={() => {
        if (href === "/two-player") {
          updateComputer(null);
        }
      }}
      href={href}
      className={`${color} rounded-lg p-6 text-center transition-transform transform hover:scale-105`}
    >
      <div className="flex flex-col items-center max-sm:text-xs max-sm:p-2">
        <Image
          src={
            href === "/two-player"
              ? "/2Player.png"
              : href === "/online-multiplayer"
              ? "/online.png"
              : "/computer.png"
          }
          alt="icon"
          width={84}
          height={84}
        />
        <h2 className="text-2xl font-bold mb-2 max-sm:text-lg">{title}</h2>
        <p className="text-sm max-sm:text-xs">{description}</p>
      </div>
    </Link>
  );
}
