"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

const ConvexAvailableContext = createContext(false);

export function useConvexAvailable() {
  return useContext(ConvexAvailableContext);
}

export function Providers({ children }: { children: ReactNode }) {
  const client = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url || url.includes("127.0.0.1") || url.includes("localhost")) {
      // Skip local-only anonymous backends on public builds unless explicitly allowed
      if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_CONVEX_FORCE_LOCAL) {
        return null;
      }
    }
    if (!url) return null;
    return new ConvexReactClient(url);
  }, []);

  if (!client) {
    return (
      <ConvexAvailableContext.Provider value={false}>
        {children}
      </ConvexAvailableContext.Provider>
    );
  }

  return (
    <ConvexAvailableContext.Provider value={true}>
      <ConvexProvider client={client}>{children}</ConvexProvider>
    </ConvexAvailableContext.Provider>
  );
}
