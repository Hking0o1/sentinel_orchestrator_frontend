import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A helper function to merge Tailwind CSS classes.
 * It intelligently combines default classes, prop-based classes, and overrides.
 * @param {...ClassValue} inputs - Class values to merge.
 * @returns {string} The merged class string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
