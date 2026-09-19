"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [newMobile, setNewMobile] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // جلب userId من التوكن الموجود في localStorage
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUserId(decodedToken.userId);
    }
  }, []);

  const handleUpdateMobile = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/update-mobile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId, newMobile }), // استخدام userId المتغير
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message);
        return;
      }

      const data = await res.json();
      setSuccess(data.message);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="w-full mx-auto py-10 text-center bg-gray-100">
      <h3 className="text-3xl font-bold text-blue-200 bg-blue-900 rounded-lg py-5 mx-6">
        تحديث البيانات
      </h3>
      <div className="mt-8 max-w-md mx-auto bg-white p-8 shadow-sm shadow-blue-500 rounded-md">
        <form onSubmit={handleUpdateMobile}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="newMobile"
            >
              ادخل رقم هاتف جديد
            </label>
            <input
              type="text"
              id="newMobile"
              name="newMobile"
              value={newMobile}
              onChange={(e) => setNewMobile(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              required
            />
          </div>
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          {success && <p className="mb-4 text-sm text-green-500">{success}</p>}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            تحديث
          </button>
        </form>
        <button
          onClick={handleLogout}
          className="w-full flex justify-center py-2 px-4 mt-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
