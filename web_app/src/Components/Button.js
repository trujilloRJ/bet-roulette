import React from "react";

export default function Button({ children, ...props }) {
  return (
    <button
      className="rounded-md bg-[#3498DB] text-white text-md w-44 px-4 py-2 shadow-sm"
      {...props}
    >
      {children}
    </button>
  );
}
