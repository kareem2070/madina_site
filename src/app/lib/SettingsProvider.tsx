"use client";
import React, {
  useEffect,
  useState,
  createContext,
  ReactNode,
  useContext,
} from "react";
import { fetchColorSettings, fetchSettingsData, Hero } from "./fetchColor";

interface Settings {
  id: number;
  companyName: string;
  description: string;
  whiteLogo: string | null;
  blackLogo: string | null;
  icon: string | null;
  phoneNumber: string;
  whatsappNumber: string;
  countryCode: string;
  socialLinks: { id: number; url: string; icon: string; settingsId: number }[];
}

interface SettingsContextProps {
  hero: Hero | null;
  settings: Settings | null;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);

export const SettingsProvider = ({
  children,
  initialSettings,
}: {
  children: ReactNode;
  initialSettings: SettingsContextProps;
}) => {
  const [hero, setHero] = useState<Hero | null>(initialSettings.hero);
  const [settings, setSettings] = useState<Settings | null>(
    initialSettings.settings
  );

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { heroData, settingsData } = await fetchSettingsData();
        setHero(heroData);
        setSettings(settingsData);

        const initialColors = await fetchColorSettings();
        document.documentElement.style.setProperty(
          "--primary-color",
          initialColors.primaryColor
        );
        document.documentElement.style.setProperty(
          "--secondary-color",
          initialColors.secondaryColor
        );
        document.documentElement.style.setProperty(
          "--button-color",
          initialColors.buttonColor
        );
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ hero, settings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
