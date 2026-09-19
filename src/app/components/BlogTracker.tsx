"use client";

import { useEffect } from "react";
import { trackBlogView } from "@/app/utils/gtm";

interface BlogTrackerProps {
  blogTitle: string;
  blogSlug: string;
}

/**
 * مكون تتبع عرض صفحة المقال
 */
export default function BlogTracker({ blogTitle, blogSlug }: BlogTrackerProps) {
  useEffect(() => {
    trackBlogView(blogTitle, blogSlug);
  }, [blogTitle, blogSlug]);

  return null;
}


