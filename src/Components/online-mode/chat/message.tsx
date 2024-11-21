import { Message } from "@/store/useChatStore";

export function ChatMessage({
  messages,
  playerId,
}: {
  messages: Message[];
  playerId: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((message, key) =>
        playerId === message.user ? (
          <UserMessage key={key} message={message} />
        ) : (
          <OpponentsMessage key={key} message={message} />
        )
      )}
    </div>
  );
}

function UserMessage({ message }: { message: Message }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      <div className="flex flex-col bg-gray-100 dark:bg-gray-800 p-3 rounded-lg w-96">
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

function OpponentsMessage({ message }: { message: Message }) {
  return (
    <div className="flex items-center gap-3 justify-end">
      <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      <div className="flex flex-col bg-blue-100 dark:bg-blue-800 p-3 rounded-lg w-96">
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
