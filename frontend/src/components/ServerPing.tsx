"use client";

import { useEffect } from "react";
import { pingServer } from "@/lib/api";

export default function ServerPing() {
  useEffect(() => {
    pingServer();
  }, []);

  return null;
}