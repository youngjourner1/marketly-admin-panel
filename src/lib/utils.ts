import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number into Ghana Cedis (GHS) format.
 * @param amount - The numerical value to format.
 * @returns A string formatted as ₵ 100.00.
 */
export const formatGHS = (amount: number): string => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
  }).format(amount).replace('GH\u00a2', '\u20b5 ');
};