import { ImageSourcePropType } from 'react-native';

/**
 * Everything a user can post is a Listing. The shared fields live on the base
 * type; anything specific to one kind lives in `details`.
 */
export type ListingKind = 'task' | 'contract' | 'fulltime' | 'product' | 'service';

/** Work = someone is hiring. Market = someone is selling. */
export type ListingGroup = 'work' | 'market';

export const LISTING_GROUP: Record<ListingKind, ListingGroup> = {
  task: 'work',
  contract: 'work',
  fulltime: 'work',
  product: 'market',
  service: 'market',
};

export const KINDS_BY_GROUP: Record<ListingGroup, ListingKind[]> = {
  work: ['task', 'contract', 'fulltime'],
  market: ['product', 'service'],
};

export type PriceUnit = 'fixed' | 'item' | 'hour' | 'day' | 'week' | 'month' | 'year' | 'project';

export type Price = {
  amount: number;
  /** Upper bound for ranges, e.g. salaries. */
  maxAmount?: number;
  /** ISO 4217 code, e.g. GHS, NGN, USD. */
  currency: string;
  unit: PriceUnit;
  negotiable: boolean;
};

export type Place = {
  /** Neighbourhood or district, e.g. "East Legon". */
  area: string;
  city?: string;
  /** ISO 3166-1 alpha-2 code, e.g. GH. */
  country: string;
  coords?: { lat: number; lng: number };
};

export type UserSummary = {
  id: string;
  name: string;
  handle: string;
  avatar?: ImageSourcePropType;
  verified: boolean;
  rating?: number;
  reviewCount?: number;
};

export type WorkMode = 'onsite' | 'remote' | 'hybrid';
export type ItemCondition = 'new' | 'like_new' | 'used';
export type DeliveryOption = 'pickup' | 'seller_delivers' | 'courier';

export type TaskDetails = {
  /** ISO date-time. */
  scheduledFor?: string;
  duration?: string;
  workMode: WorkMode;
  workersNeeded: number;
  toolsProvided?: boolean;
};

export type ContractDetails = {
  duration: string;
  workMode: WorkMode;
  deliverables: string[];
};

export type FullTimeDetails = {
  company: string;
  workMode: WorkMode;
  requirements: string[];
  /** ISO date. */
  deadline?: string;
};

export type ProductDetails = {
  condition: ItemCondition;
  stock?: number;
  delivery: DeliveryOption[];
};

export type ServiceDetails = {
  hours?: string;
  serviceRadiusKm?: number;
};

type BaseListing = {
  id: string;
  title: string;
  description: string;
  price: Price;
  location: Place;
  images: ImageSourcePropType[];
  tags: string[];
  postedBy: UserSummary;
  /** ISO date-time. */
  createdAt: string;
  status: 'open' | 'closed';
};

export type TaskListing = BaseListing & { kind: 'task'; details: TaskDetails };
export type ContractListing = BaseListing & { kind: 'contract'; details: ContractDetails };
export type FullTimeListing = BaseListing & { kind: 'fulltime'; details: FullTimeDetails };
export type ProductListing = BaseListing & { kind: 'product'; details: ProductDetails };
export type ServiceListing = BaseListing & { kind: 'service'; details: ServiceDetails };

export type Listing =
  | TaskListing
  | ContractListing
  | FullTimeListing
  | ProductListing
  | ServiceListing;

/** A listing as submitted from the post form, before the store assigns server-side fields. */
export type NewListing = Omit<Listing, 'id' | 'createdAt' | 'status' | 'postedBy'>;
