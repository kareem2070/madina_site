"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";

const Gallery = () => {
  const [images, setImages] = useState<{ id: number; url: string }[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/gallery");
        const data = await response.json();
        if (Array.isArray(data)) {
          setImages(data);
        } else {
          setImages([]);
        }
      } catch (err) {
        console.error("Failed to load images", err);
        setError("فشل في تحميل الصور");
      }
    };

    fetchImages();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setProgress(0); // Reset progress

    if (selectedFiles.length === 0) {
      setError("يرجى تحديد الصور للرفع");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/gallery", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        setImages((prevImages) => [...prevImages, ...data]);
        setSelectedFiles([]);
        setSuccess("تم رفع الصور بنجاح");
        setProgress(0); // Reset progress after success
      } else {
        const errorData = JSON.parse(xhr.responseText);
        setError(errorData.error || "فشل في رفع الصور");
      }
    };

    xhr.onerror = () => {
      setError("فشل في رفع الصور");
    };

    xhr.send(formData);
  };

  const handleDelete = async (url: string) => {
    try {
      const response = await fetch("/api/gallery", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("فشل في حذف الصورة");
      }

      setImages((prevImages) =>
        prevImages.filter((image) => image.url !== url)
      );
      setSuccess("تم حذف الصورة بنجاح");
    } catch (err) {
      console.error("Failed to delete image", err);
      setError("فشل في حذف الصورة");
    }
  };

  return (
    <div className="w-full mx-auto py-10 text-center bg-gray-100">
      <h3 className="text-3xl font-bold text-blue-200 bg-blue-900 rounded-lg py-5 mx-6">
        معرض الصور
      </h3>
      <div className="mt-8 max-w-md mx-auto bg-white p-8 shadow-sm shadow-blue-500 rounded-md">
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        {success && <p className="mb-4 text-sm text-green-500">{success}</p>}
        <form onSubmit={handleUpload} encType="multipart/form-data">
          <div className="mb-4">
            <label
              htmlFor="images"
              className="block text-sm font-medium text-gray-700"
            >
              تحميل الصور
            </label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            رفع الصور
          </button>

          {progress > 0 && (
            <div className="mt-4">
              <progress
                value={progress}
                max="100"
                className="w-full"
              ></progress>
            </div>
          )}
        </form>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-5">
        {Array.isArray(images) &&
          images.map((image) => (
            <div key={image.id} className="relative w-full h-64">
              <Image
                src={image.url}
                alt="Gallery Image"
                layout="fill"
                objectFit="cover"
                className="rounded-3xl shadow-lg"
              />
              <button
                onClick={() => handleDelete(image.url)}
                className="absolute top-2 right-2 text-red-500 bg-white rounded-full p-2 shadow-md"
              >
                <FaTrash />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Gallery;
