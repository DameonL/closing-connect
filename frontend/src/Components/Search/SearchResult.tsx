import { h } from "preact";
import { useLocation } from "preact-iso";

export default function SearchResult(props: {
  vendor: { name: string; id: string };
}) {
  const location = useLocation();

  return (
    <div
      class="vendorName"
      onClick={() => {
        location.route(`vendor?id=${props.vendor.id}`);
      }}
    >
      {props.vendor.name}
    </div>
  );
}
