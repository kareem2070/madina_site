type AuthorBioProps = {
  authorName: string;
  date: Date;
};

export default function AuthorBio({ authorName, date }: AuthorBioProps) {
  return (
    <div className="flex items-center mb-8">
      <div>
        <h4 className="text-xl font-semibold">{authorName}</h4>
        <p className="text-gray-500 text-sm">
          {new Date(date).toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
