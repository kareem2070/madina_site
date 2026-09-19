"use client";
import { useState, useEffect } from "react";

const Contact = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    email: "",
    city: "",
  });
  const [mapUrl, setMapUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch("/api/contact");
        const data = await response.json();
        if (data) {
          setForm(data);
          if (data.city) {
            await updateMap(data.city);
          }
        }
      } catch (err) {
        setError("فشل في تحميل بيانات الموقع");
      }
    };

    fetchContactInfo();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleCityChange = async (e: any) => {
    const cityInput = e.target.value;
    setForm((prevForm) => ({
      ...prevForm,
      city: cityInput,
    }));

    if (cityInput) {
      await updateMap(cityInput);
    } else {
      setMapUrl("");
    }
  };

  const updateMap = async (city: string) => {
    try {
      const response = await fetch("/api/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: city }),
      });

      const data = await response.json();
      console.log("Location Data:", data); // للتحقق من البيانات المستلمة من API

      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        const mapUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}&hl=es;z=14&output=embed`;
        setMapUrl(mapUrl);
      } else {
        setMapUrl("");
      }
    } catch (error) {
      setError("فشل في تحميل بيانات الموقع");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "فشل في حفظ البيانات");
      } else {
        setSuccess("تم الحفظ بنجاح");
      }
    } catch (err) {
      setError("فشل في حفظ البيانات");
    }
  };

  return (
    <div className="w-full mx-auto py-10 text-center bg-gray-100">
      <h3 className="text-3xl font-bold text-blue-200 bg-blue-900 rounded-lg py-5 mx-6">
        تواصل معنا
      </h3>
      <div className="mt-8 max-w-md mx-auto bg-white p-8 shadow-sm shadow-blue-500 rounded-md">
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        {success && <p className="mb-4 text-sm text-green-500">{success}</p>}
        <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto">
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              عنوان
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              وصف
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              required
              rows={4}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              عنوان الشركة
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              المدينة
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={form.city}
              onChange={handleCityChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              required
            />
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
      {mapUrl && (
        <iframe
          src={mapUrl}
          width="600"
          height="450"
          title="map"
          allowFullScreen
          loading="lazy"
          className="w-full rounded-lg shadow-lg mt-8"
        ></iframe>
      )}
    </div>
  );
};

export default Contact;
