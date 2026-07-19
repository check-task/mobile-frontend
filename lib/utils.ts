import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-h-01",
        "text-h-02",
        "text-h-03",
        "text-h-04",
        "text-b-01-m",
        "text-b-01-r",
        "text-b-02-m",
        "text-b-02-r",
        "text-b-03-m",
        "text-b-03-r",
        "text-b-04-m",
        "text-b-04-r",
        "text-caption",
        "text-calendar",
        "text-calendar-2",
        "text-btn",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
