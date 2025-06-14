// /app/sales/sales-view/layout.tsx
import React from "react";

export default function SalesViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>{children}</div>{" "}
    </div>
  );
}
