"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const WhyUsPage = () => {
  const [whyUs, setWhyUs] = useState({
    title: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchWhyUs = async () => {
      try {
        const response = await fetch("/api/why-us");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setWhyUs({
          title: data.title,
          description: data.description,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      }
    };

    fetchWhyUs();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setWhyUs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const response = await fetch("/api/why-us", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(whyUs),
    });

    if (response.ok) {
      setSuccess("تم الحفظ بنجاح");
      router.refresh();
    } else {
      setError("Failed to save the data");
    }
  };

  return (
    <div className="w-full mx-auto py-10 text-center bg-gray-100">
      <h3 className="text-3xl font-bold text-blue-200 bg-blue-900 rounded-lg py-5 mx-6">
        تعديل لماذا شركتنا
      </h3>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}
      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-md mx-auto bg-white p-8 shadow-sm shadow-blue-500 rounded-md"
      >
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            العنوان
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={whyUs.title}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="عنوان"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            الوصف
          </label>
          <textarea
            id="description"
            name="description"
            value={whyUs.description}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="الوصف"
            rows={5}
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            حفظ
          </button>
        </div>
      </form>
    </div>
  );
};

export default WhyUsPage;
