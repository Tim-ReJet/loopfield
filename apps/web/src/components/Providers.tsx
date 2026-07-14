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
    if (!url) return null;
    // Never point production clients at anonymous local backends.
    if (
      process.env.NODE_ENV === "production" &&
      (url.includes("127.0.0.1") || url.includes("localhost")) &&
      !process.env.NEXT_PUBLIC_CONVEX_FORCE_LOCAL
    ) {
      return null;
    }
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
