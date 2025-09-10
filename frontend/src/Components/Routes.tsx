import { h } from "preact";
import { Route, Router } from "preact-iso";
import LoginSuccess from "./Authentication/LoginSuccess";
import PayoffSearch from "./Search/PayoffSearch";
import PayoffVendor from "./Vendor/PayoffVendor";
import PayoffVendorEditor from "./Vendor/PayoffVendorEditor";

export default function Routes() {
  return (
    <Router>
      <Route path="/" component={PayoffSearch} />
      <Route path="/vendor" component={PayoffVendor} />
      <Route path="/new" component={PayoffVendorEditor} />
      <Route path="/edit" component={PayoffVendorEditor} />
      <Route path="/LoginSuccess" component={LoginSuccess} />
    </Router>
  );
}
