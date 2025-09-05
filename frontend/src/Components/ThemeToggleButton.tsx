import { h } from "preact";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggleButton() {
  const theme = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={() => {
        theme.toggleTheme();
      }}
    >
      {theme.theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
