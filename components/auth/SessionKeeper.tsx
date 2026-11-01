"use client";

import { useEffect, useRef } from "react";

interface SessionKeeperProps {
  isLoggedIn: boolean;
}

/**
 * 9-minute interval for background session maintenance (before 15-minute backend token expiration).
 */
const HEARTBEAT_INTERVAL_MS = 9 * 60 * 1000;

/**
 * Minimum idle window (5 minutes) before triggering an immediate refresh upon tab focus.
 */
const FOCUS_REFRESH_THRESHOLD_MS = 5 * 60 * 1000;

/**
 * Silent client-side session keeper component.
 * Periodically issues silent background heartbeat pings to `/api/auth/refresh`
 * to maintain active user sessions and prevent unexpected 15-minute logouts.
 */
export function SessionKeeper({ isLoggedIn }: SessionKeeperProps) {
  const lastRefreshRef = useRef<number>(Date.now());
  const isRefreshingRef = useRef<boolean>(false);
  const isTerminatedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isLoggedIn || isTerminatedRef.current) {
      return;
    }

    const performSilentRefresh = async (): Promise<void> => {
      if (isRefreshingRef.current || isTerminatedRef.current) {
        return;
      }

      try {
        isRefreshingRef.current = true;
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (res.status === 401) {
          // Session was explicitly terminated or revoked on backend
          isTerminatedRef.current = true;
          return;
        }

        if (res.ok) {
          lastRefreshRef.current = Date.now();
        }
      } catch {
        // Silently tolerate transient offline/network hiccups
      } finally {
        isRefreshingRef.current = false;
      }
    };

    // 1. Regular 9-minute heartbeat interval
    const intervalId = setInterval(() => {
      performSilentRefresh();
    }, HEARTBEAT_INTERVAL_MS);

    // 2. Tab focus listener: re-check if user returned to tab after idle period
    const handleVisibilityChange = (): void => {
      if (document.visibilityState === "visible") {
        const timeSinceLastRefresh = Date.now() - lastRefreshRef.current;
        if (timeSinceLastRefresh >= FOCUS_REFRESH_THRESHOLD_MS) {
          performSilentRefresh();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isLoggedIn]);

  return null;
}

