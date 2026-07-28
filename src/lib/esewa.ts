import { EsewaCheckout } from "@/lib/booking";

export function submitEsewaCheckout(checkout: EsewaCheckout): void {
  if (typeof document === "undefined") {
    throw new Error("eSewa checkout can only start in the browser.");
  }
  const form = document.createElement("form");
  form.method = "POST";
  form.action = checkout.paymentUrl;
  form.style.display = "none";

  Object.entries(checkout.fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = String(value);
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}
