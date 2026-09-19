// components/Breadcrumb.tsx
import Link from "next/link";

type BreadcrumbItem = {
  title: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="text-sm mb-4" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <Link href={item.href} className="text-blue-600 hover:underline">
                {item.title}
              </Link>
            ) : (
              <span className="text-gray-500">{item.title}</span>
            )}
            {index < items.length - 1 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
