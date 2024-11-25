import { boardThemes } from "@/store/useThemeStore";

export const defaultBoardTheme: boardThemes = {
  name: "default",
  light: " bg-gray-300 ",
  dark: " bg-gray-500 ",
  selected: " from-gray-300 to-gray-600 ",
  highlight: "#ffce9e",
  lastMove: " bg-gray-400/50 ",
};

export const greenWhiteBoardTheme: boardThemes = {
  name: "green-white",
  light: " bg-green-200 ",
  dark: " bg-green-500 ",
  selected: " from-green-300 to-green-600 ",
  highlight: "#ffce9e",
  lastMove: " bg-green-400/50 ",
};

export const blueWhiteBoardTheme: boardThemes = {
  name: "blue-white",
  light: " bg-blue-200 ",
  dark: " bg-blue-500 ",
  selected: " from-blue-300 to-blue-600 ",
  highlight: "#ffce9e",
  lastMove: " bg-blue-400/50 ",
};

export const woodBoardTheme: boardThemes = {
  name: "wood",
  light: " bg-yellow-400 ",
  dark: " bg-yellow-600 ",
  selected: " from-yellow-500 to-yellow-700 ",
  highlight: "#ffce9e",
  lastMove: " bg-yellow-800/50 ",
};

export const marbleBoardTheme: boardThemes = {
  name: "marble",
  light: " bg-gray-300 ",
  dark: " bg-gray-500 ",
  selected: " from-gray-300 to-gray-600 ",
  highlight: "#ffce9e",
  lastMove: " bg-gray-400/50 ",
};
