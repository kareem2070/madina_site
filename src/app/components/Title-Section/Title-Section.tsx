export default function TitleSection({ title }: { title: string }) {
  return (
    <span className="text-right text-lg bg-primary px-4 py-3 rounded-e-full text-white font-bold">
      {title}
    </span>
  );
}
