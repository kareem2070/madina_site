"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { SlPhone } from "react-icons/sl";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useSettings } from "@/app/lib/SettingsProvider";

const Navbar = () => {
  const { settings } = useSettings();
  const [nav, setNav] = useState(false);
  const currentPath = usePathname();
  const [background, setBackground] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 80) {
        setBackground(true);
      } else {
        setBackground(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // إغلاق القائمة عند تغيير المسار
  useEffect(() => {
    setNav(false);
  }, [currentPath]);

  // منع التمرير عندما تكون القائمة مفتوحة
  useEffect(() => {
    if (nav) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [nav]);

  const links = [
    { id: 1, name: "الرئيسية", link: "/" },
    { id: 2, name: "من نحن", link: "/about" },
    { id: 3, name: "منتجاتنا", link: "/products" },
    { id: 4, name: "الخدمات", link: "/services" },
    { id: 5, name: "مشاريعنا", link: "/projects" },
    { id: 6, name: "المدونة", link: "/blog" },
    { id: 7, name: "تواصل معنا", link: "/contact" },
  ];

  return (
    <header
      className={`${
        background
          ? "bg-white px-4 shadow-lg fixed top-0 w-full z-50 duration-500"
          : "w-full px-4 text-gray-200 bg-black/75 fixed top-0 z-50 duration-500"
      }`}
      dir="rtl"
    >
      <div className="container mx-auto h-20 flex justify-between items-center">
        {/* Logo */}
        <div>
          <Link href="/" className="block">
            {settings && (
              <Image
                src={
                  background
                    ? settings.blackLogo ?? "/defaultBlackLogo.jpg"
                    : settings.whiteLogo ?? "/defaultWhiteLogo.jpg"
                }
                alt="logo"
                width={200}
                height={100}
                priority
                className="h-12 w-auto object-contain"
              />
            )}
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex">
          {links.map((link) => (
            <li
              key={link.id}
              className={`${
                background
                  ? "text-gray-900 px-4 text-lg hover:scale-105 hover:text-primary duration-300"
                  : "px-4 text-white text-lg hover:scale-105 hover:text-white duration-300"
              }`}
            >
              <Link
                className={`${
                  currentPath === link.link
                    ? "border-b-2 border-primary pb-2 scale-105"
                    : ""
                } relative group`}
                href={link.link}
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full duration-300" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Phone Number */}
        <div className="hidden md:flex phone items-center gap-4">
          <SlPhone className="text-primary" size={30} />
          <span className="text-3xl text-gray-300">|</span>
          <div className="contact text-center">
            <p className="text-sm text-primary font-medium">تواصل معنا</p>
            <Link
              href={`tel:${settings?.phoneNumber}`}
              className="hover:text-primary transition-colors duration-300"
            >
              {settings?.phoneNumber}
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setNav(!nav)}
          className={`${
            background ? "text-primary" : "text-gray-200"
          } md:hidden z-50 p-2 hover:bg-gray-100/10 rounded-lg transition-colors duration-300`}
          aria-label="Toggle Menu"
        >
          {nav ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Mobile Menu */}
        <div
          className={`${
            nav ? "translate-x-0" : "translate-x-full"
          } fixed top-0 right-0 w-[280px] h-screen bg-white shadow-2xl md:hidden z-40 transition-transform duration-300 ease-in-out`}
        >
          <div className="h-full flex flex-col">
            <div className="p-6 border-b">
              {settings && (
                <Image
                  src={settings.blackLogo ?? "/defaultBlackLogo.jpg"}
                  alt="logo"
                  width={150}
                  height={75}
                  className="h-10 w-auto object-contain"
                />
              )}
            </div>

            <ul className="flex-1 py-4">
              {links.map((link) => (
                <li
                  key={link.id}
                  className="border-b border-gray-100 last:border-none"
                >
                  <Link
                    href={link.link}
                    onClick={() => setNav(false)}
                    className={`block px-6 py-4 text-gray-800 hover:bg-gray-50 hover:text-primary transition-colors duration-300 ${
                      currentPath === link.link
                        ? "text-primary font-medium bg-gray-50"
                        : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="p-6 border-t bg-gray-50">
              <Link
                href={`tel:${settings?.phoneNumber}`}
                className="flex items-center gap-3 text-gray-800 hover:text-primary transition-colors duration-300"
              >
                <SlPhone size={20} />
                <span className="font-medium">{settings?.phoneNumber}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Overlay */}
        {nav && (
          <div
            onClick={() => setNav(false)}
            className="fixed inset-0 bg-black/50 md:hidden z-30 transition-opacity duration-300"
          />
        )}
      </div>
    </header>
  );
};

export default Navbar;
