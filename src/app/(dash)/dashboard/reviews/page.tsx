"use client";
import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CustomerReviewsPage = () => {
  const {
    data: reviews,
    error,
    mutate,
  } = useSWR("/api/customer-reviews", fetcher);
  const [form, setForm] = useState({
    id: "",
    customerName: "",
    review: "",
    rating: 1,
    region: "الرياض",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const router = useRouter();

  if (error) {
    return <div>Error loading reviews</div>;
  }

  if (!reviews) {
    return <div>Loading...</div>;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);

    const method = isEditing ? "PUT" : "POST";
    const response = await fetch("/api/customer-reviews", {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      setForm({
        id: "",
        customerName: "",
        review: "",
        rating: 1,
        region: "الرياض",
      });
      setIsEditing(false);
      setSuccess("تم الحفظ بنجاح");
      mutate(); // Re-fetch the data after submitting the form
    } else {
      const errorData = await response.json();
      setFormError(errorData.error || "Failed to save the data");
    }
  };

  const handleEdit = (review: any) => {
    setForm({
      id: review.id,
      customerName: review.customerName,
      review: review.review,
      rating: review.rating,
      region: review.region,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    const response = await fetch("/api/customer-reviews", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      mutate(); // Re-fetch the data after deleting the review
    } else {
      const errorData = await response.json();
      setFormError(errorData.error || "Failed to delete the data");
    }
  };

  return (
    <div className="w-full mx-auto py-10 text-center bg-gray-100">
      <h3 className="text-3xl font-bold text-blue-200 bg-blue-900 rounded-lg py-5 mx-6">
        آراء العملاء
      </h3>
      {formError && <p className="text-red-500 text-center">{formError}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}
      <form
        className="mt-8 max-w-md mx-auto bg-white p-8 shadow-sm shadow-blue-500 rounded-md"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            htmlFor="customerName"
            className="block text-sm font-medium text-gray-700"
          >
            اسم العميل
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="اسم العميل"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="review"
            className="block text-sm font-medium text-gray-700"
          >
            رأي العميل
          </label>
          <textarea
            id="review"
            name="review"
            value={form.review}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="رأي العميل"
            rows={5}
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="rating"
            className="block text-sm font-medium text-gray-700"
          >
            تقييم العميل
          </label>
          <select
            id="rating"
            name="rating"
            value={form.rating}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          >
            <option value={1}>⭐ نجمة واحدة</option>
            <option value={2}>⭐⭐ نجمتين</option>
            <option value={3}>⭐⭐⭐ ثلاث نجوم</option>
            <option value={4}>⭐⭐⭐⭐ أربع نجوم</option>
            <option value={5}>⭐⭐⭐⭐⭐ خمس نجوم</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="region"
            className="block text-sm font-medium text-gray-700"
          >
            المنطقة
          </label>
          <select
            id="region"
            name="region"
            value={form.region}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          >
            <option value="الرياض">الرياض</option>
            <option value="جدة">جدة</option>
            <option value="مكة">مكة</option>
            <option value="المدينة">المدينة</option>
            <option value="دبي">دبي</option>
            <option value="الشارقة">الشارقة</option>
            <option value="عجمان">عجمان</option>
            <option value="أبوظبي">أبوظبي</option>
            <option value="العين">العين</option>
            <option value="رأس الخيمة">رأس الخيمة</option>
            <option value="الفجيرة">الفجيرة</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          {isEditing ? "تحديث" : "حفظ"}
        </button>
      </form>
      <div className="mt-10 w-full bg-gray-100 py-6">
        <h2 className="text-xl text-center mb-4">آراء العملاء الحالية</h2>
        <div className="flex flex-wrap flex-col md:flex-row gap-4 justify-center items-center text-center">
          {reviews.map((review: any) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-lg shadow h-64 w-64"
            >
              <div className="flex justify-around items-center mb-2">
                <p className="text-xl font-semibold">{review.customerName}</p>
                <p className="text-sm text-gray-500 mb-2">{review.region}</p>
              </div>
              <div className="text-yellow-500 flex w-full items-center justify-center ">
                {[...Array(review.rating)].map((_, i) => (
                  <FaStar key={i} />
                ))}
                {[...Array(5 - review.rating)].map((_, i) => (
                  <FaStar key={i} className="text-gray-300" />
                ))}
              </div>
              <p className="my-3 line-clamp-5">{review.review}</p>
              <div className="flex justify-between space-x-4">
                <button
                  onClick={() => handleEdit(review)}
                  className="text-blue-600 hover:underline"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-red-600 hover:underline"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerReviewsPage;
