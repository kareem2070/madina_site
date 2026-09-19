// components/SocialShareButtons.tsx
import { FaFacebookF, FaTwitter, FaWhatsapp } from "react-icons/fa";

type SocialShareButtonsProps = {
  url: string;
};

export default function SocialShareButtons({ url }: SocialShareButtonsProps) {
  return (
    <div className="flex justify-center align-center gap-5 mb-8">
      <a
        className="p-2 bg-primary rounded-full"
        href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
        target="_blank"
      >
        <FaFacebookF className="text-white  w-6 h-6" />
      </a>
      <a
        className="p-2 bg-primary rounded-full"
        href={`https://twitter.com/intent/tweet?url=${url}`}
        target="_blank"
      >
        <FaTwitter className="text-white w-6 h-6" />
      </a>

      <a
        className="p-2 bg-primary rounded-full"
        href={`https://api.whatsapp.com/send?text=${url}`}
        target="_blank"
      >
        <FaWhatsapp className="text-white  w-6 h-6" />
      </a>
    </div>
  );
}
