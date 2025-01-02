"use server";

import { prisma } from "../prisma";

export async function goOnline() {
  try {
    const player = await prisma.playersOnline.create({
      data: {},
    });

    return player.id;
  } catch (error) {
    console.log(error);
  }
}

export async function searchPlayersOnline() {
  try {
    const players = await prisma.player.findMany();

    const data = await fetch("/api/online-players");
    const jsonData = await data.json();
    console.log(jsonData);
  } catch (error) {
    console.log(error);
  }
}
