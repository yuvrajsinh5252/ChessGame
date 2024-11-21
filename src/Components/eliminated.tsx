import { useThemeStore } from "@/store/useThemeStore";
import Image from "next/image";

export function EliminatedPieces({
  eliminatedPieces,
  playerColour,
}: {
  eliminatedPieces: { white: string[]; black: string[] };
  playerColour: "white" | "black" | null;
}) {
  const { pieceTheme } = useThemeStore((state) => state);
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
            <Image
              src={`/${pieceTheme}/${playerColour}/${piece}.png`}
              alt={piece}
              width={24}
              height={24}
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
