"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("/api/check-login", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.isLoggedIn) {
            router.push("/dashboard");
          }
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message);
        return;
      }

      const data = await res.json();
      setSuccess(data.message);

      // تعيين التوكن في LocalStorage
      localStorage.setItem("token", data.token);

      router.push("/dashboard");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <head>
        <title>تسجيل الدخول</title>
      </head>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-6 bg-white rounded shadow-md">
          <h1 className="mb-4 text-xl font-bold">تسجيل الدخول</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="mobile"
              >
                ادخل رقم الهاتف
              </label>
              <input
                type="text"
                id="mobile"
                name="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
            {success && (
              <p className="mb-4 text-sm text-green-500">{success}</p>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
            >
              تسجيل الدخول
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
