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
  shop_id: number;
  title: string;
  sub_title: string;
  /** 面值（分） */
  actual_value: number;
  /** 支付价（分） */
  pay_value: number;
  type: number;
  status: number;
  stock: number | null;
  begin_time: string | null;
  end_time: string | null;
  rules: string;
  create_time?: string;
  update_time?: string;
}
