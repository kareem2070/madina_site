"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { FaPhone, FaWhatsapp } from "react-icons/fa";
import { trackPhoneClick, trackWhatsAppClick } from "@/app/utils/gtm";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Call() {
  const { data, error } = useSWR("/api/settings", fetcher);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");

  useEffect(() => {
    if (data) {
      setPhoneNumber(data.phoneNumber);
      setWhatsappNumber(data.whatsappNumber);
      setCountryCode(data.countryCode);
    }
  }, [data]);

  // معالج النقر على زر الاتصال
  const handlePhoneClick = () => {
    trackPhoneClick(phoneNumber, 'floating');
  };

  // معالج النقر على زر الواتساب
  const handleWhatsAppClick = () => {
    trackWhatsAppClick(`${countryCode}${whatsappNumber}`, 'floating');
  };

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="fixed bottom-3 left-3 z-10">
      <ul>
        <li className="text-white bg-button p-3 rounded-full mb-3">
          <a 
            target="_blank" 
            aria-label="Call" 
            href={`tel:${phoneNumber}`}
            onClick={handlePhoneClick}
          >
            <FaPhone className="text-2xl animate-pulse" />
          </a>
        </li>
        <li className="text-white bg-button p-3 rounded-full">
          <a
            target="_blank"
            aria-label="Whatsapp"
            href={`https://wa.me/${countryCode}${whatsappNumber}`}
            onClick={handleWhatsAppClick}
          >
            <FaWhatsapp className="text-2xl animate-pulse" />
          </a>
        </li>
      </ul>
    </div>
  );
}
