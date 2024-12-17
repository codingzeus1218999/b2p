import { MouseEventHandler, ReactNode } from "react";
/*
types
*/
type NOTIFICATIONTYPES = "warning" | "info" | "danger" | "success";
type BUTTONSTATES = "active" | "disable";
export type TOASTTYPES = "success" | "warning" | "error" | "info";
export type ORDERSTATUS =
  | "create"
  | "progress"
  | "refund"
  | "discussion"
  | "done"
  | "review"
  | "cancel";
export type PAYMENTSTATUS =
  | "open"
  | "paid"
  | "confirmed"
  | "expired"
  | "rejected"
  | "done"
  | "wait"
  | "removed"
  | "cancel";
export type FAVORITESTATES = "no" | "mid" | "yes";
type SEARCHINPUTSTATETYPE = "init" | "focus" | "found";

/*
interfaces for api response
*/
export interface typeInterface {
  id: string;
  title: string;
}
export interface sizeInterface {
  id: string;
  title: string;
}
interface subCategoryInterface {
  title: string;
  id: string;
  parent_title: string | null;
}
export interface categoryInterface {
  id: string;
  title: string;
  parent_title: string | null;
  categories: subCategoryInterface[];
}
export interface buyerInterface {
  id: string;
  shop_name: string;
  picture: {
    id: string;
    filename: string;
    size: number;
    path: string;
  };
  is_favorites: boolean;
  comments: number;
}
export interface buyerWithIdInterface {
  id: string;
  text: string;
}
export interface productInterface {
  id: string;
  external_id: string;
  unique_external_id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  rate: number;
  max_rate: number;
  category: {
    id: string;
    title: string;
  };
  file: {
    id: string;
    filename: string;
    size: number;
    path: string;
  } | null;
  is_favorite: false;
  stocks_labels: string[];
  shop: {
    id: string;
    title: string;
  };
  store: {
    id: string;
    title: string;
    file: {
      id: string;
      filename: string;
      size: number;
      path: string;
    };
  };
  last_review: reviewInterface | null;
  city_test: {} | null;
  coupons: string[];
}
export interface reviewInterface {
  id: string;
  product_id: string;
  author: string;
  comment: string;
  rating: number;
  file: {
    id: string;
    filename: string;
    size: number;
    path: string;
  } | null;
  cities: string;
  response: {
    author: string;
    comment: string;
  };
  publish_at: number;
}
export interface storyInterface {
  id: string;
  title: string;
  preview_title: string;
  description: string;
  file: {
    id: string;
    filename: string;
    size: number;
    path: string;
  };
  original: {
    id: string;
    filename: string;
    size: number;
    path: string;
  };
  status: boolean;
  publish_at: number;
}
export interface brandInterface {
  id: string;
  title: string;
  file: {
    id: string;
    filename: string;
    size: number;
    path: string;
  } | null;
  available: boolean;
}
export interface notificationInterface {
  id: string;
  type: NOTIFICATIONTYPES;
  type_title: string;
  title: string;
  message: string;
  expired_at: number;
}
export interface homeSliderInterface {
  id: string;
  sorting: number;
  path: string;
}
export interface instructionInterface {
  title: string;
  description: string;
  image: string;
  platforms: object;
}
export interface instructionStepInterface {
  header: string;
  footer: string | null;
  qr_code: string | null;
  image: string;
}
export interface deliveryTypeInterface {
  id: string;
  title: string;
  code: string;
  sorting: number;
  icon: string;
  options: string[] | null;
}
export interface offsetMetaInterface {
  total: number;
  limit: number;
  offset: number;
}
export interface pageMetaInterface {
  limit: number;
  page: number;
  total: number;
}
export interface searchResultInterface {
  data: productInterface[];
  meta: offsetMetaInterface;
}
export interface reviewResultInterface {
  data: reviewInterface[];
  meta: offsetMetaInterface;
}
export interface buyersResultInterface {
  data: buyerInterface[];
  meta: pageMetaInterface;
}
export type tipStocksInterface = string[];
export type tipPaymentInterface = string[];
export type tipPayedInterface = string[];
export interface productStocksInterface {
  id: string;
  external_id: string;
  unique_external_id: string;
  type_size: string;
  type_size_id: string;
  size: string;
  size_id: string;
  store_id: string;
  weight: number;
  price: number;
  delivery: string;
  "delivery-type": any;
  in_filter: boolean;
  delivered_at: string;
}
export interface orderInterface {
  id: string;
  external_id?: string;
  account_id: string;
  stock_id: string;
  product_id: string;
  product: productInterface;
  dispute_id?: string;
  can_dispute: boolean;
  description?: string;
  images: {
    id: string;
    filename: string;
    size: number;
    path: string;
  }[];
  city: string;
  location: string;
  weight: number;
  stock_price: number;
  order_price: number;
  store_price: number;
  store_percent: number;
  stock_created_at: string;
  stock_created_at_info: string;
  discount: number;
  coupon_id?: string;
  stock_exchange: number;
  external_account_id?: string;
  status: string;
  status_label: string;
  status_label_color: string;
  payed: boolean;
  feedback?: {
    id: string;
    order_id: string;
    marketplace: number;
    shipment: number;
    product: number;
    feedback: string;
  };
  chat?: chatInterface;
  payed_status?: number;
  payed_by?: number;
  payed_at: number;
  created_at: number;
  updated_at: number;
}
export interface orderMadeInterface extends orderInterface {}
export interface orderPayedInterface extends orderInterface {}
export interface orderDoneInterface extends orderInterface {}
export interface orderCancelInterface extends orderInterface {}
export interface paymentSystemInterface {
  id: string;
  title: string;
  subtitle: string;
  code: "ccard" | "sbp" | "qiwi" | "phone" | "other";
  type: "card" | "sbp" | "qiwi" | "sim" | "other";
  percent: number;
  minimum: number;
  maximum: number;
}
export interface paymentInterface {
  id: string;
  account_id: string;
  order_id: string;
  type: string;
  payment_system_id: string;
  amount: number;
  amount_payment: number;
  status: PAYMENTSTATUS;
  status_label: string;
  requisites: string | null;
  bank?: string;
  recipient?: string;
  information?: string;
  chat_id?: string;
  check?: boolean;
  been_check?: boolean;
  check_reason?: string;
  created_at: number;
  updated_at: number;
}
export interface paymentHistoryInterface {
  id: string;
  type: string;
  operation: string;
  amount: number;
  signed: boolean;
  order_id: string;
  payment_id: string | null;
  hold_id: string | null;
  status: string;
  comment: string;
  created_label: string;
  created_at: number;
}
export interface paymentTopupInterface extends paymentInterface {}
export interface paymentCancelInterface extends paymentInterface {}
export interface paymentPayedInterface extends paymentInterface {}
export interface paymentExpiredInterface extends paymentInterface {}
export interface orderFeedbackInterface {
  id: string;
  order_id: string;
  marketplace: number;
  shipment: number;
  product: number;
  feedback: string;
}
export interface accountInterface {
  id: string;
  login: string;
  username: string;
  file: {
    id: string;
    filename: string;
    size: number;
    path: string;
  } | null;
  two_factor: boolean;
  balance: number;
  status: string;
}

export interface fileInterface {
  id: string;
  filename: string;
  size: number;
  path: string;
}

export interface changePasswordInterface {
  access: string;
  refresh: string;
  two_factor: boolean;
}

export interface accountStatsInterface {
  order: number;
  discussion: number;
  open_discussion: number;
}

export interface qrInterface {
  secret: string;
  qr_code: string;
}

export interface chatTypeInterface {
  id: string;
  title: string;
}

export interface chatInterface {
  id: string;
  type_title: string;
  title: string;
  author_id: string;
  order_id?: string;
  payment_id?: string;
  invite_moderator: boolean;
  status: string;
  type_id: string;
  is_send: boolean;
  count_message: number;
  messages_not_read: number;
  last_message: string;
  created_label: string;
  marked_up: boolean;
  created_at: number;
  payment?: paymentInterface;
}

export interface timeIntervalInterface {
  balance_interval: number;
  payment_interval: number;
  message_update_interval: number;
}

export interface messageInterface {
  author_id: string;
  author_image: {
    id: string;
    filename: string;
    size: number;
    path: string;
  } | null;
  author_name: string;
  chat_id: string;
  created_at: number;
  external_id: string;
  file: {
    id: string;
    filename: string;
    size: number;
    path: string;
  } | null;
  id: string;
  is_send: boolean;
  message: string;
  type: string;
}

export interface couponInterface {
  id: string;
  account_id: string;
  value: string;
  amount: number;
  order_id: string | null;
  status: "usage" | "active";
  chat: {
    id: string | null;
    title: string | null;
  };
  shop: {
    id: string | null;
    name: string | null;
    file: {
      id: string;
      filename: string;
      size: number;
      path: string;
    } | null;
  };
  store: {
    id: string;
    file: {
      id: string;
      filename: string;
      size: number;
      path: string;
    } | null;
  };
}

export interface textCouponInterface {
  title: string;
  content: string[];
}

/*
interfaces for api query
*/
export interface searchProductsQueryInterface {
  type_id: string;
  size_ids?: string;
  category_ids?: string;
  brand_ids: string;
  variant_ids: string;
  from_price?: number;
  to_price?: number;
  from_step?: number;
  to_step?: number;
  limit?: number;
  offset?: number;
  sort?: string;
}
export interface orderFeedbackQueryInterface {
  marketplace: number;
  shipment: number;
  product: number;
  feedback: string;
  order_id: string;
}
export interface paymentTopupQueryInterface {
  amount: number;
  order_id: string;
  payment_system_id: string;
}
export interface fileQueryInterface {
  filename: string;
  size: number;
  mimetype: string;
}
export interface changePasswordQueryInterface {
  password: string;
  new_password: string;
  new_password_confirmation: string;
}

/*
interfaces for context
*/
export interface menuContextInterface {
  hide: boolean;
  setHide: (val: boolean) => void;
}
export interface blurContextInterface {
  blur: boolean;
  setBlur: (val: boolean) => void;
}
export interface ticketContextInterface {
  newTicketCount: number;
  setNewTicketCount: (val: number) => void;
}

export interface authModalContextInterface {
  isOpenAuthModal: boolean;
  defaultTab: "login" | "register";
  lastProduct: string;
  setIsOpenAuthModal: (val: boolean) => void;
  setDefaultTab: (val: "login" | "register") => void;
  setLastProduct: (val: string) => void;
  callbackFunc: Function | null;
  setCallbackFunc: (val: Function | null) => void;
}
export interface dropdownOpenContextInterface {
  dropdownOpen: number;
  setDropdownOpen: (val: number) => void;
  isSelf: boolean;
  setIsSelf: (val: boolean) => void;
}
export interface scrollContextInterface {
  scroll: boolean;
  setScroll: (val: boolean) => void;
}
export interface defaultTypeContextInterface {
  dtypeId: string;
  setDtypeId: (val: string) => void;
}
export interface filterContextInterface {
  filterOption: filterOptionInterface;
  setFilterOption: (val: filterOptionInterface) => void;
}
export interface stockContextInterface {
  stock: productStocksInterface;
  setStock: (val: productStocksInterface) => void;
}

/*
interfaces for the component
*/
export interface dropdownItemInterface {
  label: string;
  value: string;
  icon?: string;
  available?: boolean;
}
export interface toggleItemInterface {
  label: string;
  value: string;
}
export interface reviewCardInterface {
  rating: number;
  date: string;
  time: string;
  location: string;
  nick: string;
  comment: string;
  ProductName: string;
  responderName?: string;
  responseText?: string;
}
export interface buyerCardInterface {
  id: string;
  picture: string;
  name: string;
  comments: number;
  isFavorites: boolean;
}
interface productCardInterface {
  id: string;
  title: string;
  imageSrc: string;
  buyerName: string;
  logoSrc: string;
  price: string;
  rating: number;
  maxRating: number;
  tags: string[];
  isFavorites: boolean;
  quantity: number;
  unit: string;
}
export interface nestedDropdownItemInterface {
  label: string;
  value: string;
  parentId: null | string;
  subValues: string[];
}
export interface homeSwiperItemInterface {
  imageSrc: string;
}
export interface instructionsDataInterface {
  title: string;
  description: string;
  image: string;
  platforms: {
    [key: string]: instructionStepInterface[];
  };
}
export interface filterOptionInterface {
  brands: dropdownItemInterface[];
  type?: dropdownItemInterface;
  sizes: dropdownItemInterface[];
  categories: nestedDropdownItemInterface[];
  variants: dropdownItemInterface[];
  priceFrom?: number;
  priceTo?: number;
  stepFrom?: number;
  stepTo?: number;
  offset?: number;
  limit?: number;
  sort?: dropdownItemInterface;
}

interface reviewSimpleCardInterface {
  rating: number;
  date: string;
  time: string;
  location: string;
  comment: string;
}

export interface iconPropsInterface {
  size?: number;
  fill?: string;
  className?: string;
  pathClassName?: string;
  onClick?: () => void;
  onMouseEnter?: MouseEventHandler<SVGSVGElement>;
  onMouseLeave?: MouseEventHandler<SVGSVGElement>;
}

export interface tabInterface {
  title: string;
  value: string;
}

interface modalOptionsInterface {
  desktopWidth?: number;
  mobileMarginX?: number;
  borderRadiusTL?: number;
  borderRadiusTR?: number;
  borderRadiusBR?: number;
  borderRadiusBL?: number;
  paddingT?: number;
  paddingR?: number;
  paddingL?: number;
  paddingB?: number;
  desktopMargin?: string;
  mobileMarginT?: number | "auto";
  mobileMarginB?: number | "auto";
  onClose?: () => void;
}

/*
props for components
*/
export interface BalanceInputProps {
  unit?: string;
  onChangeVal: (val: number) => void;
  activeVal: number;
}
export interface ButtonBaseProps {
  children: React.ReactNode;
  status: BUTTONSTATES;
  onClick: () => void;
  type?: "button" | "submit";
  style?: "primary" | "secondary" | "red";
}
export interface ButtonMediumProps {
  children: React.ReactNode;
  status: BUTTONSTATES;
  onClick: () => void;
  style?: "primary" | "secondary";
}
export interface ButtonUnderlinedProps {
  title: string;
  status: BUTTONSTATES;
  onClick: () => void;
}
export interface ButtonWhiteProps {
  children: React.ReactNode;
  status: BUTTONSTATES;
  onClick: () => void;
}
export interface CheckBoxProps {
  children: React.ReactNode;
  value: boolean;
  onChange: (val: boolean) => void;
}
export interface CodeInputProps {
  length: number;
  onComplete: (code: string) => void;
  error: string;
  updated: number;
}
export interface DropdownBoxProps {
  label: string;
  list: dropdownItemInterface[];
  activeItem?: dropdownItemInterface;
  onChange: (item: dropdownItemInterface) => void;
}
export interface DropdownBoxDateRangePickerProps {
  label: string;
  startD: any;
  endD: any;
  onChangeRange: (start: any, end: any) => void;
}
export interface DropdownBoxMultiWithSearchProps {
  list: dropdownItemInterface[];
  onChange: (items: dropdownItemInterface[]) => void;
  title: string;
  totalTitle: string;
  activeItems: dropdownItemInterface[];
  searchable?: boolean;
}
export interface DropdownBoxMultiWithSearch1Props {
  list: dropdownItemInterface[];
  onChange: (items: dropdownItemInterface[]) => void;
  title: string;
  totalTitle: string;
  maxCount?: number;
  maxErrMsg?: string;
  activeItems: dropdownItemInterface[];
  left?: number;
}
export interface DropdownBoxMultiWithSearchMobileProps {
  list: dropdownItemInterface[];
  onChange: (items: dropdownItemInterface[]) => void;
  title: string;
  totalTitle: string;
  activeItems: dropdownItemInterface[];
  searchable?: boolean;
}
export interface DropdownBoxMultiWithSearchMobile1Props {
  list: dropdownItemInterface[];
  onChange: (items: dropdownItemInterface[]) => void;
  title: string;
  totalTitle: string;
  maxCount?: number;
  maxErrMsg?: string;
  activeItems: dropdownItemInterface[];
  type?: string;
  isShowTotalTitle?: boolean;
  style?: object;
  searchable?: boolean;
}
export interface DropdownBoxWithSearchProps {
  label: string;
  list: dropdownItemInterface[];
  activeItem?: dropdownItemInterface;
  onChange: (item: dropdownItemInterface) => void;
  disableSearch?: boolean;
}
export interface DropdownBoxWithSearch1Props {
  label: string;
  list: dropdownItemInterface[];
  activeItem?: dropdownItemInterface;
  onChange: (item: dropdownItemInterface) => void;
  left?: number;
  isBlue?: boolean;
  top?: number;
  width?: number;
  maxHeight?: number;
  isCustomWidth?: boolean;
}
export interface DropdownBoxWithSearch2Props {
  label: string;
  list: dropdownItemInterface[];
  activeItem?: dropdownItemInterface | null;
  onChange: (item: dropdownItemInterface) => void;
  type?: number;
}
export interface DropdownBoxWithSearchMobileProps {
  label: string;
  list: dropdownItemInterface[];
  activeItem?: dropdownItemInterface;
  onChange: (item: dropdownItemInterface) => void;
}
export interface DropdownBoxWithSearchMobile1Props {
  label: string;
  list: dropdownItemInterface[];
  onChange: (item: dropdownItemInterface) => void;
  activeItem?: dropdownItemInterface;
  type?: string;
  isBlue?: boolean;
  hiddenReady?: boolean;
}
export interface DropdownBoxWithSearchMobile2Props {
  label: string;
  list: dropdownItemInterface[];
  activeItem?: dropdownItemInterface;
  onChange: (item: dropdownItemInterface) => void;
}
export interface FormTabProps {
  list: tabInterface[];
  activeItem: tabInterface;
  onClickTab: (value: tabInterface) => void;
}
export interface InputFieldProps {
  placeholder: string;
  errMsg: string;
  value: string;
  onChange: (val: string) => void;
  available?: boolean;
}
export interface NestedDropdownBoxMultiWithSearchProps {
  list: nestedDropdownItemInterface[];
  onChange: (items: nestedDropdownItemInterface[]) => void;
  title: string;
  totalTitle: string;
  maxCount?: number;
  maxErrMsg?: string;
  activeItems: nestedDropdownItemInterface[];
}
export interface NestedDropdownBoxMultiWithSearch1Props {
  list: nestedDropdownItemInterface[];
  onChange: (items: nestedDropdownItemInterface[]) => void;
  title: string;
  totalTitle: string;
  maxCount?: number;
  maxErrMsg?: string;
  activeItems: nestedDropdownItemInterface[];
  left?: number;
}
export interface NestedDropdownBoxMultiWithSearchMobileProps {
  list: nestedDropdownItemInterface[];
  onChange: (items: nestedDropdownItemInterface[]) => void;
  title: string;
  totalTitle: string;
  maxCount?: number;
  maxErrMsg?: string;
  activeItems: nestedDropdownItemInterface[];
}
export interface NestedDropdownBoxMultiWithSearchMobile1Props {
  list: nestedDropdownItemInterface[];
  onChange: (items: nestedDropdownItemInterface[]) => void;
  title: string;
  totalTitle: string;
  maxCount?: number;
  maxErrMsg?: string;
  activeItems: nestedDropdownItemInterface[];
  type?: string;
}
export interface PaginatorProps {
  pageNumber: number;
  pageCount: number;
  onClickPage: (num: number) => void;
}
export interface PasswordFieldProps {
  placeholder: string;
  errMsg: string;
  value: string;
  onChange: (val: string) => void;
  available?: boolean;
  onBlur?: (val: string) => void;
}
export interface PasswordFieldMobileProps {
  placeholder: string;
  errMsg: string;
  value: string;
  onChange: (val: string) => void;
  available?: boolean;
  onBlur?: (val: string) => void;
}
export interface RangeInputProps {
  fromPlaceholder: string;
  toPlaceholder: string;
  unit: string;
  onChangeFromVal: (val: number | undefined) => void;
  onChangeToVal: (val: number | undefined) => void;
  fromActiveVal?: number;
  toActiveVal?: number;
}
export interface RatingSelectorProps {
  value: number;
  onChange?: (val: number) => void;
  readOnly?: boolean;
  size?: 24 | 20 | 18 | 16 | 13;
  gap?: number;
  displayValue?: boolean;
  maxRating?: number;
  displayOnlyValue?: boolean;
  valueGap?: number;
}
export interface SearchInputProps {
  onSearch: (value: string) => void;
  onFocusEvent: (value: string) => void;
  clearSignal: number;
  initVal: string;
}
interface SearchInputState {
  inputState: SEARCHINPUTSTATETYPE;
  oldKeyword: string;
  keyword: string;
}
export interface SorterProps {
  position: "left" | "right";
  activeSortItem?: dropdownItemInterface;
  list: dropdownItemInterface[];
  onChange: (item: dropdownItemInterface) => void;
  left?: number;
}
export interface SwitchProps {
  on: boolean;
  onChange: (e: boolean) => void;
}
export interface ToggleTabProps {
  activeItem?: toggleItemInterface;
  list: toggleItemInterface[];
  onClick: (value: toggleItemInterface) => void;
}
export interface IHeaderItems {
  title: string;
  path: string;
}
export interface LayoutProps {
  children: ReactNode;
}
export interface LoginCodeFormProps {
  redirectUrl?: string;
  authToken: string;
}
export interface LoginFormProps {
  redirectUrl?: string;
  callbackFunc?: (token: string) => void;
}
export interface RegisterCodeFormProps {
  token: string;
  onClick: () => void;
}
export interface RegisterFormProps {
  callbackFunc: (token: string) => void;
}

export interface RegisterSlidesProps {
  redirectUrl?: string;
}

export interface RegisterTypeFormProps {
  redirectUrl?: string;
  callbackFunc?: () => void;
}
export interface ResetPwdFormProps {
  redirectUrl?: string;
  onClickCancel: () => void;
  callbackFunc: (authToken: string) => void;
}
export interface AuthModalProps {
  isOpen: boolean;
  closeModal: () => void;
  defaultTab: string;
  lastProduct?: string;
}
export interface BuyFlowSectionProps {
  productId: string;
  couponId?: string;
}
export interface ChatHistoryProps {
  chatId: string;
  onClickBack: () => void;
}
export interface ChatInputProps {
  onSend: (val: string) => void;
}
export interface ChatListProps {
  isLoading: boolean;
  chats: chatInterface[];
  onClickNew: () => void;
  onClickMember: (val: string) => void;
}
export interface ChatNewProps {
  chatTypes: chatTypeInterface[];
  onCancel: () => void;
  onAfterSend: (id: string) => void;
}
export interface InstructionStepProps {
  step: instructionStepInterface;
  stepNumber: number;
  platform: string;
}
export interface InstructionTabsProps {
  instructions: {
    [key: string]: instructionStepInterface[];
  };
  platform: string;
}
export interface OrderSectionProps {
  isLoading?: boolean;
  order?: orderInterface;
}
export interface SearchOptionHomeProps {
  onSearch: () => void;
}
export interface SearchOptionLeftProps {
  onSearch: () => void;
}
export interface StocksListProps {
  list: productStocksInterface[];
  deliveries: dropdownItemInterface[];
  activeItem?: productStocksInterface;
  onClick: (val: productStocksInterface) => void;
  onClickBuy: (val: productStocksInterface) => void;
}
export interface BrandsMenuProps {
  isLoading: boolean;
  activeBrands: brandInterface[];
  onSelect: (brands: brandInterface[]) => void;
  list: brandInterface[];
}
export interface BuyerCardProps {
  buyer?: buyerCardInterface;
  isLoading?: boolean;
  size: number;
}
export interface BuyerDetailCardProps {
  isLoading: boolean;
  buyerDetail?: buyerInterface;
}
export interface ChatMemberProps {
  isLoading?: boolean;
  chat?: chatInterface;
  onClick?: (val: string) => void;
}
export interface ChatMessageProps {
  msg: messageInterface;
}
export interface CopyIconButtonProps {
  val: string;
  size?: number;
}
export interface CouponCardProps {
  isLoading?: boolean;
  data?: couponInterface;
}
export interface FavoriteSymbolProps {
  showState: FAVORITESTATES;
}
export interface LoadingModalProps {
  isOpen: boolean;
}
export interface LostNetModalProps {
  isOpen: boolean;
}
export interface NavigatorBackProps {
  onOnePage?: boolean;
  onClick?: () => void;
  onClickEvent?: () => void;
}
export interface NotificationProps {
  notification?: notificationInterface;
  isLoading?: boolean;
  onClickHide?: (id: string) => void;
  fadeOutNotificationIds?: string[];
}
export interface OrderCardProps {
  order?: orderInterface;
  isLoading?: boolean;
}
export interface PaymentHistoryItemProps {
  payment: paymentHistoryInterface;
  operations: any;
  onClick: (val: paymentHistoryInterface) => void;
}
export interface PaymentSystemProps {
  ps: paymentSystemInterface;
  lackPrice: number;
  onClick: (ps: paymentSystemInterface, amount: number) => void;
}
export interface ProductItemProps {
  isLoading?: boolean;
  product?: productInterface;
  reviews?: reviewCardInterface[];
  reviewTotalCount?: number;
  onLoadMoreReviews?: () => void;
  stocksTips: tipStocksInterface;
  variants: dropdownItemInterface[];
  couponId?: string;
}
export interface ProductListItemProps {
  product?: productInterface;
  isLoading?: boolean;
  onClickItem?: (id: string) => void;
}
export interface ProductSimpleCardProps {
  isLoading?: boolean;
  product?: productInterface;
  isShowLabels: boolean;
  size?: number;
  toggleAuthModal?: (isOpen: boolean) => void;
  price?: number;
  desktopBuyerColor?: boolean;
  mobileBuyerColor?: boolean;
  desktopBuyerLink?: boolean;
  mobileBuyerLink?: boolean;
}
export interface ProgressBarProps {
  width: number;
}
export interface ReviewCardProps {
  isLoading?: boolean;
  review?: reviewCardInterface;
}
export interface ReviewSimpleProps {
  review: reviewSimpleCardInterface;
}
export interface SizeListProps {
  sizes: string[];
}
export interface SpinnerProps {
  color: string;
  size: number;
  innerColor: string;
  width?: number;
  blur?: boolean;
}
export interface StoryCardProps {
  isLoading?: boolean;
  story?: storyInterface;
}
export interface ToastProps {
  toasts: { id: string; title: string; type: TOASTTYPES }[];
  onClose: (id: string) => void;
}
export interface AuthModalProviderProps {
  children: ReactNode;
}
export interface DecodedToken {
  iss: string;
  iat: number;
  nbf: number;
  exp: number;
  id: string;
}
export type AuthContextType = {
  isLoggedIn: boolean;
  login: (access: string, refresh: string) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  getDecodedToken: () => DecodedToken | null | undefined;
  setIsLoggedIn: (val: boolean) => void;
};
export interface BlurProviderProps {
  children: ReactNode;
}
export interface DefaultTypeProviderProps {
  children: ReactNode;
}
export interface DropdownOpenProviderProps {
  children: ReactNode;
}
export interface FilterProviderProps {
  children: ReactNode;
}
export interface MenuProviderProps {
  children: ReactNode;
}
export interface ScrollProviderProps {
  children: ReactNode;
}
export interface StockProviderProps {
  children: ReactNode;
}
export interface TicketProviderProps {
  children: ReactNode;
}
export interface ToastContextType {
  showToast: (message: string, type: TOASTTYPES) => void;
}
export interface UserProviderProps {
  children: ReactNode;
}
export interface UrlParameter {
  [key: string]: string;
}
