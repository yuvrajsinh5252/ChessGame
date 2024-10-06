import ChessBoard from "@/components/chess-board";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function Home() {
  return (
    <MaxWidthWrapper>
      <div className="flex justify-center items-center h-screen">
        <ChessBoard />
      </div>
    </MaxWidthWrapper>
  );
}