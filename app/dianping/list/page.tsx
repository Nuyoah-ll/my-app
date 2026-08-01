"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { List, Card, Rate, Empty, Button, Image } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";
import { request } from "@/app/utils/request";
import type { Shop } from "../types";
import styles from "./page.module.scss";

type SortType = "default" | "distance" | "popular" | "rating";

const SORT_OPTIONS: { key: SortType; label: string }[] = [
  { key: "default", label: "综合排序" },
  { key: "distance", label: "距离最近" },
  { key: "popular", label: "人气最高" },
  { key: "rating", label: "评分最高" },
];

export default function ListPage() {
  const router = useRouter();
  const [sortType, setSortType] = useState<SortType>("default");

  const { data, loading } = useRequest(
    async () => {
      const res = await request<{
        list: Shop[];
        total: number;
      }>(`http://localhost:3001/dianping/shop/list?sort=${sortType}`, {
        method: "GET",
        credentials: "include",
      });
      return {
        list: res?.list ?? [],
        total: res?.total ?? 0,
      };
    },
    { refreshDeps: [sortType] },
  );

  const handleSortChange = (key: SortType) => {
    setSortType(key);
  };

  const handleShopClick = (shop: Shop) => {
    router.push(`/dianping/shop/${shop.id}`);
  };

  return (
    <div className={styles.listPage}>
      <header className={styles.header}>
        <h1 className={styles.title}>全部商户</h1>
        <div className={styles.filterBar}>
          {SORT_OPTIONS.map((opt) => (
            <Button
              key={opt.key}
              type={sortType === opt.key ? "primary" : "default"}
              className={
                sortType === opt.key ? styles.filterBtnActive : styles.filterBtn
              }
              onClick={() => handleSortChange(opt.key)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </header>

      <div className={styles.shopList}>
        <List
          loading={loading}
          dataSource={data?.list ?? []}
          locale={{ emptyText: <Empty description="暂无商户" /> }}
          renderItem={(shop) => (
            <List.Item
              className={styles.shopItem}
              onClick={() => handleShopClick(shop)}
            >
              <Card
                hoverable
                className={styles.shopCard}
                bodyStyle={{ padding: 16 }}
              >
                <div className={styles.shopContent}>
                  <div className={styles.shopCover}>
                    <Image
                      src={shop.images.split(",")[0]}
                      alt={shop.name}
                      className={styles.coverImg}
                    />
                  </div>
                  <div className={styles.shopInfo}>
                    <h3 className={styles.shopName}>{shop.name}</h3>
                    <div className={styles.shopRating}>
                      <Rate allowHalf disabled value={shop.score / 10} />
                      <span className={styles.ratingValue}>{(shop.score / 10).toFixed(1)}</span>
                      <span className={styles.reviewCount}>
                        {shop.comments}条
                      </span>
                    </div>
                    <div className={styles.shopMeta}>
                      <span className={styles.price}>¥{shop.avg_price}/人</span>
                      <span className={styles.district}>{shop.area}</span>
                    </div>
                    <div className={styles.shopAddress}>
                      <SearchOutlined /> {shop.address}
                    </div>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
