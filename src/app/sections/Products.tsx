"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import TitleSection from "../components/Title-Section/Title-Section";
import { fetchProducts } from "../lib/actionProduct";

export default function Customer({ color }: { color: string }) {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      const productsData = await fetchProducts();
      setProducts(productsData);
    };

    getProducts();
  }, []);

  return (
    <section className={color}>
      <div className="container mx-auto py-10">
        <TitleSection title="المنتجات" />
        <div className="flex justify-center items-center flex-col md:flex-row flex-wrap mt-5">
          {products.slice(0, 10).map((product: any) => (
            <div
              key={product.id}
              className="card bg-white flex flex-col justify-center items-center text-center shadow-md p-4 rounded-lg m-4 max-w-md"
            >
              <Image
                className="w-64 h-60 object-cover rounded-lg"
                alt={product.title}
                width={600}
                height={300}
                src={product.imagePath}
              />
              <div className="card-body">
                <h3 className="text-xl font-bold text-white bg-primary px-4 py-3 rounded-full mt-2">
                  {product.title}
                </h3>
                <p className="text-gray-700 line-clamp-2 pt-3">
                  {product.description}
                </p>
                <hr className="my-4" />
                <p className="text-secondary text-lg font-bold">
                  {product.price} ريال
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
