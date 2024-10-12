"use client";

import { Input } from "@/components/ui/input";

export default function Room() {
  return (
    <div className="w-full max-w-md">
      <form className="mb-4">
        <Input
          type="text"
          // value={room}
          // onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter room name"
          className="w-full dark:bg-gray-600"
        />
        <button type="submit" className="mt-2 w-full bg-blue-500 p-2 rounded">
          Join Room
        </button>
      </form>
    </div>
  );
}
