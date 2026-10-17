import { useEffect, useState } from "react";

export function useMatchMedias() {
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">(() => {
    if (typeof window === "undefined") return "desktop";
    if (window.matchMedia("(max-width: 768px)").matches) return "mobile";
    if (window.matchMedia("(max-width: 1024px)").matches) return "tablet";
    return "desktop";
  });

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const tabletQuery = window.matchMedia("(max-width: 1024px)");

    const handleChange = () => {
      if (mobileQuery.matches) setDevice("mobile");
      else if (tabletQuery.matches) setDevice("tablet");
      else setDevice("desktop");
    };

    mobileQuery.addEventListener("change", handleChange);
    tabletQuery.addEventListener("change", handleChange);

    return () => {
      mobileQuery.removeEventListener("change", handleChange);
      tabletQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return device;
}
