import { zeroAddr } from "@/constant";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return "Something went wrong";
}

export function isCurrentOwner(
  ownerAddress: string,
  creatorAddress: string,
  accountAddr: string,
): boolean {
  if (
    ownerAddress === zeroAddr &&
    creatorAddress.toLowerCase() === accountAddr.toLowerCase()
  ) {
    return true;
  }

  if (
    ownerAddress !== zeroAddr &&
    ownerAddress.toLowerCase() === accountAddr.toLowerCase()
  ) {
    return true;
  }

  return false;
}
