import { ChooseColor } from "@/Components/computer/choose-color";
import MaxWidthWrapper from "@/Components/common/MaxWidthWrapper";
import { BlackPlayer } from "@/Components/two-player/blackPlayer";
import { CheckMate } from "@/Components/two-player/checkmate";
import ChessBoard from "@/Components/two-player/chessboard";
import { ChoosePiece } from "@/Components/two-player/choose-piece";
import { Controls } from "@/Components/two-player/controls";
import { WhitePlayer } from "@/Components/two-player/whitePlayer";
import type { Metadata } from "next";
import { generatePageSEO } from "@/lib/seo";

export const metadata: Metadata = generatePageSEO({
  title: "Play Chess Against AI",
  description:
    "Challenge yourself against intelligent AI opponents! Play chess against computer with multiple difficulty levels. Perfect for practicing chess strategies, tactics, and improving your game.",
  image: "computer.png",
  path: "computer",
});

export default function Page() {
  return (
    <MaxWidthWrapper>
      <div className="flex flex-col gap-2 justify-center items-center relative">
        <div className="flex gap-2 flex-col justify-center items-center pt-10 min-h-screen max-sm:pb-10 z-0">
          <ChooseColor />
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
