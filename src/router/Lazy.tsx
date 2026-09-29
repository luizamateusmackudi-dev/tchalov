import { Suspense, type ReactNode } from "react";

export default function Lazy({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "#FFFDF7" }} />}>{children}</Suspense>
  );
}
