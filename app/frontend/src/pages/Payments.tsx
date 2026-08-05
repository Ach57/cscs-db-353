import RelationPage from "../components/common/relation-page/RelationPage";
import { paymentFields } from "../components/common/data-grid/relations/payment.fields";
import type { Payment } from "../types/payment";
import { paymentApi } from "../services/payments";

export default function Payments() {
  return (
    <RelationPage<Payment>
      title="Payments"
      description="Manage membership payments and installments."
      initialData={[]}
      columnDefs={paymentFields}
      api={paymentApi}
      idField="payment_id"
      getRowId={(row) => String(row.payment_id)}
      createEmptyRow={() => ({
        payment_id: Date.now(),
        membership_number: 0,
        payment_date: new Date()
          .toISOString()
          .slice(0, 10),
        amount: 0,
        payment_method: "Cash",
        membership_year: new Date().getFullYear(),
        installment_number: 1,
      })}
    />
  );
}
