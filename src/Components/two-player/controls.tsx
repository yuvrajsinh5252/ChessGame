"use client";

import { FaUndo, FaRedo, FaSyncAlt, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { useChessStore } from "@/store/useChessStore";
import { clearObjectStore } from "@/lib/indexdb/clear";
import { Button } from "@/components/ui/button";

export function Controls() {
  const { refetchStore, undoMove, redoMove } = useChessStore();

  return (
    <div className="fixed bottom-0 flex justify-center space-x-4 pb-2">
      <Link href="/">
        <Button className="btn flex items-center space-x-2">
          <FaArrowLeft />
        </Button>
      </Link>
      <Button onClick={undoMove} className="btn flex items-center space-x-2">
        <FaUndo />
      </Button>
      <Button onClick={redoMove} className="btn flex items-center space-x-2">
        <FaRedo />
      </Button>
      <Button
        onClick={() => {
          clearObjectStore();
          localStorage.removeItem("chess-store");
          refetchStore();
        }}
        className="btn flex items-center space-x-2"
      >
        <FaSyncAlt />
      </Button>
    </div>
  );
}
