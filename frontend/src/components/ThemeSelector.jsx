"use client";

import { PaletteIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="dropdown dropdown-end">
      {/* DROPDOWN TRIGGER */}
      <button
        tabIndex={0}
        className="btn btn-ghost btn-circle btn-sm sm:btn-md hover:bg-base-200"
      >
        <PaletteIcon className="size-5 sm:size-6" />
      </button>

      <div
        tabIndex={0}
        className="dropdown-content mt-2 p-2 shadow-2xl bg-base-100 backdrop-blur-lg rounded-2xl
        w-64 border border-base-300 max-h-80 overflow-y-auto custom-scrollbar z-50"
      >
        <div className="space-y-1">
          <div className="px-3 py-2 border-b border-base-300 mb-2">
            <h3 className="font-semibold text-sm">Choose Theme</h3>
            <p className="text-xs opacity-60">Customize your experience</p>
          </div>

          {THEMES.map((themeOption) => (
            <button
              key={themeOption.name}
              className={`
              w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200
              hover:bg-base-200 group
              ${
                theme === themeOption.name
                  ? "bg-primary text-primary-content shadow-lg"
                  : "hover:bg-base-200"
              }
            `}
              onClick={() => setTheme(themeOption.name)}
            >
              <div
                className={`
                p-2 rounded-lg transition-colors duration-200
                ${
                  theme === themeOption.name
                    ? "bg-primary-content/20"
                    : "bg-base-content/5 group-hover:bg-base-content/10"
                }
              `}
              >
                <PaletteIcon className="size-4" />
              </div>

              <div className="flex-1 text-left">
                <span className="text-sm font-medium">{themeOption.label}</span>
              </div>

              {/* THEME PREVIEW COLORS */}
              <div className="flex gap-1">
                {themeOption.colors.slice(0, 3).map((color, i) => (
                  <span
                    key={i}
                    className="size-3 rounded-full border border-white/20"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
