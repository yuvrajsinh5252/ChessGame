interface CurrentPlayerProps {
  currentPlayer: "white" | "black";
}

export const CurrentPlayer = ({ currentPlayer }: CurrentPlayerProps) => {
  return (
    <div>
      {currentPlayer === "white" ? "White" : "Black"}
    </div>
  );
}
