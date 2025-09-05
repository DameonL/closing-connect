type PayoffVendor = {
  id?: string;
  name: string;
  type: string;
  orderMethod: "Phone" | "Fax" | "Email" | "Website";
  phoneNumber?: number;
  faxNumber?: number;
  website?: string;
  email?: string;
  turnaroundTime?: string;
  notes: PayoffVendorNote[];
  firstLetter: string;
  _rid?: string;
  _ts?: number;
};