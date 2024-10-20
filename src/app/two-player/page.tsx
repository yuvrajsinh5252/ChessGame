import { BlackPlayer } from "@/Components/two-player/blackPlayer";
import { CheckMate } from "@/Components/two-player/checkmate";
import { ChoosePiece } from "@/Components/two-player/choose-piece";
import MaxWidthWrapper from "@/Components/MaxWidthWrapper";
import { WhitePlayer } from "@/Components/two-player/whitePlayer";
import ChessBoard from "@/Components/two-player/chessboard";
import { Controls } from "@/Components/two-player/controls";

export default function Home() {
  return (
    <MaxWidthWrapper>
      <div className="flex flex-col gap-2 justify-center items-center">
        <div className="flex gap-2 flex-col justify-center items-center pt-10 min-h-screen max-sm:pb-10">
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
