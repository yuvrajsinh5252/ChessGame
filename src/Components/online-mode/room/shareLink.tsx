import { CheckIcon, CopyIcon } from "lucide-react";

export function ShareLink({ roomid }: { roomid: string }) {
  return (
    <div className="text-center flex flex-col gap-2">
      <div className="flex justify-center items-center gap-2">
        <p className="text-lg max-sm:text-sm font-semibold text-blue-500 dark:text-blue-300">
          {roomid}
        </p>
        <CopyIcon
          size={20}
          className="cursor-pointer"
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
        <CheckIcon size={20} className="hidden" id="tick-icon" />
      </div>
      <p className="text-sm">Share this ID to start the game.</p>
    </div>
  );
}
