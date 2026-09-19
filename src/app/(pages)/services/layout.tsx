import { ReactNode } from "react";
import { GoogleTagManager } from "@next/third-parties/google";

interface ServiceLayoutProps {
  children: ReactNode;
}

export default function ServiceLayout({ children }: ServiceLayoutProps) {
  return (
    <>
      <GoogleTagManager gtmId="GTM-T2TG3ZB8" />
      {children}
    </>
  );
}
