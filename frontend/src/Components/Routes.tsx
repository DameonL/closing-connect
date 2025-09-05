import { h } from "preact";
import { LocationProvider, Route, Router } from "preact-iso";
import LoginSuccess from "./Authentication/LoginSuccess";
import PayoffSearch from "./PayoffSearch";
import PayoffVendor from "./PayoffVendor";
import PayoffVendorEditor from "./PayoffVendorEditor";

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
