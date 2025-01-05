import { CheckIcon, CopyIcon, Trash2Icon } from "lucide-react";

export function ShareLink({
  roomid,
  onDelete,
}: {
  roomid: string;
  onDelete: () => void;
}) {
  return (
    <div className="text-center flex flex-col gap-2">
      <div className="flex justify-center items-center gap-2">
        <p className="text-lg max-sm:text-[14px] font-semibold text-blue-500 dark:text-blue-300">
          {roomid}
        </p>
        <CopyIcon
          size={20}
          className="cursor-pointer min-w-3"
          onClick={async () => {
            await navigator.clipboard.writeText(roomid);
            const iconElement = document.getElementById("copy-icon");
            if (iconElement) {
              iconElement.classList.add("hidden");
              const tickElement = document.getElementById("tick-icon");
              if (tickElement) {
                tickElement.classList.remove("hidden");
                setTimeout(() => {
                  tickElement.classList.add("hidden");
                  iconElement.classList.remove("hidden");
                }, 1000);
              }
            }
          }}
          id="copy-icon"
        />
        <CheckIcon size={20} className="min-w-3 hidden" id="tick-icon" />
        <Trash2Icon
          size={20}
          className="min-w-3 cursor-pointer text-red-500 hover:text-red-600"
          onClick={onDelete}
        />
      </div>
      <p className="text-sm">Share this ID to start the game.</p>
    </div>
  );
}
