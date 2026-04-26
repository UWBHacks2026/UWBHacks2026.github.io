import React from "react";

export function Button({ children, className = "", style = {}, ...props }) {
  return (
    <button
      {...props}
      className={className}
      style={{
        padding: "8px 14px",
        borderRadius: 8,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        cursor: "pointer",
        transition: "background .15s, color .15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
