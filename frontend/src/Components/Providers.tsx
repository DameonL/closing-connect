import { h, VNode, Fragment } from "preact";
import { LocationProvider } from "preact-iso";
import { ApiProvider } from "./Authentication/ApiProvider";
import { AuthenticationProvider } from "./Authentication/AuthenticationProvider";
import Routes from "./Routes";
import ThemeProvider from "./Theming/ThemeProvider";

export default function Providers(props: { children: VNode[] }) {
  return (
    <AuthenticationProvider>
      <LocationProvider>
        <ApiProvider>
          <ThemeProvider>
            <>
              {...props.children}
              <Routes />
            </>
          </ThemeProvider>
        </ApiProvider>
      </LocationProvider>
    </AuthenticationProvider>
  );
}
