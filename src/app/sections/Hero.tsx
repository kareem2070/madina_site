import Image from "next/image";
import Button from "../components/Button/button";

interface HeroProps {
  hero: {
    title: string;
    description: string;
    imagePath: string;
  } | null;
}

const HeroSection = ({ hero }: HeroProps) => {
  if (!hero) {
    return <div>Hero data not found</div>;
  }

  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center z-0">
      <div className="bg-hero">
        <Image
          className="absolute w-full h-full right-0 top-0 object-cover brightness-50"
          src={hero.imagePath}
          height={1000}
          width={1000}
          alt={hero.title}
          loading="lazy"
        />
      </div>
      <h1 className="font-bold text-center text-3xl border-b-2 border-secondary pb-3 md:text-4xl text-white w-fit z-10">
        {hero.title}
      </h1>
      <p className="text-xl text-gray-100 bg-black/50 p-4 rounded-lg mt-4 text-center w-full md:w-1/2 z-10 mb-10">
        {hero.description}
      </p>
      <Button />
    </div>
  );
};

export default HeroSection;
