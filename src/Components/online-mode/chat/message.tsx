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
    <div className="flex flex-col gap-4">
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
    <div className="flex items-center gap-3">
      <div
        className={`max-sm:hidden w-10 h-10 bg-${color} rounded-full border-2`}
      ></div>
      <div className="flex flex-col bg-gray-100 dark:bg-gray-800 p-3 rounded-lg w-80 max-sm:w-[270px] truncate">
        <span className="font-semibold text-gray-700 dark:text-gray-300">
          {message.user}
        </span>
        <span className="text-gray-600 dark:text-gray-400">
          {message.content}
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
    <div className="flex items-center gap-3 justify-end">
      <div
        className={`max-sm:hidden w-10 h-10 bg-${color} border-2 rounded-full`}
      ></div>
      <div className="flex flex-col bg-blue-100 dark:bg-blue-800 p-3 rounded-lg w-80 max-sm:w-[270px] truncate">
        <span className="font-semibold text-blue-700 dark:text-blue-300">
          {message.user}
        </span>
        <span className="text-blue-600 dark:text-blue-400">
          {message.content}
        </span>
      </div>
    </div>
  );
}
