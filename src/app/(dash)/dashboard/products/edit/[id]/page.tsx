"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProductById, updateProduct } from "@/app/lib/actionProduct";
import Image from "next/image";

export default function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: null as File | null,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(params.id);
        if (productData) {
          setFormData({
            title: productData.title,
            description: productData.description,
            price: productData.price.toString(),
            image: null,
          });
          setPreviewImage(productData.imagePath);
        } else {
          setError("لم يتم العثور على المنتج");
        }
      } catch (err) {
        setError("حدث خطأ أثناء جلب بيانات المنتج");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0];
      if (file) {
        setFormData({ ...formData, image: file });
        setPreviewImage(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("price", formData.price);

      if (formData.image) {
        form.append("image", formData.image);
      }

      await updateProduct(params.id, form);
      router.push("/dashboard/products");
    } catch (err) {
      setError("حدث خطأ أثناء تحديث المنتج");
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-500 hover:underline"
        >
          العودة للخلف
        </button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto py-10 text-center bg-gray-100">
      <h3 className="text-3xl font-bold text-blue-200 bg-blue-900 rounded-lg py-5 mx-6">
        تعديل المنتج
      </h3>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="mt-8 max-w-md mx-auto bg-white p-8 shadow-sm shadow-blue-500 rounded-md"
      >
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            اسم المنتج
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="عنوان المنتج"
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
            required
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="وصف المنتج"
          />
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
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="سعر المنتج"
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
            accept="image/*"
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          />
          {previewImage && (
            <div className="mt-2 relative w-full h-64">
              <Image
                src={previewImage}
                alt="Product preview"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                className="object-contain rounded-md"
              />
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            حفظ التغييرات
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
