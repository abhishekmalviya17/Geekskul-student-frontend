import React from "react";

function BrandMark({ size = 44 }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.7rem" }}>
      <div
        style={{
          height: size,
          width: size,
          borderRadius: "20px",
          background: "linear-gradient(135deg, #536dff, #0ea5e9)",
          display: "grid",
          placeItems: "center",
          color: "white",
          fontWeight: 700,
          fontSize: size * 0.45,
          boxShadow: "0 20px 40px rgba(83,109,255,0.35)",
        }}
      >
        G
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.02em" }}>Geekskul</div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", letterSpacing: "0.08em" }}>
          Student Portal
        </div>
      </div>
    </div>
  );
}

export default BrandMark;
