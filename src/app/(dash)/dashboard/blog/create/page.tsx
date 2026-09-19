"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import Image from "next/image";

const MyEditor = dynamic(() => import("@/app/components/Editor"), {
  ssr: false,
});

export default function CreateBlogPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", content);
    formData.append("slug", slug);
    formData.append("author", author);
    formData.append("tags", JSON.stringify(tags));
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    const res = await fetch("/api/blog", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      router.push("/dashboard/blog");
    }
  };

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCoverImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverImagePreview(null);
    }
  };

  return (
    <div className="w-full mx-auto py-10 text-center bg-gray-100">
      <h3 className="text-3xl font-bold text-blue-200 bg-blue-900 rounded-lg py-5 mx-6">
        إنشاء منشور جديد
      </h3>
      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-md mx-auto bg-white p-8 shadow-sm shadow-blue-500 rounded-md"
        encType="multipart/form-data"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            العنوان
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            الوصف
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            المحتوى
          </label>
          <MyEditor data={content} onChange={handleEditorChange} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            الرمز (Slug)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            المؤلف
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            التاجات
          </label>
          <TagsInput
            value={tags}
            onChange={(tags) => setTags(tags)}
            inputProps={{ placeholder: "أضف تاج" }}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            صورة الغلاف
          </label>
          <input
            type="file"
            onChange={handleCoverImageChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          />
          {coverImagePreview && (
            <div className="mt-2">
              <Image
                src={coverImagePreview}
                alt="معاينة صورة الغلاف"
                width={200}
                height={200}
                className="object-cover rounded-md"
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          إنشاء المنشور
        </button>
      </form>
    </div>
  );
}
