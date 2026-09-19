import PageHeader from "@/app/components/PageHeader";
import { ReactNode } from "react";
import { GoogleTagManager } from "@next/third-parties/google";

interface PagesLayoutProps {
  children: ReactNode;
  params: { 
    pageTitle: string;
    pageDescription?: string;
    breadcrumb?: Array<{
      label: string;
      href?: string;
    }>;
  };
}

interface Settings {
  companyName: string;
  phoneNumber: string;
}

interface Description {
  description: string;
}

export default function PagesLayout({ children, params }: PagesLayoutProps) {
  const { pageTitle, pageDescription, breadcrumb } = params;
  
  // فقط اعرض PageHeader إذا كان هناك title
  if (!pageTitle) {
    return (
      <>
        <GoogleTagManager gtmId="GTM-T2TG3ZB8" />
        {children}
      </>
    );
  }

  return (
    <>
      <GoogleTagManager gtmId="GTM-T2TG3ZB8" />

      <PageHeader 
        title={pageTitle}
        description={pageDescription}
      />
      {children}
    </>
  );
}
