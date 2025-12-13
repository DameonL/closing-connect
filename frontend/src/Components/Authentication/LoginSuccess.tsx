import { h } from "preact";
import { useLocation } from "preact-iso";
import { useEffect } from "preact/hooks";

export default function LoginSuccess() {
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      location.route(window.location.origin);
    }, 10000);
  }, []);

  return <div>Login successful! You'll be redirected in 10 seconds, or you can <a href="#" onClick={() => location.route(window.location.origin)}>click here.</a></div>
}