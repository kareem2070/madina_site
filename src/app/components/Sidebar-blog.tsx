// components/Sidebar-blog.tsx
import Link from "next/link";
import Image from "next/image";

type Post = {
  slug: string;
  title: string;
  coverImage?: string;
  createdAt: Date;
};

type Service = {
  id: number;
  title: string;
  slug: string;
  imagePath?: string;
};

export default function Sidebar({
  currentPostTags,
  relatedPosts,
  services,
}: {
  currentPostTags: string[]; // العلامات الخاصة بالمقال الحالي
  relatedPosts: Post[];
  services: Service[];
}) {
  return (
    <aside className="bg-gray-100 p-6 border border-gray-600 rounded-lg shadow-md">
      {/* قسم علامات المقال الحالي */}
      {currentPostTags && currentPostTags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4 text-primary">العلامات</h3>
          <div className="flex flex-wrap">
            {currentPostTags.map((tag) => (
              <strong
                key={tag}
                className="inline-block bg-primary text-white text-xs px-2 py-1 rounded-full mr-2 mb-2"
              >
                {tag}
              </strong>
            ))}
          </div>
        </div>
      )}

      {/* قسم المقالات ذات الصلة */}
      <h3 className="text-2xl font-bold mb-6 text-primary">مقالات ذات صلة</h3>
      <ul className="space-y-4">
        {relatedPosts.map((post) => (
          <li key={post.slug} className="flex items-start">
            {post.coverImage && (
              <Image
                src={post.coverImage}
                alt={post.title}
                width={60}
                height={60}
                className="rounded-lg mr-4"
              />
            )}
            <div className="mr-4">
              <Link
                href={`/blog/${post.slug}`}
                className="text-lg font-semibold text-gray-800 hover:text-primary transition-colors duration-200"
              >
                {post.title}
              </Link>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* قسم الخدمات */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4 text-primary">خدماتنا</h3>
        <ul className="space-y-4">
          {services.map((service) => (
            <li key={service.id} className="flex items-center">
              {service.imagePath && (
                <Image
                  src={service.imagePath}
                  alt={service.title}
                  width={60}
                  height={60}
                  className="rounded ml-4 fit-cover"
                />
              )}
              <Link
                href={`/services/${service.slug}`}
                className="text-lg underline font-semibold text-gray-800 hover:text-primary transition-colors duration-200"
              >
                {service.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
