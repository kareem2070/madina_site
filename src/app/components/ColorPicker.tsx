import { useEffect } from "react";
import { ChromePicker, ColorResult } from "react-color";

interface AdvancedColorPickerProps {
  color: string;
  setColor: (color: string) => void;
  label: string;
  defaultColor: string;
}

const AdvancedColorPicker: React.FC<AdvancedColorPickerProps> = ({
  color,
  setColor,
  label,
  defaultColor,
}) => {
  useEffect(() => {
    document.documentElement.style.setProperty(
      `--${label.toLowerCase()}-color`,
      color
    );
  }, [color, label]);

  const handleColorChange = (colorResult: ColorResult) => {
    const rgbaColor = `rgba(${colorResult.rgb.r}, ${colorResult.rgb.g}, ${colorResult.rgb.b}, ${colorResult.rgb.a})`;
    setColor(rgbaColor);
    document.documentElement.style.setProperty(
      `--${label.toLowerCase()}-color`,
      rgbaColor
    );
  };

  const resetColor = () => {
    setColor(defaultColor);
    document.documentElement.style.setProperty(
      `--${label.toLowerCase()}-color`,
      defaultColor
    );
  };

  return (
    <div className="mb-4 max-w-ms">
      <label className="block mb-2"> الوان {label}</label>
      <ChromePicker color={color} onChangeComplete={handleColorChange} />
      <div className="mt-2">
        <div className="flex items-center">
          <div className="w-10 h-10" style={{ backgroundColor: color }}></div>
          <button
            onClick={resetColor}
            className="ml-4 bg-gray-200 text-gray-800 p-1 rounded "
          >
            إعادة التعيين
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedColorPicker;
