import { BlackPlayer } from "@/Components/two-player/blackPlayer";
import { CheckMate } from "@/Components/two-player/checkmate";
import { ChoosePiece } from "@/Components/two-player/choose-piece";
import MaxWidthWrapper from "@/Components/common/MaxWidthWrapper";
import { WhitePlayer } from "@/Components/two-player/whitePlayer";
import ChessBoard from "@/Components/two-player/chessboard";
import { Controls } from "@/Components/two-player/controls";
import type { Metadata } from "next";
import { generatePageSEO } from "@/lib/seo";

export const metadata: Metadata = generatePageSEO({
  title: "Two Player Chess Game",
  description:
    "Play chess locally against a friend on the same device. Perfect for in-person matches, practice games, and learning chess together. No internet required for a classic chess experience.",
  image: "2Player.png",
  path: "two-player",
});

export default function Home() {
  return (
    <MaxWidthWrapper>
      <div className="flex flex-col gap-2 justify-center items-center relative">
        <div className="flex gap-2 flex-col justify-center items-center pt-10 min-h-screen max-sm:pb-10 z-0">
          <ChoosePiece />
          <CheckMate />
          <BlackPlayer />
          <ChessBoard />
          <WhitePlayer />
        </div>
        <Controls />
      </div>
    </MaxWidthWrapper>
  );
}
