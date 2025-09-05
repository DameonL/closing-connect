import { h } from "preact";
import { useAuth } from "./AuthenticationProvider";

export default function LoginButton() {
  const authentication = useAuth();

  if (authentication.isAuthenticated) {
    return (
      <button
        class="button"
        disabled={authentication.isLoading}
        onClick={() => {
          if (authentication.isLoading) return;

          authentication.logout();
        }}
      >
        Log Out
      </button>
    );
  }

  return (
    <button
      class="button"
      disabled={authentication.isLoading}
      onClick={() => {
        if (authentication.isLoading) return;

        authentication.login();
      }}
    >
      Log In
    </button>
  );
}
