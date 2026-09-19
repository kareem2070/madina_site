"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProduct } from "@/app/lib/actionProduct";

const CreateProductPage = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const result = await saveProduct(formData);
      if (result && result.message === "Product saved successfully!") {
        setSuccessMessage(result.message);
        setErrorMessage(null);
        e.target.reset();
      } else if (result && result.Errors) {
        setSuccessMessage(null);
        setErrorMessage("Validation error: " + JSON.stringify(result.Errors));
      } else if (result && result.message) {
        setSuccessMessage(null);
        setErrorMessage(result.message);
      } else {
        setSuccessMessage(null);
        setErrorMessage("An unknown error occurred");
      }
    } catch (error: any) {
      setSuccessMessage(null);
      setErrorMessage(`Failed to save product: ${error.message}`);
    }
  };

  return (
    <div className="w-full mx-auto py-10 text-center bg-gray-100">
      <h3 className="text-3xl font-bold text-blue-200 bg-blue-900 rounded-lg py-5 mx-6">
        إضافة منتج جديد
      </h3>
      {successMessage && (
        <div className="text-green-600 mb-4">{successMessage}</div>
      )}
      {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
      <form
        onSubmit={handleSubmit}
        method="post"
        encType="multipart/form-data"
        className="mt-8 max-w-md mx-auto bg-white p-8 shadow-sm shadow-blue-500 rounded-md"
      >
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            عنوان المنتج
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="عنوان المنتج"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            وصف المنتج
          </label>
          <textarea
            id="description"
            name="description"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="وصف المنتج"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            سعر المنتج
          </label>
          <input
            type="number"
            id="price"
            name="price"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="سعر المنتج"
            required
            step="0.01"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            صورة المنتج
          </label>
          <input
            type="file"
            id="image"
            name="image"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          />
        </div>
        <button
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          type="submit"
        >
          إضافة المنتج
        </button>
      </form>
    </div>
  );
};

export default CreateProductPage;
