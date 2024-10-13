import Room from "@/Components/online-mode/room";

export default async function Home() {
  return (
    <div className="min-h-screen flex justify-center items-center flex-col p-4">
      <div className="bg-white/50 dark:bg-white/10 shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Join a Room</h1>
        <p className="mb-6 text-center">
          Welcome to the online multiplayer mode.
        </p>
        <Room />
      </div>
    </div>
  );
}
