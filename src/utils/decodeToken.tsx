"use client";
import jwt from "jsonwebtoken";

export const decodeToken = (token: string) => {
  try {
    const userData = jwt.decode(token);
    return userData;
  } catch (err) {
    console.error("Error decoding token:", err);
  }
};
