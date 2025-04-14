
import React from "react";
import { cn } from "@/lib/utils";

type FadeInProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
};

export const FadeIn = ({
  children,
  delay = 0,
  className,
  duration = 300,
  direction = "up",
}: FadeInProps) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const directionClasses = {
    up: "translate-y-4",
    down: "-translate-y-4",
    left: "translate-x-4",
    right: "-translate-x-4",
    none: "",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all",
        direction !== "none" && directionClasses[direction],
        isVisible
          ? "opacity-100 transform-none"
          : "opacity-0",
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
};
