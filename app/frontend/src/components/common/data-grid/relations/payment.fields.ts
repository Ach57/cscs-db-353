import type { ColDef } from "ag-grid-community";
import type { Payment } from "../../../../types/payment";

export const paymentFields: ColDef<Payment>[] = [
  {
    field: "payment_id",
    headerName: "Payment ID",
  },
  {
    field: "membership_number",
    headerName: "Membership Number",
    minWidth: 180,
  },
  {
    field: "payment_date",
    headerName: "Payment Date",
  },
  {
    field: "amount",
    headerName: "Amount",
    filter: "agNumberColumnFilter",
    valueFormatter: ({ value }) =>
      typeof value === "number"
        ? new Intl.NumberFormat("en-CA", {
            style: "currency",
            currency: "CAD",
          }).format(value)
        : "",
  },
  {
    field: "payment_method",
    headerName: "Method",
  },
  {
    field: "membership_year",
    headerName: "Membership Year",
    filter: "agNumberColumnFilter",
  },
  {
    field: "installment_number",
    headerName: "Installment",
    filter: "agNumberColumnFilter",
  },
];