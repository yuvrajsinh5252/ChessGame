import { ChooseColor } from "@/Components/computer/choose-color";
import MaxWidthWrapper from "@/Components/MaxWidthWrapper";
import { BlackPlayer } from "@/Components/two-player/blackPlayer";
import { CheckMate } from "@/Components/two-player/checkmate";
import ChessBoard from "@/Components/two-player/chessboard";
import { ChoosePiece } from "@/Components/two-player/choose-piece";
import { Controls } from "@/Components/two-player/controls";
import { WhitePlayer } from "@/Components/two-player/whitePlayer";

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
