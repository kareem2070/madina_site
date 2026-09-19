import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800">
        ٤٠٤ - الصفحة غير موجودة
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        الصفحة التي تبحث عنها غير موجودة
      </p>
      <Link
        className="mt-6 px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-md hover:bg-blue-700 transition-colors duration-300"
        href="/"
      >
        الصفحة الرئيسية
      </Link>
    </div>
  );
}
