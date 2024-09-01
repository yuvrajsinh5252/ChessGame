export default function ChessBoard() {
  return (
    <div className="">
      {
        Array(8).fill(null).map((_, i) => (
          <div key={i} className="flex">
            {
              Array(8).fill(null).map((_, j) => (
                <div key={j}
                  className={`w-16 h-16 ${i % 2 === j % 2 ? 'bg-gray-300' : 'bg-gray-500'}`}
                />
              ))
            }
          </div>
        ))
      }
    </div>
  )
}