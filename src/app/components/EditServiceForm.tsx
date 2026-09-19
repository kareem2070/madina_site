"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import EditorComponent from "@/app/components/Editor";
import { FaTrash } from "react-icons/fa";

const EditServiceForm = ({ service }: any) => {
  const [formData, setFormData] = useState({
    title: service.title,
    description: service.description,
    content: service.content || "",
    image: null,
    galleryImages: service.galleryImages
      ? JSON.parse(service.galleryImages)
      : [],
  });
  const [previewImage, setPreviewImage] = useState(service.imagePath);
  const [previewGalleryImages, setPreviewGalleryImages] = useState(
    formData.galleryImages || []
  );
  const router = useRouter();

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else if (name === "galleryImages") {
      const fileList = Array.from(files);
      setFormData({ ...formData, galleryImages: fileList });
      setPreviewGalleryImages(
        fileList.map((file: any) => URL.createObjectURL(file))
      );
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleEditorChange = (data: any) => {
    setFormData({ ...formData, content: data });
  };

  const handleRemoveImage = (index: number) => {
    const updatedGalleryImages = previewGalleryImages.filter(
      (_: any, i: number) => i !== index
    );
    setPreviewGalleryImages(updatedGalleryImages);
    const updatedFormDataGalleryImages = formData.galleryImages.filter(
      (_: any, i: number) => i !== index
    );
    setFormData({ ...formData, galleryImages: updatedFormDataGalleryImages });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("content", formData.content);
    if (formData.image) {
      form.append("image", formData.image);
    }
    formData.galleryImages.forEach((image: any, index: number) => {
      form.append(`galleryImage_${index}`, image);
    });

    try {
      await axios.put(`/api/services/update/${service.id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      router.push("/dashboard/services");
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/services/${service.id}`);
      router.push("/dashboard/services");
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
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
            <EditorComponent
              data={formData.content}
              onChange={handleEditorChange}
            />
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
              {previewGalleryImages.map((image: any, index: number) => (
                <div key={index} className="relative">
                  <Image
                    width={100}
                    height={100}
                    src={image}
                    alt={`Gallery Image ${index + 1}`}
                    className="w-52 h-40 object-cover rounded-md"
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
      <div className="flex justify-between mt-4">
        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mx-auto"
        >
          تعديل
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-auto"
        >
          حذف
        </button>
      </div>
    </form>
  );
};

export default EditServiceForm;
