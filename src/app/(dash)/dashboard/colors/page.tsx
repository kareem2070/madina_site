"use client";
import { useState, useEffect } from "react";
import AdvancedColorPicker from "@/app/components/ColorPicker";

interface ColorSettings {
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
}

const defaultSettings: ColorSettings = {
  primaryColor: "#ffffff",
  secondaryColor: "#ffffff",
  buttonColor: "#ffffff",
};

const fetchColorSettings = async (): Promise<ColorSettings> => {
  const res = await fetch("/api/colors");
  const data = await res.json();
  return data || defaultSettings;
};

const Dashboard: React.FC = () => {
  const [primaryColor, setPrimaryColor] = useState<string>(
    defaultSettings.primaryColor
  );
  const [secondaryColor, setSecondaryColor] = useState<string>(
    defaultSettings.secondaryColor
  );
  const [buttonColor, setButtonColor] = useState<string>(
    defaultSettings.buttonColor
  );

  useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = JSON.parse(
        localStorage.getItem("colorSettings") || "{}"
      );
      if (Object.keys(savedSettings).length) {
        setPrimaryColor(savedSettings.primaryColor);
        setSecondaryColor(savedSettings.secondaryColor);
        setButtonColor(savedSettings.buttonColor);
        document.documentElement.style.setProperty(
          "--primary-color",
          savedSettings.primaryColor
        );
        document.documentElement.style.setProperty(
          "--secondary-color",
          savedSettings.secondaryColor
        );
        document.documentElement.style.setProperty(
          "--button-color",
          savedSettings.buttonColor
        );
      } else {
        const initialSettings = await fetchColorSettings();
        setPrimaryColor(initialSettings.primaryColor);
        setSecondaryColor(initialSettings.secondaryColor);
        setButtonColor(initialSettings.buttonColor);
        document.documentElement.style.setProperty(
          "--primary-color",
          initialSettings.primaryColor
        );
        document.documentElement.style.setProperty(
          "--secondary-color",
          initialSettings.secondaryColor
        );
        document.documentElement.style.setProperty(
          "--button-color",
          initialSettings.buttonColor
        );
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async () => {
    if (!primaryColor || !secondaryColor || !buttonColor) {
      console.error("All fields are required");
      return;
    }

    localStorage.setItem(
      "colorSettings",
      JSON.stringify({ primaryColor, secondaryColor, buttonColor })
    );

    const res = await fetch("/api/colors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ primaryColor, secondaryColor, buttonColor }),
    });
    const data = await res.json();
    if (res.ok) {
      console.log("Settings saved successfully", data);
    } else {
      console.error("Error saving settings", data.error);
    }
  };

  return (
    <div className="w-full mx-auto py-10 text-center bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-200 bg-blue-900 rounded-lg py-5 mx-6">
        تعديل ألوان الموقع
      </h1>
      <div className="mt-8 max-w-4xl mx-auto bg-white p-8 shadow-sm shadow-blue-500 rounded-md">
        <div className="flex justify-center items-center gap-10 flex-col md:flex-row">
          <AdvancedColorPicker
            color={primaryColor}
            setColor={setPrimaryColor}
            label="الرئيسي"
            defaultColor={defaultSettings.primaryColor}
          />
          <AdvancedColorPicker
            color={secondaryColor}
            setColor={setSecondaryColor}
            label="الثانوي"
            defaultColor={defaultSettings.secondaryColor}
          />
          <AdvancedColorPicker
            color={buttonColor}
            setColor={setButtonColor}
            label="زر"
            defaultColor={defaultSettings.buttonColor}
          />
        </div>
        <button
          onClick={saveSettings}
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
        >
          حفظ التغير
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
