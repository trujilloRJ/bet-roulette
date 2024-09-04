import React from "react";

export default function BetCard({ number, isActive, isSelected }) {
  const isSelCls = isSelected ? "border-slate-700" : "border-white";
  const isActiveCls = isActive ? "bg-blue-500 text-white" : "bg-white";
  let className = `${isActiveCls} ${isSelCls} text-4xl border-4 rounded-md flex-col shadow-md w-32 py-10 text-center`;
  return <div className={className}>{number}</div>;
}
