"use client";

import { useEffect } from "react";
import { trackServiceView } from "@/app/utils/gtm";

interface ServiceTrackerProps {
  serviceName: string;
  serviceId: number;
}

/**
 * مكون تتبع عرض صفحة الخدمة
 */
export default function ServiceTracker({ serviceName, serviceId }: ServiceTrackerProps) {
  useEffect(() => {
    trackServiceView(serviceName, serviceId);
  }, [serviceName, serviceId]);

  return null;
}


