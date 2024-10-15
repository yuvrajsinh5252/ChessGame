import { BlackPlayer } from "@/Components/blackPlayer";
import { CheckMate } from "@/Components/checkmate";
import ChessBoard from "@/Components/chessboard";
import { ChoosePiece } from "@/Components/choose-piece";
import { Controls } from "@/Components/controls";
import MaxWidthWrapper from "@/Components/MaxWidthWrapper";
import { WhitePlayer } from "@/Components/whitePlayer";

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
