// VendorForm.tsx
import { h } from "preact";
import { useLocation } from "preact-iso";
import { useState, useEffect } from "preact/hooks";
import { v4 } from "uuid";
import { useApi, ApiMethod, ApiRoute, ApiRequest } from "../Authentication/ApiProvider";
import { useAuth } from "../Authentication/AuthenticationProvider";
import { toastMessager } from "../ToastMessages";

export default function VendorForm() {
  const [vendor, setVendor] = useState<PayoffVendor>();
  const [formData, setFormData] = useState<PayoffVendor>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const authentication = useAuth();
  const api = useApi();
  const location = useLocation();

  useEffect(() => {
    getDetails();
  }, []);

  async function getDetails() {
    if (loading || vendor) return;
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");

    let loadedVendor: PayoffVendor | undefined;
    if (id) {
      setLoading(true);
      const query = new URLSearchParams([["id", id]]);

      try {
        loadedVendor = (
          await api.sendRequest<{ vendor: PayoffVendor }>({
            method: ApiMethod.get,
            route: ApiRoute.OpenVendor,
            query,
          })
        )?.vendor;
      } catch (error) {
        console.log(error);
        toastMessager.showToastMessage("Failed to load vendor details");
      } finally {
        setLoading(false);
      }
    }

    setVendor(loadedVendor);
    setFormData({
      id: loadedVendor?.id ?? v4(),
      name: loadedVendor?.name ?? "New Vendor",
      type: loadedVendor?.type ?? "",
      orderMethod: loadedVendor?.orderMethod ?? "Phone",
      phoneNumber: loadedVendor?.phoneNumber,
      faxNumber: loadedVendor?.faxNumber,
      website: loadedVendor?.website,
      email: loadedVendor?.email,
      turnaroundTime: loadedVendor?.turnaroundTime,
      notes: loadedVendor?.notes ?? [],
      firstLetter: loadedVendor?.firstLetter ?? "n",
    });
  }

  const handleChange = (
    e: h.JSX.TargetedEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : undefined));
  };

  const handleSubmit = async (e: h.JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;
    if (!authentication.isAuthenticated) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        notes: formData.notes,
      };
      const request: ApiRequest = {
        method: ApiMethod.post,
        route: ApiRoute.Vendor,
        body: { vendor: payload },
      };

      if (formData) {
        await api.sendRequest(request);
        toastMessager.showToastMessage("Vendor updated successfully!");
      }

      await api.invalidateCache({
        method: ApiMethod.get,
        route: ApiRoute.OpenVendor,
        query: new URLSearchParams([["id", formData.id ?? ""]]),
      });
      location.route(`vendor?id=${formData.id}`);
    } catch (error) {
      console.error(error);
      toastMessager.showToastMessage(
        `Failed to ${vendor ? "update" : "create"} vendor`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="boxedItem">
      {formData && (
        <div class="vendorDetails">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.5rem",
            }}
          >
            <h1 style={{ margin: 0 }}>
              {vendor ? "Edit Vendor" : "Create New Vendor"}
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div class="formField">
              <label for="name">Vendor Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                class="formInput"
              />
            </div>

            <div class="formField">
              <label for="orderMethod">Order Method*</label>
              <input
                type="text"
                id="orderMethod"
                name="orderMethod"
                value={formData.orderMethod}
                onChange={handleChange}
                required
                class="formInput"
              />
            </div>

            <div class="formField">
              <label for="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                class="formInput"
              />
            </div>

            <div class="formField">
              <label for="faxNumber">Fax Number</label>
              <input
                type="tel"
                id="faxNumber"
                name="faxNumber"
                value={formData.faxNumber}
                onChange={handleChange}
                class="formInput"
              />
            </div>

            <div class="formField">
              <label for="website">Website</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                class="formInput"
              />
            </div>

            <div class="formField">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                class="formInput"
              />
            </div>

            <div class="formField">
              <label for="turnaroundTime">Turnaround Time*</label>
              <input
                type="text"
                id="turnaroundTime"
                name="turnaroundTime"
                value={formData.turnaroundTime}
                onChange={handleChange}
                required
                class="formInput"
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
                marginTop: "2rem",
              }}
            >
              <button
                type="button"
                class="button secondaryButton"
                onClick={() => {
                  window.history.back();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button type="submit" class="button" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span class="buttonLoader"></span>
                ) : vendor ? (
                  "Update Vendor"
                ) : (
                  "Create Vendor"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
