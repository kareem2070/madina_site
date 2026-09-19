"use client";
import { useState, useEffect } from "react";
import {
  FaInstagram,
  FaTiktok,
  FaSnapchat,
  FaYoutube,
  FaTwitter,
  FaPhone,
  FaWhatsapp,
} from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";

const Icon = () => {
  type IconType =
    | "facebook"
    | "instagram"
    | "tiktok"
    | "snapchat"
    | "twitter"
    | "youtube";

  const iconComponents = {
    facebook: FaFacebookF,
    instagram: FaInstagram,
    tiktok: FaTiktok,
    snapchat: FaSnapchat,
    twitter: FaTwitter,
    youtube: FaYoutube,
  };

  interface Settings {
    companyName: string;
    description: string;
    phoneNumber: string;
    whatsappNumber: string;
    socialLinks: { icon: IconType; link: string }[];
    blackLogo: string;
  }

  const [settings, setSettings] = useState<Settings>({
    companyName: "",
    description: "",
    phoneNumber: "",
    whatsappNumber: "",
    socialLinks: [],
    blackLogo: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        const data = await response.json();
        console.log("Fetched settings:", data); // إضافة سجل لتأكيد البيانات
        setSettings(data);
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="fixed bottom-32 left-3 z-30">
      <ul>
        {Array.isArray(settings.socialLinks) &&
          settings.socialLinks.map((link: { icon: IconType; link: string }) => {
            const IconComponent = iconComponents[link.icon];
            const linkAltText = `Link to ${link.icon}`; // النص البديل للرابط
            return (
              <li
                key={link.icon}
                className="p-3 bg-button rounded-full mb-2 list-none"
              >
                <a href={link.link} target="_blank" aria-label={linkAltText}>
                  {IconComponent ? (
                    <IconComponent
                      name={link.icon}
                      className="w-6 h-6 animate-pulse fill-white"
                    />
                  ) : null}
                </a>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Icon;
