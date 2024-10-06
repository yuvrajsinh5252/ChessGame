import { useChessStore } from "@/store/useChessStore";

export const CurrentPlayer = () => {
  const { currentPlayer } = useChessStore((state) => state);

  return (
    <div>
      {currentPlayer === "white" ? "White" : "Black"}
    </div>
  );
}
