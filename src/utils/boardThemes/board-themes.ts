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
  selected: "from-[#baca44] to-[#769656]",
  highlight: "#f6f668",
  lastMove: "bg-[#baca44]/50",
};

export const blueWhiteBoardTheme: boardThemes = {
  name: "blue-white",
  light: "bg-blue-100",
  dark: "bg-blue-700",
  selected: "from-blue-200 to-blue-500",
  highlight: "#a0d2eb",
  lastMove: "bg-blue-500/50",
};

export const woodBoardTheme: boardThemes = {
  name: "wood",
  light: "bg-amber-200",
  dark: "bg-amber-700/20",
  selected: "from-amber-300 to-amber-600",
  highlight: "#cda67f",
  lastMove: "bg-amber-600/50",
};

export const marbleBoardTheme: boardThemes = {
  name: "marble",
  light: "bg-gray-200",
  dark: "bg-gray-500",
  selected: "from-gray-300 to-gray-600",
  highlight: "#c0c0c0",
  lastMove: "bg-gray-500/50",
};
