import React from "react";

export default function ResultModal({ userWin }) {
  return (
    <>
      {userWin ? (
        <div className="pt-8 text-xl px-4">🏆 You Won!</div>
      ) : (
        <div className="pt-8 text-xl px-4">😢 You Lose!</div>
      )}
    </>
  );
}
