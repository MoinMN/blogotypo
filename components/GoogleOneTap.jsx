"use client";

import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

export default function GoogleOneTap() {
  const { status } = useSession();

  useEffect(() => {
    if (status !== "unauthenticated") return;
    if (typeof window === "undefined") return;

    if (sessionStorage.getItem("oneTapShown") === "true") return;

    let cancelled = false;

    const initializeOneTap = () => {
      if (!window.google || cancelled) return;

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: async () => {
          await signIn("google", {
            callbackUrl: window.location.href,
          });
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.prompt((notification) => {
        // Only mark as shown if it was actually displayed
        if (notification.isDisplayed()) {
          sessionStorage.setItem("oneTapShown", "true");
        }
      });
    };

    const interval = setInterval(() => {
      if (window.google) {
        clearInterval(interval);
        initializeOneTap();
      }
    }, 300);

    return () => {
      cancelled = true;
      clearInterval(interval);
      if (window.google) {
        window.google.accounts.id.cancel();
      }
    };
  }, [status]);

  return null;
}