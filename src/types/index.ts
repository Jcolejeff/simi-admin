export type planTypes = 'starter' | 'student' | 'professional' | 'master';

export type routePathTypes =
  | ''
  | 'login'
  | 'logout'
  | 'reset-password'
  | 'forgot-password'
  | 'verify-email'
  | 'new-password'
  | 'dashboard'
  | 'profile'
  | 'users'
  | 'settings'
  | 'create-new-product'
  | 'create-account'
  | 'blogs'
  | 'orders'
  | 'products'
  | 'create-coupon'
  | 'food-bundles'
  | 'flash-sales'
  | 'notifications'
  | 'coupons'
  | 'faq'
  | 'farm-offtake'
  | 'user-profile'
  | 'categories'
  | 'create-category'
  | 'create-coupons'
  | 'create-food-bundle'
  | 'create-sub-category'
  | 'create-flash-sale'
  | 'create-farm-offtake'
  | 'create-blog'
  | 'create-delivery-fee'
  | 'create-faq'
  | 'categories'
  | 'toggle'
  | 'wallets'
  | 'delivery-fee';

export interface routesInterface<T> {
  path: T;
  element: JSX.Element;
}

export type routeTypes = routesInterface<routePathTypes>[];

export interface RouteGuardInterface {
  plan: planTypes;
}

export interface ItitleLinks<T, L> {
  title: T;
  link: L;
}

export interface apiInterface<T> {
  items: T;
  next_page: number;
  page: number;
  previous_page: number;
  size: number;
  total: number;
}

export interface apiInterfaceV2<T> {
  data: T;
  message: string;
}

export interface contentApiItemInterface {
  content: string;
  date_created: string;
  id: string;
  is_deleted: boolean;
  last_updated: string;
  meta_description: string;
  content_author: {
    email: string;
    first_name: string;
    last_name: string;
  };
  photos: {
    filename: string;
    id: string;
    is_public: boolean;
    url: string;
  }[];
  subtitle: string;
  title: string;
}

export interface authDetailsInterface {
  access?: string;
  data?: {
    biz_partner_id?: string;
    first_name?: string;
    last_name?: string;
    oragnization_id?: string;
  };
  refresh?: string;
  user_id?: string;
  displayName?: string;
  uid?: string;
  email?: string;
  emailVerified?: boolean;
  photoURL?: string;
  role?: string;
}

export interface productInterface {
  name: string;
  description: string;
  unique_id: string;
  url_slug: string;
  is_available: boolean;
  previous_url_slugs: any;
  id: string;
  parent_product_id: string;
  parent: string;
  organization_id: string;
  stock_id: string;
  product_image: Array<any>;
  categories: Array<string>;
  date_created: string;
  last_updated: string;
  user_id: string;
  photos: Array<{
    model_name: string;
    model_id: string;
    organization_id: string;
    url: string;
    is_featured: boolean;
    save_as_jpg: boolean;
    is_public: boolean;
    file_rename: boolean;
    position: number;
  }>;
  prices: Array<{
    name: string;
    product_id: string;
    stock_id: string;
    price: number;
    discounted_price: number;
    currency_code: string;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
    customer_group: string;
    id: string;
    start: string;
    end: string;
    user_id: string;
    date_created: string;
    last_updated: string;
  }>;
  stocks: Array<{
    name: string;
    quantity: number;
    buying_price: number;
    currency_code: string;
    supplier_id: string;
    buying_date: string;
    id: string;
    product_id: string;
    status: string;
    user_id: string;
    date_created: string;
    original_quantity: number;
    supplier: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      business_name: string;
    };
  }>;
  current_price: string;
  is_deleted: boolean;
  available_quantity: number;
  selling_price: number;
  discounted_price: number;
  buying_price: number;
  extra_infos: Array<{
    id: string;
    key: string;
    value: string;
    value_dt: string;
  }>;
  featured_reviews: Array<string>;
  unavailability: string;
}
export interface Order {
  id: string;
  totalAmount: number;
  address: string;
  paymentReference: string;
  message: string;
  userId: string;
  name: string;
  phone: string;
  lastName: string;
  firstName: string;
  orderId: string;
  cartItems: CartItem[];
  email: string;
  status: string;
  createdDate: string;
}
export interface Order {
  id: string;
  totalAmount: number;
  address: string;
  paymentReference: string;
  message: string;
  userId: string;
  name: string;
  phone: string;
  lastName: string;
  firstName: string;
  orderId: string;
  cartItems: CartItem[];
  email: string;
  status: string;
  createdDate: string;
}

export interface Category {
  id: string;
  image: string;
  desc: string;
  name: string;
  createdDate: string;
}

interface CartItem {
  chosenUnit: string;
  id: string;
  quantity: number;
  expireDate: Timestamp;
  unit: string;
  name: string;
  slug: string;
  price: number;
  no_of_items: number;
  ratings: Rating[];
  subcategory: Category;
  costprice: string;
  minimumPrice: number;
  nameYourPrice: boolean;
  desc: string;
  createdDate: string;
  units: Unit[];
  nameYourPriceFields?: NameYourPriceField[];
  image: string;
}

interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

interface Rating {
  rating: number;
  caption: string;
  ratedBy: RatedBy;
  description: string;
}

interface RatedBy {
  converter: any;
  _key: Key;
  type: string;
  firestore: Firestore;
}

interface Key {
  path: Path;
  offset: number;
  len: number;
}

interface Path {
  segments: string[];
  offset: number;
  len: number;
}

interface Firestore {
  app: App;
  databaseId: DatabaseId;
  settings: FirestoreSettings;
}

interface App {
  _isDeleted: boolean;
  _options: AppOptions;
  _config: AppConfig;
  _name: string;
  _automaticDataCollectionEnabled: boolean;
  _container: Container;
}

interface AppOptions {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

interface AppConfig {
  name: string;
  automaticDataCollectionEnabled: boolean;
}

interface Container {
  name: string;
  providers: Record<string, unknown>;
}

interface DatabaseId {
  projectId: string;
  database: string;
}

interface FirestoreSettings {
  host: string;
  ssl: boolean;
  ignoreUndefinedProperties: boolean;
  cacheSizeBytes: number;
  experimentalForceLongPolling: boolean;
  experimentalAutoDetectLongPolling: boolean;
  experimentalLongPollingOptions: Record<string, unknown>;
  useFetchStreams: boolean;
}

interface Unit {
  ratio: number | string;
  unit: string;
  price: number | string;
}

interface NameYourPriceField {
  userRef: RatedBy;
  namedPrice: number;
}
