import { BlackPlayer } from "@/components/black-player";
import ChessBoard from "@/components/chess-board";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { WhitePlayer } from "@/components/white-player";

export default function Home() {
  return (
    <MaxWidthWrapper>
      <div className="flex flex-col gap-2 justify-center items-center h-screen">
        <div className="flex gap-2 flex-col justify-center items-center pt-10">
          <BlackPlayer />
          <ChessBoard />
          <WhitePlayer />
        </div>
      </div>
    </MaxWidthWrapper>
  );
}