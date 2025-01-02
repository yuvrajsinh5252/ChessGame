export function LoadingBoard() {
  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <div className="grid grid-cols-8 gap-0 border-2 rounded-lg relative">
        {Array.from({ length: 8 }).map((_, rowIndex) =>
          Array.from({ length: 8 }).map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-16 h-16 max-sm:h-10 max-sm:w-10 flex items-center justify-center
              ${(rowIndex + colIndex) % 2 === 0 ? "bg-gray-300" : "bg-gray-500"}
              ${rowIndex === 0 && colIndex === 0 ? "rounded-tl-lg" : ""}
              ${rowIndex === 0 && colIndex === 7 ? "rounded-tr-lg" : ""}
              ${rowIndex === 7 && colIndex === 0 ? "rounded-bl-lg" : ""}
              ${rowIndex === 7 && colIndex === 7 ? "rounded-br-lg" : ""}
              animate-pulse`}
              style={{ animationDelay: `${(rowIndex + colIndex) * 0.1}s` }}
            ></div>
          ))
        )}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`row-${index}`}
              className="absolute left-0 w-4 h-16 max-sm:h-11 max-sm:w-3 flex items-center justify-center text-[8px] max-sm:text-[6px] text-black"
              style={{ top: `${index * 12.5 - 4}%` }}
            >
              {8 - index}
            </div>
          ))}
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`col-${index}`}
              className="absolute bottom-0 w-16 h-4 max-sm:h-3 max-sm:w-11 flex items-center justify-center text-[8px] max-sm:text-[6px] text-black"
              style={{ left: `${index * 12.5 - 5}%` }}
            >
              {String.fromCharCode(97 + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
