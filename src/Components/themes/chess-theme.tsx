"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Palette } from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";

export function ChessTheme() {
  const { setPieceTheme, pieceTheme } = useThemeStore((state) => state);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="p-2" variant={"ghost"}>
          <Palette />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuLabel>
          <h2 className="text-lg font-semibold">Chess Theme</h2>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={pieceTheme}
          onValueChange={(value: any) => setPieceTheme(value)}
        >
          <DropdownMenuRadioItem value="default">default</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="classic">classic</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
