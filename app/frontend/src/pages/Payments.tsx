import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import Button from "../components/common/Button";
import { Field, Input, Select } from "../components/common/Input";
import RelationPage from "../components/common/relation-page/RelationPage";
import { paymentFields } from "../components/common/data-grid/relations/payment.fields";
import { clubMemberApi } from "../services/members";
import { getMembershipBalance, makePayment, paymentApi } from "../services/payments";
import type { ClubMember } from "../types/member";
import type { MembershipBalance, Payment, PaymentInput, PaymentMethod } from "../types/payment";
import "./Payments.css";

const currentYear = new Date().getFullYear();

function today() {
  return new Date().toISOString().slice(0, 10);
}

function money(value: number) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(value);
}

function messageOf(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function PaymentHistory({ refreshKey }: { refreshKey: number }) {
  const api = useMemo(
    () => ({
      ...paymentApi,
      getAll: async () => {
        // Depend on refreshKey so RelationPage receives a new API object and reloads.
        void refreshKey;
        return paymentApi.getAll();
      },
    }),
    [refreshKey],
  );

  return (
    <RelationPage<Payment, PaymentInput, Partial<PaymentInput>>
      title="Payment history"
      description="Review, edit, or remove recorded membership payments."
      columnDefs={paymentFields}
      api={api}
      idField="payment_id"
      getRowId={(row) => String(row.payment_id)}
      validateRow={(row) => [
        row.membership_number <= 0 ? "Membership number must be positive." : "",
        row.amount <= 0 ? "Amount must be greater than zero." : "",
        row.installment_number < 1 || row.installment_number > 4 ? "Installment must be from 1 to 4." : "",
      ].filter(Boolean)}
      toUpdateInput={(row) => ({
        membership_number: Number(row.membership_number),
        payment_date: row.payment_date,
        amount: Number(row.amount),
        payment_method: row.payment_method,
        membership_year: Number(row.membership_year),
        installment_number: Number(row.installment_number),
      })}
    />
  );
}

export default function Payments() {
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [membershipNumber, setMembershipNumber] = useState("");
  const [membershipYear, setMembershipYear] = useState(currentYear);
  const [summary, setSummary] = useState<MembershipBalance | null>(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("Cash");
  const [paymentDate, setPaymentDate] = useState(today());
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoadingMembers(true);
    clubMemberApi.getAll()
      .then((data) => {
        if (!alive) return;
        setMembers(data);
      })
      .catch((requestError) => {
        if (!alive) return;
        setError(messageOf(requestError));
      })
      .finally(() => {
        if (alive) setLoadingMembers(false);
      });
    return () => { alive = false; };
  }, []);

  const loadSummary = useCallback(async (memberNumber: number, year: number) => {
    setLoadingSummary(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await getMembershipBalance(memberNumber, year);
      setSummary(data);
      if (data.balance_due > 0) setAmount(String(data.balance_due));
      else setAmount("");
    } catch (requestError) {
      setSummary(null);
      setAmount("");
      setError(messageOf(requestError));
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  async function handleLookup() {
    const memberNumber = Number(membershipNumber);
    if (!Number.isInteger(memberNumber) || memberNumber <= 0) {
      setError("Choose or enter a valid membership number.");
      setSummary(null);
      return;
    }
    if (!Number.isInteger(membershipYear) || membershipYear < 2000 || membershipYear > 2100) {
      setError("Membership year must be between 2000 and 2100.");
      setSummary(null);
      return;
    }
    await loadSummary(memberNumber, membershipYear);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!summary) {
      setError("Load a member's balance before making a payment.");
      return;
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Payment amount must be greater than zero.");
      return;
    }

    const nextInstallment = summary.installment_count + 1;
    if (nextInstallment > 4) {
      setError("This member already has the maximum of 4 installments for this membership year.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await makePayment({
        membership_number: summary.membership_number,
        payment_date: paymentDate,
        amount: numericAmount,
        payment_method: method,
        membership_year: summary.membership_year,
        installment_number: nextInstallment,
      });
      setSuccess(`Payment recorded as installment ${nextInstallment}.`);
      await loadSummary(summary.membership_number, summary.membership_year);
      setRefreshKey((key) => key + 1);
    } catch (requestError) {
      setError(messageOf(requestError));
    } finally {
      setSaving(false);
    }
  }

  const selectedMember = members.find((member) => member.membership_number === Number(membershipNumber));
  const nextInstallment = summary ? summary.installment_count + 1 : 1;

  return (
    <div className="payments-page">
      <section className="payment-workflow">
        <header className="payment-workflow__header">
          <div style={{ gap: "20px", display: "flex", flexDirection: "column" }}>
            <p className="payment-workflow__eyebrow">Membership finance</p>
            <h1>Make a payment</h1>
            <p>Select a club member and membership year to see what is owed before recording a payment.</p>
          </div>
        </header>

        <div className="payment-workflow__lookup">
          <Field label="Membership number"  hint={selectedMember ? `${selectedMember.first_name} ${selectedMember.last_name}` : "Select a member or type their number."}>
            <Input
              type="number"
              min={1}
              list="club-member-numbers"
              value={membershipNumber}
              placeholder="e.g. 12"
              onChange={(event) => {
                setMembershipNumber(event.target.value);
                setSummary(null);
                setSuccess(null);
              }}
            />
          </Field>
          <datalist id="club-member-numbers">
            {members.map((member) => (
              <option key={member.membership_number} value={member.membership_number}>
                {member.first_name} {member.last_name}
              </option>
            ))}
          </datalist>

          <Field label="Membership year">
            <Input
              type="number"
              min={2000}
              max={2100}
              value={membershipYear}
              onChange={(event) => {
                setMembershipYear(Number(event.target.value));
                setSummary(null);
                setSuccess(null);
              }}
            />
          </Field>

          <div className="payment-workflow__lookup-action">
            <Button variant="primary" onClick={() => void handleLookup()} disabled={loadingSummary || loadingMembers}>
              {loadingSummary ? "Checking..." : "Check balance"}
            </Button>
          </div>
        </div>

        {error && <div className="payment-alert payment-alert--error" role="alert">{error}</div>}
        {success && <div className="payment-alert payment-alert--success" role="status">{success}</div>}

        {summary ? (
          <div className="payment-workflow__body">
            <section className="payment-summary" aria-label="Membership balance summary">
              <div className="payment-summary__member">
                <span>Member</span>
                <strong>#{summary.membership_number} · {summary.first_name} {summary.last_name}</strong>
                <small>{summary.age_at_year_end >= 18 ? "Major member" : "Minor member"} in {summary.membership_year}</small>
              </div>

              <div className="payment-summary__grid">
                <div><span>Required fee</span><strong>{money(summary.required_fee)}</strong></div>
                <div><span>Already paid</span><strong>{money(summary.total_paid)}</strong></div>
                <div><span>Balance</span><strong>{money(summary.balance_due)}</strong></div>
                <div><span>Donation</span><strong>{money(summary.donation)}</strong></div>
                <div><span>Installments used</span><strong>{summary.installment_count} / 4</strong></div>
                <div><span>Status</span><strong>{summary.status}</strong></div>
              </div>
            </section>

            <form className="payment-form" onSubmit={(event) => void handleSubmit(event)}>
              <div className="payment-form__heading">
                <div>
                  <h2>Record payment</h2>
                  <p>Next installment: {nextInstallment <= 4 ? `${nextInstallment} of 4` : "maximum reached"}</p>
                </div>
              </div>

              <div className="payment-form__fields">
                <Field label="Amount">
                  <Input type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" />
                </Field>
                <Field label="Method">
                  <Select value={method} onChange={(event) => setMethod(event.target.value as PaymentMethod)}>
                    <option value="Cash">Cash</option>
                    <option value="Debit">Debit</option>
                    <option value="Credit">Credit</option>
                  </Select>
                </Field>
                <Field label="Payment date">
                  <Input type="date" value={paymentDate} onChange={(event) => setPaymentDate(event.target.value)} />
                </Field>
                <Field label="Membership year">
                  <Input value={summary.membership_year} disabled readOnly />
                </Field>
              </div>

              <div className="payment-form__actions">
                <Button type="submit" variant="primary" disabled={saving || nextInstallment > 4}>
                  {saving ? "Recording..." : summary.balance_due === 0 ? "Record donation/payment" : "Make payment"}
                </Button>
                {summary.balance_due > 0 && Number(amount) > summary.balance_due && (
                  <small>{money(Number(amount) - summary.balance_due)} of this payment will count as a donation.</small>
                )}
              </div>
            </form>
          </div>
        ) : (
          <div className="payment-workflow__empty">
            <strong>No balance loaded.</strong>
            <span>Choose a member and year, then click Check balance.</span>
          </div>
        )}
      </section>

      <PaymentHistory refreshKey={refreshKey} />
    </div>
  );
}
