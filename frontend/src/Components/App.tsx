import { h } from "preact";
import LoginButton from "./Authentication/LoginButton";
import Navbar from "./Navbar";
import Providers from "./Providers";
import ToastMessages from "./ToastMessages";

export default function App() {
  return (
    <Providers>
      <ToastMessages />
      <LoginButton />
      <Navbar />
    </Providers>
  );
}
