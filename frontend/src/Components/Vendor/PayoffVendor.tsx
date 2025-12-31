import { h } from "preact";
import { useLocation } from "preact-iso";
import { useEffect, useState } from "preact/hooks";
import getFirstLetter from "../../getFirstLetter";
import { ApiMethod, useApi } from "../Authentication/ApiProvider";
import { useAuth } from "../Authentication/AuthenticationProvider";
import { toastMessager } from "../ToastMessages";
import { VendorNote } from "./VendorNote";
import { VendorNoteEditor } from "./VendorNoteEditor";

export default function PayoffVendorView() {
  const [details, setDetails] = useState<PayoffVendor>();
  const [loading, setLoading] = useState<boolean>(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const authentication = useAuth();
  const api = useApi();
  const location = useLocation();

  useEffect(() => {
    getDetails();
  }, []);

  async function getDetails() {
    if (loading || details) return;
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");
    if (!id) return;

    setLoading(true);
    const query = new URLSearchParams([["id", id]]);

    try {
      const vendor = await api.sendRequest<{ vendor: PayoffVendor }>({
        method: ApiMethod.get,
        route: "vendor",
        query,
      });
      setDetails(vendor?.vendor);
    } catch (error) {
      console.log(error);
      toastMessager.showToastMessage("Failed to load vendor details");
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteVendor = async () => {
    if (!details || !confirm("Are you sure you want to delete this vendor?"))
      return;

    try {
      await api.sendRequest({
        method: ApiMethod.delete,
        route: "vendor",
        query: new URLSearchParams([
          ["id", details.id ?? ""],
          ["firstLetter", details.firstLetter ?? getFirstLetter(details.name)],
        ]),
        isPrivate: true
      });

      toastMessager.showToastMessage("Vendor deleted successfully!");
      location.route("/");
    } catch (error) {
      console.error("Failed to delete vendor:", error);
      toastMessager.showToastMessage("Failed to delete vendor");
    }
  };

  const handleNoteUpdated = (updatedVendor: PayoffVendor) => {
    setDetails(updatedVendor);
  };

  return (
    <div class="boxedItem">
      {loading ? (
        <div style={{ textAlign: "center" }}>
          <div class="loader"></div>
          <p>Loading vendor details...</p>
        </div>
      ) : (details ?
        <div class="vendorDetails">
          {authentication.isAuthenticated && (
            <div
              style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}
            >
              <button
                class="button"
                onClick={() => {
                  location.route(`edit?id=${details?.id}`);
                }}
              >
                Edit Vendor
              </button>
              <button
                class="button secondaryButton"
                onClick={() => setShowAddNote(true)}
                disabled={showAddNote}
              >
                Add Note
              </button>
              <button
                class="button secondaryButton"
                onClick={handleDeleteVendor}
                style={{ backgroundColor: "var(--danger)", color: "white" }}
              >
                Delete Vendor
              </button>
            </div>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1 style={{ margin: 0 }}>{details?.name ?? ""}</h1>
            <div>
              {details.name && (
                <button
                  class="button"
                  onClick={() => {
                    navigator.clipboard.writeText(details.name);
                    toastMessager.showToastMessage("Copied to clipboard!");
                  }}
                  title="Copy name"
                >
                  📋 Copy
                </button>
              )}
            </div>
          </div>
          <div style={{ marginTop: "1.5rem" }}>
            <div class="labelWithValue">
              <span>Order Method</span>
              <span>{details.orderMethod}</span>
            </div>

            {details.phoneNumber && (
              <div class="labelWithValue">
                <span>Phone Number</span>
                <span>{details.phoneNumber}</span>
                <button
                  class="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      details.phoneNumber?.toString() ?? ""
                    );
                    toastMessager.showToastMessage("Copied phone number!");
                  }}
                  title="Copy phone number"
                >
                  📋
                </button>
              </div>
            )}

            {details.faxNumber && (
              <div class="labelWithValue">
                <span>Fax Number</span>
                <span>{details.faxNumber}</span>
                <button
                  class="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      details.faxNumber?.toString() ?? ""
                    );
                    toastMessager.showToastMessage("Copied fax number!");
                  }}
                  title="Copy fax number"
                >
                  📋
                </button>
              </div>
            )}

            {details.website && (
              <div class="labelWithValue">
                <span>Website</span>
                <a
                  href={details.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {details.website}
                </a>
                <button
                  class="button"
                  onClick={() => {
                    navigator.clipboard.writeText(details.website ?? "");
                    toastMessager.showToastMessage("Copied website!");
                  }}
                  title="Copy website"
                >
                  📋
                </button>
              </div>
            )}

            {details.email && (
              <div class="labelWithValue">
                <span>Email</span>
                <a href={`mailto:${details.email}`}>{details.email}</a>
                <button
                  class="button"
                  onClick={() => {
                    navigator.clipboard.writeText(details.email ?? "");
                    toastMessager.showToastMessage("Copied email!");
                  }}
                  title="Copy email"
                >
                  📋
                </button>
              </div>
            )}

            <div class="labelWithValue">
              <span>Turnaround</span>
              <span>{details.turnaroundTime}</span>
            </div>
            {showAddNote && (
              <VendorNoteEditor
                vendor={details}
                onSave={(vendor: PayoffVendor) => {
                  setShowAddNote(false);
                  handleNoteUpdated(vendor);
                }}
                onCancel={() => setShowAddNote(false)}
              />
            )}

            {details.notes.length > 0 && (
              <div style={{ marginTop: "2rem" }}>
                <h2
                  style={{
                    borderBottom: "2px solid var(--primary)",
                    paddingBottom: "0.5rem",
                  }}
                >
                  Notes
                </h2>
                <div>
                  {details.notes.map((note) => (
                    <VendorNote
                      vendor={details}
                      key={note.id}
                      note={note}
                      onNoteUpdated={handleNoteUpdated}
                      onNoteDeleted={handleNoteUpdated}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

        </div> :
        <div class="vendorDetails">Unable to load vendor details.</div>
      )}
    </div>
  );
}
