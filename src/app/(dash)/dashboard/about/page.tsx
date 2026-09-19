"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import Image from "next/image";

const AboutUsPage = () => {
  const [aboutUs, setAboutUs] = useState({
    title: "",
    description: "",
    tags: [] as string[],
    imagePath: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        const response = await fetch("/api/about-us");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setAboutUs({
          title: data.title,
          description: data.description,
          tags: data.tags
            ? data.tags.map((tag: { name: string }) => tag.name)
            : [],
          imagePath: data.imagePath,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      }
    };

    fetchAboutUs();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAboutUs((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImage(file);
  };

  const handleTagChange = (tags: string[]) => {
    setAboutUs((prev) => ({ ...prev, tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.append("title", aboutUs.title);
    formData.append("description", aboutUs.description);
    formData.append("tags", aboutUs.tags.join(","));
    if (image) {
      formData.append("image", image);
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/about-us");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress((event.loaded / event.total) * 100);
      }
    };
    xhr.onload = async () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        setAboutUs({
          title: response.aboutUs.title,
          description: response.aboutUs.description,
          tags: response.aboutUs.tags
            ? response.aboutUs.tags.map((tag: { name: string }) => tag.name)
            : [],
          imagePath: response.aboutUs.imagePath,
        });
        setSuccess("تم الحفظ بنجاح");
      } else {
        setError("Failed to save the data");
      }
    };
    xhr.onerror = () => setError("Failed to save the data");
    xhr.send(formData);
  };

  return (
    <div className="w-full mx-auto py-10 text-center bg-gray-100">
      <h3 className="text-3xl font-bold text-blue-200 bg-blue-900 rounded-lg py-5 mx-6">
        تعديل عن الشركة
      </h3>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}
      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-md mx-auto bg-white p-8 shadow-sm shadow-blue-500 rounded-md"
        encType="multipart/form-data"
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
            value={aboutUs.title}
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
            نبذة عن الشركة
          </label>
          <textarea
            id="description"
            name="description"
            value={aboutUs.description}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="نبذة عن الشركة"
            rows={5}
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700"
          >
            العلامات (tags)
          </label>
          <TagsInput
            value={aboutUs.tags}
            onChange={handleTagChange}
            inputProps={{ placeholder: "أدخل التاجات" }}
          />
        </div>
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
            onChange={handleFileChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          />
        </div>
        {image && (
          <div className="mb-4">
            <progress value={progress} max="100" className="w-full"></progress>
          </div>
        )}
        {aboutUs.imagePath && (
          <div className="mb-4 h-64 w-64 mx-auto">
            <Image
              src={aboutUs.imagePath}
              alt="Uploaded Image"
              width={500}
              height={500}
              className="max-w-full h-64 rounded-md"
            />
          </div>
        )}
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
export default AboutUsPage;
