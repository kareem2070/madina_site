"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { IoMdColorPalette } from "react-icons/io";

import {
  FaFacebookF,
  FaInstagram,
  FaSnapchat,
  FaTiktok,
  FaTwitter,
  FaYoutube,
  FaTrash,
} from "react-icons/fa6";

const iconOptions = {
  facebook: <FaFacebookF />,
  instagram: <FaInstagram />,
  snapchat: <FaSnapchat />,
  tiktok: <FaTiktok />,
  twitter: <FaTwitter />,
  youtube: <FaYoutube />,
};

type SocialLink = {
  icon: string;
  link: string;
};

type FormType = {
  companyName: string;
  description: string;
  phoneNumber: string;
  whatsappNumber: string;
  countryCode: string;
  whiteLogo: File | string;
  blackLogo: File | string;
  icon: File | string;
  city: string;
  socialLinks: SocialLink[];
};

const SettingsPage = () => {
  const [form, setForm] = useState<FormType>({
    companyName: "",
    description: "",
    phoneNumber: "",
    whatsappNumber: "",
    countryCode: "",
    whiteLogo: "",
    blackLogo: "",
    icon: "",
    city: "",
    socialLinks: [],
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        const data = await response.json();
        if (data) {
          setForm(data);
        }
      } catch (err) {
        setError("Failed to load settings");
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: files[0],
      }));
    }
  };

  const handleSocialLinkChange = (
    index: number,
    key: string,
    value: string
  ) => {
    const newSocialLinks = [...form.socialLinks];
    newSocialLinks[index] = { ...newSocialLinks[index], [key]: value };
    setForm((prevForm) => ({
      ...prevForm,
      socialLinks: newSocialLinks,
    }));
  };

  const addSocialLink = () => {
    setForm((prevForm) => ({
      ...prevForm,
      socialLinks: [...prevForm.socialLinks, { icon: "", link: "" }],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "socialLinks") {
        formData.append(key, JSON.stringify(form[key as keyof FormType]));
      } else if (form[key as keyof FormType] instanceof Blob) {
        formData.append(key, form[key as keyof FormType] as Blob);
      } else {
        formData.append(key, form[key as keyof FormType] as string);
      }
    });

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSuccess("تم الحفظ بنجاح");
        router.refresh();
      } else {
        setError("Failed to save the data");
      }
    } catch (err) {
      setError("Failed to save the data");
    }
  };

  return (
    <div className="w-full mx-auto py-10 text-center bg-gray-100">
      <h3 className="text-3xl font-bold text-blue-200 bg-blue-900 rounded-lg py-5 mx-6">
        إعدادات الموقع
      </h3>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}
      <form
        className="mt-8 max-w-4xl mx-auto  bg-white p-8 shadow-sm shadow-blue-500 rounded-md"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="flex flex-col md:flex-row justify-center">
          <div className="w-full">
            <div className="w-full lg:w-4/5">
              <div className="mb-5">
                <label
                  htmlFor="companyName"
                  className="block text-md font-medium text-gray-700"
                >
                  اسم الشركة
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="اسم الشركة"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="description"
                  className="block text-md font-medium text-gray-700"
                >
                  وصف الشركة
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="وصف الشركة"
                  rows={5}
                ></textarea>
              </div>
            </div>
            <div className="w-full lg:w-4/5">
              <div className="mb-5">
                <label
                  htmlFor="phoneNumber"
                  className="block text-md font-medium text-gray-700"
                >
                  رقم الهاتف
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="رقم الهاتف"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="whatsappNumber"
                  className="block text-md font-medium text-gray-700"
                >
                  رقم الواتس اب
                </label>
                <input
                  type="text"
                  id="whatsappNumber"
                  name="whatsappNumber"
                  value={form.whatsappNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="رقم الواتس اب"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="countryCode"
                  className="block text-md font-medium text-gray-700"
                >
                  كود الدولة
                </label>
                <select
                  id="countryCode"
                  name="countryCode"
                  value={form.countryCode}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">اختر كود الدولة</option>
                  <option value="20">مصر (+20)</option>
                  <option value="966">السعودية (+966)</option>
                  <option value="971">الإمارات (+971)</option>
                  <option value="965">الكويت (+965)</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mb-5 lg:w-full">
            <div className="mb-5 text-center">
              <button
                type="button"
                onClick={addSocialLink}
                className="bg-blue-600 text-white py-2 px-4 rounded-full"
              >
                إضافة رابط
              </button>
            </div>
            {form.socialLinks.length > 0 &&
              form.socialLinks.map((link, index) => (
                <div
                  key={index}
                  className="mb-5 flex flex-col md:flex-row items-center gap-3"
                >
                  <select
                    value={link.icon}
                    onChange={(e) =>
                      handleSocialLinkChange(index, "icon", e.target.value)
                    }
                    className="border-2 border-gray-300 bg-white text-gray-600 p-2.5 rounded-md md:w-2/5"
                  >
                    <option value="facebook">فيس بوك</option>
                    <option value="instagram">انستجرام</option>
                    <option value="snapchat">سناب شات</option>
                    <option value="tiktok">تيك توك</option>
                    <option value="twitter">تويتر</option>
                    <option value="youtube">يوتيوب</option>
                  </select>
                  <input
                    type="text"
                    value={link.link}
                    onChange={(e) =>
                      handleSocialLinkChange(index, "link", e.target.value)
                    }
                    className="border-2 border-gray-300 bg-white text-gray-600 p-2 rounded-md "
                    placeholder="رابط"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newSocialLinks = form.socialLinks.filter(
                        (_, i) => i !== index
                      );
                      setForm((prevForm) => ({
                        ...prevForm,
                        socialLinks: newSocialLinks,
                      }));
                    }}
                    className="bg-red-500 text-white p-2 rounded-full"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            <div className="w-full">
              <div className="mb-5 flex flex-col md:flex-row items-center justify-center gap-5">
                <div>
                  <label
                    htmlFor="whiteLogo"
                    className="block text-md font-medium text-gray-700"
                  >
                    اللوجو الأبيض
                  </label>
                  <input
                    type="file"
                    id="whiteLogo"
                    name="whiteLogo"
                    onChange={handleFileChange}
                    className="mt-1 block  p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                {typeof form.whiteLogo === "string" && form.whiteLogo && (
                  <Image
                    src={form.whiteLogo}
                    alt="White Logo"
                    width={100}
                    height={100}
                    className="mt-5 h-6 w-32 object-cover mx-auto"
                  />
                )}
              </div>
              <div className="mb-5 w-full">
                <div className="mb-5 flex flex-col md:flex-row items-center justify-center gap-5">
                  <div className="">
                    <label
                      htmlFor="blackLogo"
                      className="block text-md font-medium text-gray-700"
                    >
                      اللوجو الغامق
                    </label>
                    <input
                      type="file"
                      id="blackLogo"
                      name="blackLogo"
                      onChange={handleFileChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  {typeof form.blackLogo === "string" && form.blackLogo && (
                    <Image
                      src={form.blackLogo}
                      alt="Black Logo"
                      width={100}
                      height={100}
                      className="mt-5 h-6 w-32 object-cover mx-auto"
                    />
                  )}
                </div>
              </div>
              <div className="mb-5 flex flex-col md:flex-row items-center justify-center gap-5">
                <div className="mb-5 w-full">
                  <label
                    htmlFor="icon"
                    className="block text-md font-medium text-gray-700"
                  >
                    الأيقونة
                  </label>
                  <input
                    type="file"
                    id="icon"
                    name="icon"
                    onChange={handleFileChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                {typeof form.icon === "string" && form.icon && (
                  <Image
                    src={form.icon}
                    alt="Icon"
                    width={100}
                    height={100}
                    className="mt-5 h-20 w-20 object-cover mx-auto"
                  />
                )}
              </div>
            </div>
            <div className="mb-5">
              <label
                htmlFor="city"
                className="block text-md font-medium text-gray-700"
              >
                المدينة
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="المدينة"
              />
            </div>
          </div>
        </div>

        <div className="w-full text-center flex justify-center items-center gap-10">
          <button
            type="submit"
            className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            حفظ
          </button>
        </div>
      </form>
      <div className="color">
        <button
          type="submit"
          className="py-2 flex gap-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 m-auto mt-8"
        >
          <Link href="/dashboard/colors">تغير الالوان </Link>
          <IoMdColorPalette size={20} />
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
