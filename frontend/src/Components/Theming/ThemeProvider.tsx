import { createContext, h, VNode } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";

type Theme = "light" | "dark";
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

let theme: ThemeContextType = {
  theme: "dark",
  toggleTheme: () => {
    setTheme({
      theme: theme.theme === "dark" ? "light" : "dark",
      toggleTheme: theme.toggleTheme,
    });
  },
};

let setTheme = (value: ThemeContextType) => {
  theme = value;
};

const ThemeContext = createContext<ThemeContextType>(theme);

export default function ThemeProvider(props: { children: VNode[] | VNode }) {
  [theme, setTheme] = useState<ThemeContextType>({
    theme: "dark",
    toggleTheme: () =>
      setTheme({
        theme: theme.theme === "dark" ? "light" : "dark",
        toggleTheme: theme.toggleTheme,
      }),
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme) {
      setTheme({ theme: savedTheme as Theme, toggleTheme: theme.toggleTheme });
    } else if (systemPrefersDark) {
      setTheme({ theme: "dark", toggleTheme: theme.toggleTheme });
    }
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme.theme);
    localStorage.setItem("theme", theme.theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ ...theme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext };

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
