export function formatMoney(value: { toString(): string } | string | number) {
  const amount = Number(value.toString());
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatHourlyRate(value: { toString(): string } | string | number) {
  return `${formatMoney(value)}/hr`;
}

export function formatPostedDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatLocation(city: string, state: string) {
  return `${city}, ${state}`;
}
