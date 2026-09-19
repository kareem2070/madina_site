"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { fetchServices, updateServiceOrder } from "@/app/lib/action"; // لا تقم باستيراد deleteService هنا
import { FaEdit, FaTrashAlt, FaArrowsAltV } from "react-icons/fa";

interface Service {
  id: number;
  title: string;
  description: string;
  imagePath?: string;
}

const SortableItem = ({ service, handleDelete }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: service.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes} // احتفظ بالـ attributes هنا
      className="bg-white p-5 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      <h2 className="text-xl text-blue-600 mb-2">{service.title}</h2>
      <p className="text-gray-700 text-sm line-clamp-2 mb-4">
        {service.description}
      </p>
      {service.imagePath && (
        <Image
          width={200}
          height={200}
          src={service.imagePath}
          alt={service.title}
          className="w-full h-40 object-cover rounded-md mb-4"
        />
      )}
      <div className="flex justify-around items-center mt-4">
        {/* قم بتطبيق listeners على عنصر المقبض فقط */}
        <div {...listeners} className="flex items-center cursor-grab">
          <FaArrowsAltV className="w-4 h-4 mr-1 text-gray-500" />
        </div>
        <Link
          href={`/dashboard/services/edit/${service.id}`}
          className="flex items-center text-green-600 hover:text-green-800"
        >
          <FaEdit className="w-4 h-4 mr-1" />
          <span>تعديل</span>
        </Link>
        <button
          onClick={() => handleDelete(service.id)}
          className="flex items-center text-red-600 hover:text-red-800"
        >
          <FaTrashAlt className="w-4 h-4 mr-1" />
          <span>حذف</span>
        </button>
      </div>
    </li>
  );
};

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const servicesPerPage = 12; // عرض 12 عنصر في كل صفحة

  useEffect(() => {
    const getServices = async () => {
      try {
        const response = await fetchServices();
        setServices(response as Service[]);
        setTotalPages(Math.ceil(response.length / servicesPerPage));
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    getServices();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      console.log("Attempting to delete service with ID:", id);

      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const result = await response.json();
        console.error("Error response:", result);
        throw new Error(result.error || "Failed to delete service");
      }

      console.log("Service deleted successfully");

      setServices(services.filter((service) => service.id !== id));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setServices((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const updatedServices = arrayMove(items, oldIndex, newIndex);

        // تحديث الترتيب في قاعدة البيانات
        updatedServices.forEach(async (service, index) => {
          await updateServiceOrder(service.id, index + 1);
        });

        return updatedServices;
      });
    }
  };

  const handlePageChange = (page = 1) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * servicesPerPage;
  const paginatedServices = services.slice(
    startIndex,
    startIndex + servicesPerPage
  );

  const sensors = useSensors(useSensor(PointerSensor));
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full mx-auto py-10 px-4 text-center bg-gray-100">
        <div className="flex justify-between items-center mb-8 bg-blue-900 text-white rounded-lg py-5 px-6 shadow-lg">
          <h1 className="text-3xl font-bold">الخدمات</h1>
          <Link
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            href="/dashboard/services/create"
          >
            أضف خدمة
          </Link>
        </div>

        <SortableContext
          items={paginatedServices}
          strategy={verticalListSortingStrategy}
        >
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {paginatedServices.map((service) => (
              <SortableItem
                key={service.id}
                service={service}
                handleDelete={handleDelete}
              />
            ))}
          </ul>
        </SortableContext>

        <div className="flex justify-center mt-8">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`mx-1 px-3 py-1 border rounded ${
                currentPage === index + 1
                  ? "bg-orange-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </DndContext>
  );
};

export default ServicesPage;
