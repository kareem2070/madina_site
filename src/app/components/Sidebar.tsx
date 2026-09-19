import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaPager,
  FaServicestack,
  FaUsers,
  FaComments,
  FaAddressBook,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaImage,
  FaVideo,
  FaBuilding,
  FaShopify,
  FaBlog,
} from "react-icons/fa";

export default function Sidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const iconSize = "text-2xl";

  return (
    <div className="">
      <div
        className={`bg-blue-950 text-white h-screen overflow-y-auto py-4 fixed z-10 transform transition-transform duration-300 ${
          isOpen ? "w-64" : "w-16"
        } right-0 rtl`}
      >
        <div className="flex justify-between items-center px-4 mb-4">
          <button onClick={toggleSidebar} className="text-2xl">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <ul className="flex flex-col gap-2 pr-4">
          <li className="p-2 flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <FaHome className={`ml-4 ${iconSize}`} />
              <span
                className={`transition-opacity duration-300 ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                لوحة التحكم
              </span>
            </Link>
          </li>
          <li className="p-2 flex items-center">
            <Link href="/dashboard/hero" className="flex items-center">
              <FaPager className={`ml-4 ${iconSize}`} />
              <span
                className={`transition-opacity duration-300 ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                الصفحة الرئيسية
              </span>
            </Link>
          </li>
          <li className="p-2 flex items-center">
            <Link href="/dashboard/about" className="flex items-center">
              <FaBuilding className={`ml-4 ${iconSize}`} />
              <span
                className={`transition-opacity duration-300 ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                نبذة عن الشركة
              </span>
            </Link>
          </li>
          <li className="p-2 flex items-center">
            <Link href="/dashboard/products" className="flex items-center">
              <FaShopify className={`ml-4 ${iconSize}`} />
              <span
                className={`transition-opacity duration-300 ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                المنتجات
              </span>
            </Link>
          </li>
          <li className="p-2 flex items-center">
            <Link href="/dashboard/services" className="flex items-center">
              <FaServicestack className={`ml-4 ${iconSize}`} />
              <span
                className={`transition-opacity duration-300 ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                الخدمات
              </span>
            </Link>
          </li>
          <li className="p-2 flex items-center">
            <Link href="/dashboard/blog" className="flex items-center">
              <FaBlog className={`ml-4 ${iconSize}`} />
              <span
                className={`transition-opacity duration-300 ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                المدونة
              </span>
            </Link>
          </li>
          <li className="p-2 flex items-center">
            <Link href="/dashboard/videos" className="flex items-center">
              <FaVideo className={`ml-4 ${iconSize}`} />
              <span
                className={`transition-opacity duration-300 ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                الفيديوهات
              </span>
            </Link>
          </li>
          <li className="p-2 flex items-center">
            <Link href="/dashboard/gallery" className="flex items-center">
              <FaImage className={`ml-4 ${iconSize}`} />
              <span
                className={`transition-opacity duration-300 ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                الصور
              </span>
            </Link>
          </li>
          <li className="p-2 flex items-center">
            <Link href="/dashboard/why-us" className="flex items-center">
              <FaUsers className={`ml-4 ${iconSize}`} />
              <span
                className={`transition-opacity duration-300 ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                لماذا شركتنا
              </span>
            </Link>
          </li>
          <li className="p-2 flex items-center">
            <Link href="/dashboard/reviews" className="flex items-center">
              <FaComments className={`ml-4 ${iconSize}`} />
              <span
                className={`transition-opacity duration-300 ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                آراء العملاء
              </span>
            </Link>
          </li>
          <li className="p-2 flex items-center">
            <Link href="/dashboard/contact" className="flex items-center">
              <FaAddressBook className={`ml-4 ${iconSize}`} />
              <span
                className={`transition-opacity duration-300 ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                معلومات التواصل
              </span>
            </Link>
          </li>
          <li className="p-2 flex items-center">
            <Link href="/dashboard/profile" className="flex items-center">
              <FaUser className={`ml-4 ${iconSize}`} />
              <span
                className={`transition-opacity duration-300 ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                الملف الشخصي
              </span>
            </Link>
          </li>
          <li className="p-2 flex items-center">
            <Link href="/dashboard/settings" className="flex items-center">
              <FaCog className={`ml-4 ${iconSize}`} />
              <span
                className={`transition-opacity duration-300 ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                الإعدادات
              </span>
            </Link>
          </li>
        </ul>

        <div className="md:static mt-10 md:mt-6 pr-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded flex items-center w-fit"
          >
            <FaSignOutAlt className="ml-2 text-xl" />
            <span
              className={`transition-opacity duration-300 ${
                isOpen ? "block" : "hidden"
              }`}
            >
              تسجيل الخروج
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
