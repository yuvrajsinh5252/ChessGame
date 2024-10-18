export function EliminatedPieces({
  eliminatedPieces,
  playerColour,
}: {
  eliminatedPieces: { white: string[]; black: string[] };
  playerColour: "white" | "black" | null;
}) {
  const data =
    playerColour == "black" ? eliminatedPieces.black : eliminatedPieces.white;

  return (
    <div className="flex items-center justify-center gap-1">
      {eliminatedPieces ? (
        Object.entries(
          data.reduce((acc, piece) => {
            if (piece) {
              acc[piece] = (acc[piece] || 0) + 1;
            }
            return acc;
          }, {} as Record<string, number>)
        ).map(([piece, count], index) => (
          <div
            key={index}
            className="relative flex items-center p-0.5 px-1 rounded bg-gray-300"
          >
            <img
              src={`/${playerColour}/${piece}.png`}
              alt={piece}
              className="w-6 h-6"
            />
            <div>
              {count > 1 && (
                <span className="right-0.5 bottom-[0%] absolute text-[10px] font-semibold dark:text-black">
                  {count}
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
}
