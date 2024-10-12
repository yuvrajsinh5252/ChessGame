import { BlackPlayer } from "@/components/blackPlayer";
import { CheckMate } from "@/components/checkmate";
import ChessBoard from "@/components/chessboard";
import { ChoosePiece } from "@/components/choose-piece";
import { Controls } from "@/components/controls";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { WhitePlayer } from "@/components/whitePlayer";

export default function Home() {
  return (
    <MaxWidthWrapper>
      <div className="flex flex-col gap-2 justify-center items-center">
        <div className="flex gap-2 flex-col justify-center items-center pt-10 max-sm:pt-20 min-h-screen">
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
