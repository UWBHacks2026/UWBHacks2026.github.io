import React from "react";

export function Input({ className = "", style = {}, ...props }) {
  return (
    <input
      {...props}
      className={className}
      style={{
        padding: "8px 10px",
        borderRadius: 8,
        border: "1px solid #3D3530",
        background: "#2A2118",
        color: "#F5EFE3",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        outline: "none",
        ...style,
      }}
    />
  );
}
