import React, { useEffect, useState } from "react";
import { getFeaturedEvents } from "@/services/eventService";

// SVG pattern for 90s background
const patternSvg =
  "data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='6' cy='6' r='2' fill='%23ff6fcb'/%3E%3Ccircle cx='34' cy='34' r='2' fill='%23ffe066'/%3E%3Crect x='28' y='4' width='4' height='4' rx='2' fill='%236fc3df'/%3E%3Crect x='4' y='28' width='4' height='4' rx='2' fill='%23a3c9f9'/%3E%3C/svg%3E";



// Modified MotojojoIcon with bigger eyes
const MotojojoIconBigEyes = () => (
  <svg viewBox="0 0 100 100" width="90" height="90">
    {/* Eyes - Made much bigger */}
    <path
      d="M15 30 Q35 15, 55 30 Q35 45, 15 30"
      stroke="#ff3d00"
      strokeWidth="5"
      fill="none"
    />
    <circle cx="35" cy="30" r="7" fill="#ff3d00" />
    <path
      d="M45 30 Q65 15, 85 30 Q65 45, 45 30"
      stroke="#ff3d00"
      strokeWidth="5"
      fill="none"
    />
    <circle cx="65" cy="30" r="7" fill="#ff3d00" />

    {/* Bindi */}
    <circle cx="50" cy="20" r="5" fill="#e60026" />
  </svg>
);

export default function MovingPartyBackground() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const featured = await getFeaturedEvents();
      setEvents(featured && featured.length > 0 ? featured : []);
    })();
  }, []);

  const tickets =
    events.length > 0
      ? events.map((event, i) => ({
          ticketId: `BG-${event.id}`,
        }))
      : [
          { ticketId: "BG-001" },
          { ticketId: "BG-002" },
          { ticketId: "BG-003" },
          { ticketId: "BG-004" },
        ];

  const ticketStyles = [
    { top: "10%", left: "8%", width: 100, height: 100, rotate: "-8deg", opacity: 0.44, animation: "float90s 7s ease-in-out infinite alternate", scale: 1 },
    { top: "22%", right: "10%", width: 100, height: 100, rotate: "10deg", opacity: 0.38, animation: "float90s 8s ease-in-out infinite alternate-reverse", scale: 1 },
    { top: "60%", left: "18%", width: 100, height: 100, rotate: "-12deg", opacity: 0.35, animation: "float90s 6.5s ease-in-out infinite alternate", scale: 1 },
    { top: "70%", right: "16%", width: 100, height: 100, rotate: "7deg", opacity: 0.41, animation: "float90s 7.5s ease-in-out infinite alternate-reverse", scale: 1 },
  ];

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float90s {
        0% { transform: translateY(0) scale(1) rotate(var(--rotate, 0deg)); }
        50% { transform: translateY(-18px) scale(1.03) rotate(var(--rotate, 0deg)); }
        100% { transform: translateY(0) scale(1) rotate(var(--rotate, 0deg)); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
        background: `#300030 url('${patternSvg}') repeat`,
      }}
    >
      {tickets.map((ticket, i) => (
        <div
          key={ticket.ticketId}
          style={
            {
              position: "absolute",
              ...ticketStyles[i % ticketStyles.length],
              transform: `rotate(${ticketStyles[i % ticketStyles.length].rotate}) scale(${ticketStyles[i % ticketStyles.length].scale})`,
              opacity: ticketStyles[i % ticketStyles.length].opacity,
              pointerEvents: "none",
              width: ticketStyles[i % ticketStyles.length].width,
              height: ticketStyles[i % ticketStyles.length].height,
              animation: ticketStyles[i % ticketStyles.length].animation,
              ['--rotate' as any]: ticketStyles[i % ticketStyles.length].rotate,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            } as any
          }
        >
          <MotojojoIconBigEyes />
        </div>
      ))}
    </div>
  );
}
