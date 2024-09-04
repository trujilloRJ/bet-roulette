import React from "react";
import BetCard from "./BetCard";
import { numberRange } from "../services/utils";

export default function CardBoard({ activeNumber, selNumber }) {
  const cardArray = numberRange(1, 10);
  return (
    <div className="grid w-[32rem] grid-cols-3 gap-4">
      {cardArray.map((i) => {
        return (
          <BetCard
            number={i}
            isActive={activeNumber == i}
            isSelected={selNumber == i}
            key={i}
          />
        );
      })}
    </div>
  );
}
