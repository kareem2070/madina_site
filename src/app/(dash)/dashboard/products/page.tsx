"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProducts, deleteProduct } from "@/app/lib/actionProduct";
import Link from "next/link";
import Image from "next/image";

const ProductsPage = () => {
  const [products, setProducts] = useState<
    {
      id: number;
      title: string;
      description: string;
      price: number;
      imagePath: string;
    }[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    const getProducts = async () => {
      const productsData = await fetchProducts();
      setProducts(productsData as any);
    };

    getProducts();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="w-full mx-auto py-10 px-4 text-center bg-gray-100">
      <div className="flex justify-between items-center mb-5 bg-blue-900 text-white rounded-lg py-5 px-6">
        <h1 className="text-3xl font-bold">المنتجات</h1>
        <Link
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          href="/dashboard/products/create"
        >
          أضف منتج
        </Link>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <li
            key={product.id}
            className="bg-white p-5 border rounded shadow-sm hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-xl text-orange-600 mb-2">{product.title}</h2>
            <p className="text-gray-700 text-sm line-clamp-2 mb-2">
              {product.description}
            </p>
            <p className="text-gray-700 text-sm mb-2">{product.price} ج.م</p>
            {product.imagePath && (
              <Image
                width={200}
                height={200}
                src={product.imagePath}
                alt={product.title}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
            )}
            <div className="flex justify-around items-center">
              <Link
                className="text-green-600 hover:underline"
                href={`/dashboard/products/edite/${product.id}`}
              >
                تعديل
              </Link>
              <button
                className="text-red-600 hover:underline"
                onClick={() => handleDelete(product.id)}
              >
                حذف
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsPage;
