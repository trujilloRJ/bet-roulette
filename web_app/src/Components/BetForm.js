import React from "react";

export default function BetForm({
  betNumber,
  handleBetNumber,
  betAmount,
  handleBetAmount,
  maxBetAmount,
}) {
  return (
    <div className="flex-col">
      <div className="flex justify-center mb-2">
        <span>Which number do you bet on? </span>
        <input
          className="ml-3 w-24"
          type="number"
          min="1"
          max="9"
          value={betNumber}
          onChange={handleBetNumber}
        />
      </div>
      <div className="flex justify-center mb-2">
        <span>What amount do you want to bet? </span>
        <input
          className="ml-4 w-24 mr-4"
          type="number"
          min="1"
          max={`${maxBetAmount}`}
          value={betAmount}
          onChange={handleBetAmount}
        />
        <span>JTR </span>
      </div>
      <div className="flex justify-center">
        <span>
          If you win you get{" "}
          <span className="font-bold">{betAmount * 8} JTR</span>
        </span>
      </div>
    </div>
  );
}
