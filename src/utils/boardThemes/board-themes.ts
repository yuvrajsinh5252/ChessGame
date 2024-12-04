import { boardThemes } from "@/store/useThemeStore";

export const defaultBoardTheme: boardThemes = {
  name: "default",
  light: " bg-gray-300 ",
  dark: " bg-gray-500 ",
  selected: " from-blue-300 to-blue-600 ",
  highlight: "#ffce9e",
  lastMove: " bg-blue-400/50 ",
};

export const greenWhiteBoardTheme: boardThemes = {
  name: "green-white",
  light: "bg-[#eeeed2]",
  dark: "bg-[#769656]",
  selected: "bg-[#d4e157]/90",
  highlight: "#f6f668",
  lastMove: "bg-[#baca44]/60",
};

export const blueWhiteBoardTheme: boardThemes = {
  name: "blue-white",
  light: "bg-blue-200",
  dark: "bg-blue-600",
  selected: "from-blue-300 to-blue-500",
  highlight: "#b3cde0",
  lastMove: "bg-blue-400/50",
};

export const woodBoardTheme: boardThemes = {
  name: "wood",
  light: " bg-[#DEB887]/80 ",
  dark: " bg-[#8B4513]/80 ",
  selected: "from-[#CD853F]/70 to-[#CD853F]/70",
  highlight: " #D2691E ",
  lastMove: " bg-[#D2691E] ",
};
