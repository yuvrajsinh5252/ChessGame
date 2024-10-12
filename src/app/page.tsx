import Image from "next/image";
import Link from "next/link";
import { FaChessBoard } from "react-icons/fa";

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
              color="bg-blue-600 hover:bg-blue-700"
            />
            <GameModeCard
              href="/online-multiplayer"
              title="Online Multiplayer"
              description="Challenge players from around the world"
              color="bg-green-600 hover:bg-green-700"
            />
            <GameModeCard
              href="/computer"
              title="Play Against Computer"
              description="Test your skills against AI opponents"
              color="bg-red-600 hover:bg-red-700"
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
  return (
    <Link
      href={href}
      className={`${color} rounded-lg p-6 text-center transition-transform transform hover:scale-105`}
    >
      <div className="flex flex-col items-center">
        <Image
          src={
            href === "/two-player"
              ? "/2Player.png"
              : href === "/online-multiplayer"
              ? "/online.png"
              : "/computer.png"
          }
          alt="icon"
          width={href === "/computer" ? 84 : 54}
          height={href === "/computer" ? 84 : 54}
        />
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-sm">{description}</p>
      </div>
    </Link>
  );
}
