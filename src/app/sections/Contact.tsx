"use client";
import React, { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaSnapchat,
  FaTiktok,
  FaTwitter,
  FaYoutube,
  FaMap,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaClock,
  FaUser,
  FaBuilding,
  FaPaperPlane,
} from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";

import TitleSection from "../components/Title-Section/Title-Section";
import Link from "next/link";
import { fetchServices } from "../lib/action";
import { 
  trackPhoneClick, 
  trackWhatsAppClick, 
  trackEmailClick, 
  trackContactFormSubmit,
  trackSocialClick 
} from "@/app/utils/gtm";

const iconComponents = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  tiktok: FaTiktok,
  snapchat: FaSnapchat,
  twitter: FaTwitter,
  youtube: FaYoutube,
};

interface Service {
  id: number;
  title: string;
  description: string;
  content: string;
  imagePath: string | null;
  galleryImages: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function Contact() {
  const [settings, setSettings] = useState({
    phoneNumber: "",
    whatsappNumber: "",
    socialLinks: [],
    countryCode: "",
  });

  const [formStatus, setFormStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  type IconType =
    | "facebook"
    | "instagram"
    | "tiktok"
    | "snapchat"
    | "twitter"
    | "youtube";

  const [contact, setContact] = useState({
    title: "",
    description: "",
    address: "",
    email: "",
    city: "",
    countryCode: "",
  });

  const FALLBACK_MAP_URL = "https://maps.google.com/maps?q=حدائق+المدينة+المنورة&output=embed&hl=ar";
  const [mapUrl, setMapUrl] = useState(FALLBACK_MAP_URL);
  const [services, setServices] = useState<Service[]>([]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFormStatus({ type: 'loading', message: 'جاري الإرسال...' });

    const formData = {
      name: e.target.name.value,
      address: e.target.address.value,
      email: e.target.email.value,
      service: e.target.service.value,
      message: e.target.message.value,
    };

    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus({ type: 'success', message: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' });
        
        // تتبع الإحالة الناجحة لإرسال النموذج
        trackContactFormSubmit(formData);
        
        e.target.reset();
      } else {
        setFormStatus({ type: 'error', message: 'فشل في إرسال رسالتك. الرجاء المحاولة مرة أخرى.' });
      }
    } catch (error) {
      console.error("فشل في إرسال البريد الإلكتروني:", error);
      setFormStatus({ type: 'error', message: 'حدث خطأ. الرجاء المحاولة لاحقاً.' });
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        const data = await response.json();
        if (data) {
          setSettings({
            phoneNumber: data.phoneNumber,
            whatsappNumber: data.whatsappNumber,
            socialLinks: data.socialLinks,
            countryCode: "",
          });
        }
      } catch (err) {
        console.error("Failed to load settings");
      }
    };

    const loadServices = async () => {
      try {
        const services = await fetchServices();
        setServices(services);
      } catch (error) {
        console.error("Failed to load services", error);
      }
    };

    fetchSettings();
    loadServices();
  }, []);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch("/api/contact");
        const data = await response.json();
        setContact(data);
        if (data.city) {
          await updateMap(data.city);
        }
      } catch (error) {
        console.error("Failed to load contact", error);
      }
    };
    fetchContact();
  }, []);

  const updateMap = async (city: string) => {
    try {
      const response = await fetch("/api/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: city }),
      });

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setMapUrl(`https://www.google.com/maps?q=${location.lat},${location.lng}&hl=ar&output=embed`);
      }
    } catch (error) {
      console.error("Failed to fetch location data", error);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gray-100/50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              تواصل معنا
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            نحن هنا لمساعدتك في تحقيق أحلامك. تواصل معنا اليوم واحصل على استشارة مجانية
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {contact.title || "معلومات التواصل"}
              </h3>
              <p className="text-lg text-gray-600 mb-8 text-center leading-relaxed">
                {contact.description || "نحن متاحون لخدمتك في أي وقت. تواصل معنا عبر القنوات التالية:"}
              </p>

              {/* Social Media Links */}
              <div className="flex justify-center gap-4 mb-8">
                {settings.socialLinks.map(
                  (link: { icon: IconType; link: string }) => {
                    const IconComponent = iconComponents[link.icon];
                    return (
                      <Link
                        key={link.link}
                        href={link.link}
                        className="p-4 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Social Media"
                        onClick={() => trackSocialClick(link.icon, link.link)}
                      >
                        {IconComponent ? (
                          <IconComponent className="w-6 h-6" />
                        ) : null}
                      </Link>
                    );
                  }
                )}
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="p-3 bg-primary text-white rounded-full ml-4">
                    <FaMap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">العنوان</p>
                    <p className="font-semibold text-gray-900">{contact.address || "الرياض، المملكة العربية السعودية"}</p>
                  </div>
                </div>

                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-300"
                  onClick={() => trackEmailClick(contact.email, 'contact_section')}
                >
                  <div className="p-3 bg-blue-500 text-white rounded-full ml-4">
                    <FaEnvelope className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                    <p className="font-semibold text-gray-900">{contact.email || "info@example.com"}</p>
                  </div>
                </a>

                <a
                  href={`tel:${settings.phoneNumber}`}
                  className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-300"
                  onClick={() => trackPhoneClick(settings.phoneNumber, 'contact_section')}
                >
                  <div className="p-3 bg-green-500 text-white rounded-full ml-4">
                    <FaPhone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">الهاتف</p>
                    <p className="font-semibold text-gray-900">{settings.phoneNumber || "+966 55 959 9296"}</p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${settings.countryCode}${settings.whatsappNumber?.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-300"
                  onClick={() => trackWhatsAppClick(`${settings.countryCode}${settings.whatsappNumber}`, 'contact_section')}
                >
                  <div className="p-3 bg-green-600 text-white rounded-full ml-4">
                    <FaWhatsapp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">واتساب</p>
                    <p className="font-semibold text-gray-900">{settings.whatsappNumber || "+966 55 959 9296"}</p>
                  </div>
                </a>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">أرسل لنا رسالة</h3>
              <p className="text-gray-600">سنرد عليك في أقرب وقت ممكن</p>
            </div>

            {/* Form Status */}
            {formStatus.type !== 'idle' && (
              <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                formStatus.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : formStatus.type === 'error'
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}>
                {formStatus.type === 'success' && <FaCheckCircle className="w-5 h-5" />}
                {formStatus.type === 'loading' && (
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                )}
                {formStatus.type === 'error' && <FaPaperPlane className="w-5 h-5" />}
                <span className="font-medium">{formStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                    <FaUser className="inline w-4 h-4 ml-2" />
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    placeholder="أدخل اسمك الكامل"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                    <FaEnvelope className="inline w-4 h-4 ml-2" />
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-700">
                    <FaMap className="inline w-4 h-4 ml-2" />
                    العنوان
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    placeholder="أدخل عنوانك"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="service" className="block text-sm font-semibold text-gray-700">
                    <FaBuilding className="inline w-4 h-4 ml-2" />
                    نوع الخدمة
                  </label>
                  <select
                    id="service"
                    name="service"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    required
                  >
                    <option value="">اختر الخدمة المطلوبة</option>
                    {services.map((service: any) => (
                      <option key={service.id} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700">
                  <FaPaperPlane className="inline w-4 h-4 ml-2" />
                  تفاصيل الرسالة
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="اكتب رسالتك هنا..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formStatus.type === 'loading'}
                className="w-full bg-primary text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {formStatus.type === 'loading' ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري الإرسال...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <FaPaperPlane className="w-5 h-5" />
                    إرسال الرسالة
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">موقعنا على الخريطة</h3>
            <p className="text-lg text-gray-600">اكتشف موقعنا وخطط لزيارتك</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {mapUrl ? (
              <iframe
                src={mapUrl}
                width="100%"
                height="450"
                title="موقعنا على الخريطة"
                allowFullScreen
                loading="lazy"
                className="w-full"
              ></iframe>
            ) : (
              <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <FaMap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">الخريطة غير متاحة حالياً</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}