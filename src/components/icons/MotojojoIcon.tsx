// components/icons/MotojojoIcon.tsx

import React from "react";

export default function MotojojoIcon() {
  return (
    <svg viewBox="0 0 100 100" width="64" height="64">
      {/* Eyes */}
      <path
        d="M25 40 Q35 35, 45 40 Q35 45, 25 40"
        stroke="#ff3d00"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="35" cy="40" r="2" fill="#ff3d00" />
      <path
        d="M55 40 Q65 35, 75 40 Q65 45, 55 40"
        stroke="#ff3d00"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="65" cy="40" r="2" fill="#ff3d00" />

      {/* Bindi */}
      <circle cx="50" cy="30" r="3.5" fill="#e60026" />
    </svg>
  );
}
