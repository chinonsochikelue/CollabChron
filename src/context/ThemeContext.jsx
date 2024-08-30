"use client";

import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

const getFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem("theme");
    return value || "light";
  }
  return "light"; // Fallback default value during server-side rendering
};

export const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(getFromLocalStorage);

  const toggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};
