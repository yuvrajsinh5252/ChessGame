import { Message } from "@/store/useChatStore";
import useOnlineChessStore from "@/store/useOnlineChessStore";

export function ChatMessage({
  messages,
  playerId,
}: {
  messages: Message[];
  playerId: string;
}) {
  const { players } = useOnlineChessStore((state) => state);
  const userColor = players.find((player) => player.id === playerId)?.color;

  const sortedMessages = messages.sort(
    (a, b) =>
      a.timestamp &&
      b.timestamp &&
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="flex flex-col gap-5 p-2">
      {sortedMessages.map((message, key) =>
        playerId === message.user ? (
          <UserMessage color={userColor || ""} key={key} message={message} />
        ) : (
          <OpponentsMessage
            color={userColor == "white" ? "black" : "white"}
            key={key}
            message={message}
          />
        )
      )}
    </div>
  );
}

function UserMessage({ message, color }: { message: Message; color: string }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`max-sm:hidden w-12 h-12 bg-${color} rounded-full border-2 flex items-center justify-center`}
      ></div>
      <div className="flex flex-col gap-1">
        <div className="flex flex-col bg-gray-200 dark:bg-gray-700 p-4 rounded-2xl rounded-tl-none w-80 max-sm:w-[270px]">
          <span className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
            {message.user}
          </span>
          <span className="text-gray-600 dark:text-gray-400 break-words">
            {message.content}
          </span>
        </div>
        <span className="text-xs text-gray-500 ml-2">
          {message.timestamp &&
            new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
        </span>
      </div>
    </div>
  );
}

function OpponentsMessage({
  message,
  color,
}: {
  message: Message;
  color: string;
}) {
  return (
    <div className="flex items-start gap-3 justify-end">
      <div className="flex flex-col gap-1 items-end">
        <div className="flex flex-col bg-blue-100 dark:bg-blue-900/60 p-4 rounded-2xl rounded-tr-none w-80 max-sm:w-[270px]">
          <span className="font-semibold text-blue-700 dark:text-blue-300 mb-1">
            {message.user}
          </span>
          <span className="text-blue-600 dark:text-blue-400 break-words">
            {message.content}
          </span>
        </div>
        <span className="text-xs text-gray-500 mr-2">
          {message.timestamp &&
            new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
        </span>
      </div>
      <div
        className={`max-sm:hidden w-12 h-12 bg-${color} rounded-full border-2 flex items-center justify-center`}
      ></div>
    </div>
  );
}
