import { h } from "preact";
import ThemeToggleButton from "./ThemeToggleButton";

export default function Navbar() {
  return (
    <div style={{ display: "flex" }}>
      <a href="/" class="title">
        <img style={{ width: "30%" }} src="/img/nav_banner.png" />
      </a>
      <ThemeToggleButton />
    </div>
  );
}
