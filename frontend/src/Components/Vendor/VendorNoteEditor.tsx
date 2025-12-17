import { h } from "preact";
import { useState } from "preact/hooks";
import { useApi, ApiMethod, ApiRoute } from "../Authentication/ApiProvider";
import { useAuth } from "../Authentication/AuthenticationProvider";
import { toastMessager } from "../ToastMessages";

interface VendorNoteEditorProps {
  vendor: PayoffVendor;
  note?: PayoffVendorNote;
  onSave: (vendor: PayoffVendor) => void;
  onCancel: () => void;
}

export function VendorNoteEditor({
  vendor,
  note,
  onSave,
  onCancel,
}: VendorNoteEditorProps) {
  const [content, setContent] = useState(note?.note || "");
  const [isSaving, setIsSaving] = useState(false);
  const api = useApi();
  const authentication = useAuth();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      const updatedVendor = { ...vendor };

      if (note) {
        const noteIndex = updatedVendor.notes.findIndex(
          (n) => n.id === note.id
        );
        if (noteIndex >= 0) {
          updatedVendor.notes[noteIndex] = { ...note, note: content };
        }
      } else {
        updatedVendor.notes.push({
          id: crypto.randomUUID(),
          user: {
            id: authentication.account?.localAccountId ?? "Unknown",
            displayName: authentication.account?.name ?? "Unknown",
          },
          date: new Date(),
          note: content,
        });
      }

      await api.sendRequest({
        method: ApiMethod.post,
        route: "vendor",
        body: { vendor: updatedVendor },
        isPrivate: true
      });

      toastMessager.showToastMessage("Note saved successfully!");
      onSave(updatedVendor);
    } catch (error) {
      console.error("Failed to save note:", error);
      toastMessager.showToastMessage("Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      class="vendorNote"
      style={{
        margin: "1rem 0",
        padding: "1rem",
        border: "1px solid var(--primary-light)",
        borderRadius: "var(--border-radius)",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div class="formField">
          <textarea
            class="formInput"
            value={content}
            onInput={(e) => setContent((e.target as HTMLTextAreaElement).value)}
            placeholder="Enter your note here..."
            required
          />
        </div>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
          <button type="submit" class="button" disabled={isSaving}>
            {isSaving ? (
              <span class="buttonLoader"></span>
            ) : note ? (
              "Update Note"
            ) : (
              "Add Note"
            )}
          </button>
          <button
            type="button"
            class="button secondaryButton"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
