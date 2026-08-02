"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuthGuard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId || storedUserId.trim() === "") {
      localStorage.removeItem("userId");
      router.push("/login");
      return;
    }

    setUserId(storedUserId.trim());
    setIsAuthenticated(true);
  }, [router]);

  const clearAuthAndRedirect = () => {
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return { isAuthenticated, userId, isMounted, clearAuthAndRedirect };
}
