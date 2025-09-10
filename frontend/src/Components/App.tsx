import { Fragment, h } from "preact";
import LoginButton from "./Authentication/LoginButton";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Providers from "./Providers";
import ToastMessages from "./ToastMessages";

export default function App() {
  return (
    <>
      <Providers>
        <ToastMessages />
        <LoginButton />
        <Navbar />
      </Providers>
      <Footer />
    </>
  );
}
