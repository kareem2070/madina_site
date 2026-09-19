"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
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

import OptimizedImage from "@/app/components/OptimizedImage";
import Image from "next/image";
import { fetchServices } from "@/app/lib/action"; // تأكد من مسار الاستيرد الصحيح

const Footer = () => {
  const [services, setServices] = useState<
    {
      id: number;
      title: string;
    }[]
  >([]);

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
    countryCode: string;
  }

  interface ContactInfo {
    title: string;
    description: string;
    address: string;
    email: string;
    city: string;
  }

  const [settings, setSettings] = useState<Settings>({
    companyName: "",
    description: "",
    phoneNumber: "",
    whatsappNumber: "",
    socialLinks: [],
    blackLogo: "",
    countryCode: "",
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    title: "",
    description: "",
    address: "",
    email: "",
    city: "",
  });

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        const servicesData = await fetchServices();
        setServices(servicesData);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };

    fetchServicesData();
  }, []);

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

    const fetchContactInfo = async () => {
      try {
        const response = await fetch("/api/contact");
        const data = await response.json();
        console.log("Fetched contact info:", data);
        setContactInfo(data);
      } catch (err) {
        console.error("Failed to load contact info:", err);
      }
    };

    fetchSettings();
    fetchContactInfo();
  }, []);

  return (
    <footer className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                {settings.blackLogo && (
                  <OptimizedImage
                    src={settings.blackLogo}
                    alt="Logo"
                    width={200}
                    height={80}
                    className="w-48 h-16 object-contain mb-6"
                    quality={90}
                    priority={false}
                  />
                )}
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {settings.companyName || "زهرة الربيع"}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {settings.description || "نحن شركة رائدة في تقديم الدمات والمنتجات امتميزة"}
                </p>
              </div>
              
              {/* Social Media */}
              <div className="flex gap-4">
                {Array.isArray(settings.socialLinks) &&
                  settings.socialLinks.map(
                    (link: { icon: IconType; link: string }) => {
                      const IconComponent = iconComponents[link.icon];
                      return (
                        <Link
                          key={link.link}
                          href={link.link}
                          className="p-3 bg-gray-200 backdrop-blur-sm rounded-full text-gray-700 hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Social Media"
                        >
                          {IconComponent ? (
                            <IconComponent className="w-5 h-5" />
                          ) : null}
                        </Link>
                      );
                    }
                  )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-6">روابط سريعة</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-primary transition-colors duration-300 flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full ml-3"></span>
                    الرئيسية
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-primary transition-colors duration-300 flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full ml-3"></span>
                    من نحن
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-600 hover:text-primary transition-colors duration-300 flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full ml-3"></span>
                    خدماتنا
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="text-gray-600 hover:text-primary transition-colors duration-300 flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full ml-3"></span>
                    مشاريعنا
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-600 hover:text-primary transition-colors duration-300 flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full ml-3"></span>
                    المدونة
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors duration-300 flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full ml-3"></span>
                    تواصل معنا
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-6">خدماتنا</h4>
              <ul className="space-y-3">
                {services.slice(0, 6).map((service) => (
                  <li key={service.id}>
                    <Link 
                      href={`/services/${service.title.replace(/ /g, "-")}`}
                      className="text-gray-600 hover:text-primary transition-colors duration-300 flex items-center"
                    >
                      <span className="w-2 h-2 bg-primary rounded-full ml-3"></span>
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-6">تواصل معنا</h4>
              <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-center">
                  <div className="p-3 bg-primary/20 rounded-full ml-4">
                    <FaPhone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">الهاتف</p>
                    <a 
                      href={`tel:${settings.phoneNumber}`}
                      className="text-gray-800 hover:text-primary transition-colors duration-300 font-medium"
                    >
                      {settings.phoneNumber}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-center">
                  <div className="p-3 bg-green-500/20 rounded-full ml-4">
                    <FaWhatsapp className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">واتساب</p>
                    <a 
                      href={`https://wa.me/${settings.countryCode}${settings.whatsappNumber?.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:text-green-500 transition-colors duration-300 font-medium"
                    >
                      {settings.whatsappNumber || 'ير محدد'}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center">
                  <div className="p-3 bg-blue-500/20 rounded-full ml-4">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">البريد اللكتروني</p>
                    <a 
                      href={`mailto:${contactInfo.email || 'info@example.com'}`}
                      className="text-gray-800 hover:text-blue-500 transition-colors duration-300 font-medium"
                    >
                      {contactInfo.email || 'info@example.com'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 text-sm">
              © {new Date().getFullYear()} {settings.companyName || "زهرة الربيع"}. جميع الحقوق محفوظة.
            </div>
            
            {/* مصمم الموقع */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-sm">تصميم وتطوير:</span>
              <a 
                href="https://wa.me/201144471575"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-300"
              >
                <Image 
                  src="/fox.webp" 
                  alt="مصمم الموقع" 
                  width={100}
                  height={32}
                  className="object-contain"
                />
              </a>
            </div>
            
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
