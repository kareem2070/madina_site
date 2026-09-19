export type Settings = {
    companyName: string;
    phoneNumber: string;
    description: string;
    icon: string;
  };
  
  export type Hero = {
    title: string;
  };
  
  export const fetchColorSettings = async () => {
    const res = await fetch("/api/colors");
    const data = await res.json();
    return (
      data || {
        primaryColor: "#ffffff",
        secondaryColor: "#ffffff",
        buttonColor: "#ffffff",
      }
    );
  };
  
  export const fetchSettingsData = async () => {
    const [heroResponse, settingsResponse] = await Promise.all([
      fetch("/api/hero"),
      fetch("/api/settings"),
    ]);
    const heroData = await heroResponse.json();
    const settingsData = await settingsResponse.json();
    return { heroData, settingsData };
  };
  