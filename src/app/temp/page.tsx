"use client";

import React, { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function Page() {
  // Initial numbers array
  const [numbers, setNumbers] = useState<number[]>(
    Array.from({ length: 50 }, (_, i) => i)
  );

  // AutoAnimate hook for the container
  const [parent] = useAutoAnimate<HTMLDivElement>({ duration: 500 });

  // Randomize function to shuffle the numbers
  const randomize = () => {
    setNumbers((prevNumbers) =>
      [...prevNumbers].sort(() => (Math.random() > 0.5 ? 1 : -1))
    );
  };

  return (
    <div className="example boxes-example">
      <div ref={parent} className="boxes">
        {numbers.map((number) => (
          <div key={number} className="box">
            {number}
          </div>
        ))}
      </div>
      <button className="button button--alt" onClick={randomize}>
        Randomize
      </button>
    </div>
  );
}
