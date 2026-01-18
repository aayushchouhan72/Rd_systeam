import crypto from "crypto";
import pool from "../config/sql_connetdb.js";

export const generateAccountNumber = async () => {
  const year = new Date().getFullYear();

  // 5 bytes = 10 hex characters
  const randomPart = crypto.randomBytes(5).toString("hex").toUpperCase();

  const accountNumber = `RD-${year}-${randomPart}`;

  const result = await pool.query(
    "SELECT 1 FROM rdusers WHERE  account_number = $1",
    [accountNumber]
  );

  // If duplicate found → retry
  if (result.rowCount > 0) {
    return generateAccountNumber();
  }

  return accountNumber;
};

export function generateRdNumber(accountNumber, rdCountTillNow) {
  if (!accountNumber) {
    throw new Error("Account number is required");
  }

  if (typeof rdCountTillNow !== "number" || rdCountTillNow < 0) {
    throw new Error("Invalid RD count");
  }

  // Next RD sequence
  const nextRd = rdCountTillNow + 1;

  // Last 4 digit format (0001, 0002, ...)
  const suffix = String(nextRd).padStart(4, "0");

  // Remove old RD suffix if present (safety)
  const baseAccount = accountNumber.replace(/-\d{4}$/, "");

  return `${baseAccount}-${suffix}`;
}
