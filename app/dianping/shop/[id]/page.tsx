/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useParams, useRouter } from "next/navigation";
import { Rate, Button, Empty, Divider, message, Image } from "antd";
import {
  LeftOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CarOutlined,
  CalendarOutlined,
  ShareAltOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useRequest } from "ahooks";
import { request } from "@/app/utils/request";
import type { ShopDetail, Voucher } from "../../types";
import styles from "./page.module.scss";
import { useEffect, useState } from "react";

export default function ShopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const shopId = params.id as string;
  const [shop, setShop] = useState<ShopDetail>();

  const { run: getShopDetail, loading } = useRequest(
    async () => {
      console.log("触发急促", shopId);
      const res = await request<ShopDetail>(
        `http://localhost:3001/dianping/shop/detail?shopId=${shopId}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      setShop(res);
    },
    { manual: true },
  );

  const { data: vouchers, loading: voucherLoading } = useRequest(
    () =>
      request<Voucher[]>(
        `http://localhost:3001/dianping/shop/${shopId}/vouchers`,
        {
          method: "GET",
          credentials: "include",
        },
      ),
    { refreshDeps: [shopId] },
  );

  const displayVouchers = vouchers ?? [];

  useEffect(() => {
    if (shopId) {
      // 模拟高并发场景
      // new Array(50).fill(null).forEach(() => getShopDetail());
      getShopDetail();
    }
  }, [shopId]);

  const handlePurchase = (voucher: Voucher) => {
    message.success(`已抢 ${voucher.title}`);
  };

  const handleShare = () => {
    message.success("分享链接已复制");
  };

  const handleFav = () => {
    message.success("已加入收藏");
  };

  const imageList = shop?.images
    ? shop.images.split(",").filter((s) => s.trim())
    : [];

  if (loading) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.loadingContainer}>加载中...</div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className={styles.detailPage}>
        <Empty description="商户不存在" />
      </div>
    );
  }

  return (
    <div className={styles.detailPage}>
      <header className={styles.header}>
        <Button
          icon={<LeftOutlined />}
          className={styles.backBtn}
          onClick={() => router.back()}
        >
          返回
        </Button>
        <h1 className={styles.shopTitle}>{shop.name}</h1>
        <div className={styles.headerActions}>
          <Button
            icon={<ShareAltOutlined />}
            className={styles.actionBtn}
            onClick={handleShare}
          />
          <Button
            icon={<StarOutlined />}
            className={styles.actionBtn}
            onClick={handleFav}
          />
        </div>
      </header>

      <section className={styles.mainInfo}>
        <div className={styles.coverSection}>
          <div className={styles.mainCover}>
            <Image
              src={imageList[0]}
              alt={shop.name}
              className={styles.coverImg}
            />
          </div>
          <div className={styles.thumbList}>
            {imageList.slice(1, 4).map((img, idx) => (
              <div key={idx} className={styles.thumbItem}>
                <Image src={img} alt={`thumb-${idx}`} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.ratingSection}>
          <h2 className={styles.shopName}>{shop.name}</h2>
          <div className={styles.ratingRow}>
            <Rate
              allowHalf
              disabled
              value={shop.score / 10}
              className={styles.rate}
            />
            <span className={styles.ratingNumber}>
              {(shop.score / 10).toFixed(1)}
            </span>
            <span className={styles.reviewCount}>{shop.comments}条评价</span>
            <span className={styles.priceAvg}>人均 ¥{shop.avg_price}</span>
          </div>
        </div>

        <div className={styles.statsSection}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{shop.comments}</span>
            <span className={styles.statLabel}>评价</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{shop.sold}</span>
            <span className={styles.statLabel}>销量</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{imageList.length}</span>
            <span className={styles.statLabel}>图片</span>
          </div>
        </div>
      </section>

      <Divider className={styles.divider} />

      <section className={styles.infoSection}>
        <div className={styles.infoRow}>
          <EnvironmentOutlined className={styles.infoIcon} />
          <span className={styles.infoText}>
            {shop.area} {shop.address}
          </span>
          <Button
            icon={<CarOutlined />}
            className={styles.navBtn}
            onClick={() => message.info("导航功能开发中")}
          >
            导航
          </Button>
        </div>

        <div className={styles.infoRow}>
          <ClockCircleOutlined className={styles.infoIcon} />
          <span className={styles.infoText}>营业时间：{shop.open_hours}</span>
        </div>
      </section>

      <Divider className={styles.divider} />

      <section className={styles.voucherSection}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.couponIcon}>🎫</span> 代金券
        </h3>

        {voucherLoading ? (
          <div className={styles.loadingContainer}>加载中...</div>
        ) : displayVouchers.length === 0 ? (
          <Empty description="暂无代金券" className={styles.emptyState} />
        ) : (
          <div className={styles.voucherList}>
            {displayVouchers.map((voucher) => (
              <div key={voucher.id} className={styles.voucherCard}>
                <div className={styles.voucherInfo}>
                  <div className={styles.voucherTitle}>{voucher.title}</div>
                  <div className={styles.voucherDate}>
                    <CalendarOutlined /> {voucher.valid_date}均可用
                  </div>
                </div>
                <div className={styles.voucherPrice}>
                  <div className={styles.priceRow}>
                    <span className={styles.originalPrice}>
                      ¥{voucher.original_price.toFixed(2)}
                    </span>
                    <span className={styles.discountTag}>
                      {voucher.discount}
                    </span>
                  </div>
                  <div className={styles.discountPrice}>
                    ¥{voucher.discount_price.toFixed(2)}
                  </div>
                </div>
                <div className={styles.voucherAction}>
                  <div className={styles.soldInfo}>
                    已售 {voucher.sold}/{voucher.stock}
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    className={styles.purchaseBtn}
                    onClick={() => handlePurchase(voucher)}
                  >
                    抢购
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
