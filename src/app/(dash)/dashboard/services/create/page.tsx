"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createService } from "@/app/lib/action";
import dynamic from "next/dynamic";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";

const MyEditor = dynamic(() => import("@/app/components/Editor"), {
  ssr: false,
});

const CreateServiceForm = () => {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    content: string;
    image: File | null;
    galleryImages: File[];
  }>({
    title: "",
    description: "",
    content: "",
    image: null,
    galleryImages: [],
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewGalleryImages, setPreviewGalleryImages] = useState<string[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveFormData = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("content", formData.content);
      if (formData.image) {
        form.append("image", formData.image);
      }
      formData.galleryImages.forEach((image) => {
        form.append("galleryImages", image);
      });

      const response = await createService(form);

      if (response.message === "Service created successfully!") {
        console.log("تم إنشاء الخدمة بنجاح!");
        router.push("/dashboard/services");
      } else {
        console.error("حدث خطأ أثناء إنشاء الخدمة!");
      }
    } catch (error: any) {
      console.error(
        "Error creating service:",
        error.response ? error.response.data : error.message
      );
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const inputElement = e.target as HTMLInputElement;
    if (name === "image" && inputElement.files) {
      setFormData({ ...formData, image: inputElement.files[0] });
      setPreviewImage(URL.createObjectURL(inputElement.files[0]));
    } else if (name === "galleryImages" && inputElement.files) {
      const fileList = Array.from(inputElement.files) as File[];
      setFormData({ ...formData, galleryImages: fileList });
      const fileListUrls = fileList.map((file) => URL.createObjectURL(file));
      setPreviewGalleryImages(fileListUrls);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleEditorChange = (content: string) => {
    setFormData((prevFormData) => ({ ...prevFormData, content }));
  };

  const handleRemoveImage = (index: number) => {
    const updatedGalleryImages = previewGalleryImages.filter(
      (_, i) => i !== index
    );
    setPreviewGalleryImages(updatedGalleryImages);
    const updatedFormDataGalleryImages = formData.galleryImages.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, galleryImages: updatedFormDataGalleryImages });
  };

  return (
    <form
      onSubmit={saveFormData}
      encType="multipart/form-data"
      className="mt-8 mx-auto bg-white p-8 shadow-sm shadow-blue-500 rounded-md"
    >
      <div className="flex flex-col justify-center md:flex-row gap-16">
        <div className="w-full md:w-1/3">
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              اسم الخدمة
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="عنوان الخدمة"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              وصف الخدمة
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="وصف الخدمة"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              مقالة الخدمة
            </label>
            <MyEditor data={formData.content} onChange={handleEditorChange} />
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              صورة
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
            {previewImage && (
              <div className="mt-2 max-w-xs max-h-64">
                <Image
                  width={200}
                  height={200}
                  src={previewImage}
                  alt="Service Image"
                  className="w-full max-h-64 rounded-md object-cover"
                />
              </div>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="galleryImages"
              className="block text-sm font-medium text-gray-700"
            >
              معرض الصور
            </label>
            <input
              type="file"
              id="galleryImages"
              name="galleryImages"
              onChange={handleChange}
              multiple
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
            <div className="mt-2 grid grid-cols-3 gap-2">
              {previewGalleryImages.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    width={100}
                    height={100}
                    src={image}
                    alt={`Gallery Image ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      <button
        type="submit"
        className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
      >
        حفظ الخدمة
      </button>
    </form>
  );
};

export default CreateServiceForm;
