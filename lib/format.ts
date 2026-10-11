import {
  DeliveryOption,
  ItemCondition,
  ListingKind,
  Place,
  Price,
  PriceUnit,
  WorkMode,
} from '@/types/listing';

export const KIND_LABEL: Record<ListingKind, string> = {
  task: 'Task',
  contract: 'Contract',
  fulltime: 'Full-time',
  product: 'Product',
  service: 'Service',
};

export const WORK_MODE_LABEL: Record<WorkMode, string> = {
  onsite: 'On-site',
  remote: 'Remote',
  hybrid: 'Hybrid',
};

export const CONDITION_LABEL: Record<ItemCondition, string> = {
  new: 'New',
  like_new: 'Like new',
  used: 'Used',
};

export const DELIVERY_LABEL: Record<DeliveryOption, string> = {
  pickup: 'Pickup',
  seller_delivers: 'Seller delivers',
  courier: 'Courier',
};

const UNIT_SUFFIX: Record<PriceUnit, string> = {
  fixed: '',
  item: '',
  hour: '/hr',
  day: '/day',
  week: '/wk',
  month: '/mo',
  year: '/yr',
  project: '/project',
};

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    }).format(amount);
  } catch {
    // Unknown currency code or an engine without Intl currency support.
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function formatPrice(price: Price): string {
  const base = formatMoney(price.amount, price.currency);
  const range = price.maxAmount ? ` – ${formatMoney(price.maxAmount, price.currency)}` : '';
  return `${base}${range}${UNIT_SUFFIX[price.unit]}`;
}

export function formatPlace(place: Place): string {
  return place.city ? `${place.area}, ${place.city}` : place.area;
}

export function formatRelativeTime(iso: string, now = Date.now()): string {
  const minutes = Math.round((now - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  return formatDate(iso);
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  try {
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return date.toDateString();
  }
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  try {
    return date.toLocaleString(undefined, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return date.toString();
  }
}
