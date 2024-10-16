"use client";

import { FaUndo, FaRedo, FaSyncAlt, FaArrowLeft } from "react-icons/fa";
import { Button } from "../ui/button";
import Link from "next/link";

export function Controls() {
  return (
    <div className="fixed bottom-0 flex justify-center space-x-4 pb-2">
      <Link href="/">
        <Button className="btn flex items-center space-x-2">
          <FaArrowLeft />
        </Button>
      </Link>
      <Button className="btn flex items-center space-x-2">
        <FaUndo />
      </Button>
      <Button className="btn flex items-center space-x-2">
        <FaRedo />
      </Button>
      <Button
        onClick={() => {
          localStorage.removeItem("chess-store");
          window.location.reload();
        }}
        className="btn flex items-center space-x-2"
      >
        <FaSyncAlt />
      </Button>
    </div>
  );
}
