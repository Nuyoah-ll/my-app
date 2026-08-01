export interface UserInfo {
  id: number;
  phone: string;
  nick_name: string;
  icon: string;
}

/** 商户类型表 dianping_shop_type */
export interface ShopType {
  id: number;
  name: string;
  icon: string;
  sort: number;
  create_time?: string;
  update_time?: string;
}

/** 商户表 dianping_shop */
export interface Shop {
  id: number;
  name: string;
  type_id: number;
  images: string;
  area: string;
  address: string;
  x: number;
  y: number;
  avg_price: number;
  sold: number;
  comments: number;
  score: number;
  open_hours: string;
  create_time?: string;
  update_time?: string;
}

export type ShopDetail = Shop;

export interface Feed {
  id: number;
  title: string;
  cover: string;
  author: string;
  author_icon: string;
  likes: number;
  content: string;
}

export interface Voucher {
  id: number;
  title: string;
  discount: string;
  original_price: number;
  discount_price: number;
  valid_date: string;
  stock: number;
  sold: number;
}
