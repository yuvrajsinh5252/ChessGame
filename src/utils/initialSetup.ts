import { Board } from "@/store/useChessStore";

export const initialBoard: Board = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

export const intitialkingCheckOrMoved = { white: false, black: false };

export const initialRookMoved = {
  white: { left: false, right: false },
  black: { left: false, right: false },
};
