import { h } from "preact";
import { useState } from "preact/hooks";
import { ApiMethod, ApiRoute, useApi } from "../Authentication/ApiProvider";
import { useAuth } from "../Authentication/AuthenticationProvider";
import { toastMessager } from "../ToastMessages";
import { VendorNoteEditor } from "./VendorNoteEditor";

interface VendorNoteProps {
  note: PayoffVendorNote;
  onNoteUpdated?: (updatedVendor: PayoffVendor) => void;
  onNoteDeleted?: (updatedVendor: PayoffVendor) => void;
  vendor: PayoffVendor;
}

export function VendorNote({
  note,
  onNoteUpdated,
  onNoteDeleted,
  vendor,
}: VendorNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const auth = useAuth();
  const api = useApi();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    setIsDeleting(true);
    try {
      const updatedVendor = { ...vendor };
      updatedVendor.notes = updatedVendor.notes.filter((n) => n.id !== note.id);

      await api.sendRequest({
        method: ApiMethod.post,
        route: ApiRoute.Vendor,
        body: { vendor: updatedVendor },
      });

      await api.invalidateCache({
        method: ApiMethod.get,
        route: ApiRoute.OpenVendor,
        query: new URLSearchParams([["id", vendor.id ?? ""]]),
      });

      toastMessager.showToastMessage("Note deleted successfully!");
      onNoteDeleted?.(updatedVendor);
    } catch (error) {
      console.error("Failed to delete note:", error);
      toastMessager.showToastMessage("Failed to delete note");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <VendorNoteEditor
        vendor={vendor}
        note={note}
        onSave={(updatedVendor) => {
          setIsEditing(false);
          onNoteUpdated?.(updatedVendor);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div
      class="vendorNote"
      style={{
        margin: "1rem 0",
        padding: "1rem",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
        }}
      >
        <span style={{ fontWeight: "bold" }}>
          {note.user?.displayName || "Unknown"}
        </span>
        <span style={{ color: "var(--dark)", opacity: 0.7 }}>
          {new Date(note.date).toLocaleDateString()}
        </span>
      </div>
      <p style={{ margin: 0 }}>{note.note}</p>
      {auth.isAuthenticated && (
        <div
          style={{
            marginTop: "0.5rem",
            textAlign: "right",
            display: "flex",
            gap: "0.5rem",
            justifyContent: "flex-end",
          }}
        >
          <button
            class="button"
            style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
            onClick={() => setIsEditing(true)}
            disabled={isDeleting}
          >
            Edit
          </button>
          <button
            class="button secondaryButton"
            style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}
