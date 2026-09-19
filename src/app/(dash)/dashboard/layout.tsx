"use client";
import Sidebar from "@/app/components/Sidebar";
import Footer from "@/app/components/FooterDash";
import { Almarai } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkLoginStatus } from "@/app/utils/auth";
import React, { Suspense } from "react";

const almarai = Almarai({ subsets: ["arabic"], weight: "700" });

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const fetchLoginStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          if (isMounted) {
            setIsLoggedIn(false);
            router.replace("/login");
          }
          return;
        }

        const loggedIn = await checkLoginStatus();
        if (isMounted) {
          setIsLoggedIn(loggedIn);
        }
        if (!loggedIn) {
          router.replace("/login");
        }
      } catch (error) {
        console.error("خطأ في التحقق من حالة تسجيل الدخول:", error);
        router.replace("/login");
      }
    };

    fetchLoginStatus();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isLoggedIn === null) {
    return (
      <div>
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
        </div>
      </div>
    ); // يمكن عرض شاشة تحميل مؤقتة هنا
  }

  if (!isLoggedIn) {
    return (
      <div>
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
        </div>
      </div>
    );
  }

  return isLoggedIn ? (
    <html lang="ar" dir="rtl">
      <body className={`overflow-x-hidden ${almarai.className}`}>
        <section>
          <div className="flex justify-center bg-gray-100 overflow-hidden">
            <Sidebar />
            <Suspense
              fallback={
                <div>
                  <div className="flex flex-row gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
                  </div>
                </div>
              }
            >
              <div className="container mx-auto md:w-full pr-20 pl-5">
                {children}
              </div>
            </Suspense>
          </div>
          <Footer />
        </section>
      </body>
    </html>
  ) : (
    <div>جاري التحميل...</div>
  );
};

export default DashboardLayout;
