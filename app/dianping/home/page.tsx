"use client";

import { useRouter } from "next/navigation";
import { Avatar, Input, Row, Col, Card, Empty } from "antd";
import {
  SearchOutlined,
  UserOutlined,
  EnvironmentOutlined,
  LikeOutlined,
} from "@ant-design/icons";
import { useRequest } from "ahooks";
import { request } from "@/app/utils/request";
import type { ShopType, Feed } from "../types";
import styles from "./page.module.scss";

export default function HomePage() {
  const router = useRouter();

  const { data: categories, loading: categoryLoading } = useRequest(
    () =>
      request<ShopType[]>(`http://localhost:3001/dianping/shop-types`, {
        method: "GET",
        credentials: "include",
      }),
  );

  const { data: shops, loading: shopLoading } = useRequest(
    () =>
      request<Feed[]>(`http://localhost:3001/dianping/shop/recommend`, {
        method: "GET",
        credentials: "include",
      }),
  );

  const handleCategoryClick = (category: ShopType) => {
    router.push(
      `/dianping/list?type_id=${category.id}`,
    );
  };

  const handleShopClick = (shop: Feed) => {
    router.push(`/dianping/shop/${shop.id}`);
  };

  const handleSearch = (value: string) => {
    if (value.trim()) {
      router.push(`/dianping/list?keyword=${encodeURIComponent(value.trim())}`);
    }
  };

  const displayCategories = categories ?? [];
  const displayShops = shops ?? [];

  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <div className={styles.location}>
          <EnvironmentOutlined />
          <span>杭州</span>
        </div>
        <Input.Search
          className={styles.search}
          placeholder="请输入商户名、地点"
          prefix={<SearchOutlined className={styles.searchIcon} />}
          onSearch={handleSearch}
          enterButton={false}
        />
        <Avatar
          className={styles.userAvatar}
          icon={<UserOutlined />}
          onClick={() => router.push("/dianping/me")}
        />
      </header>

      <section className={styles.categoriesSection}>
        {categoryLoading ? (
          <div className={styles.loadingContainer}>加载中...</div>
        ) : displayCategories.length === 0 ? (
          <Empty description="暂无分类" className={styles.emptyState} />
        ) : (
          <Row gutter={[8, 16]}>
            {displayCategories.map((cat) => (
              <Col
                key={cat.id}
                xs={4}
                sm={4}
                md={4}
                lg={4}
                className={styles.categoryCol}
              >
                <div
                  className={styles.categoryItem}
                  onClick={() => handleCategoryClick(cat)}
                >
                  <div className={styles.categoryIcon}>
                    <img
                      src={cat.icon}
                      alt={cat.name}
                      className={styles.categoryIconImg}
                    />
                  </div>
                  <span className={styles.categoryName}>{cat.name}</span>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </section>

      <section className={styles.feedSection}>
        <h2 className={styles.sectionTitle}>为你推荐</h2>
        {shopLoading ? (
          <div className={styles.loadingContainer}>加载中...</div>
        ) : displayShops.length === 0 ? (
          <Empty description="暂无推荐" className={styles.emptyState} />
        ) : (
          <Row gutter={[16, 16]}>
            {displayShops.map((shop) => (
              <Col
                key={shop.id}
                xs={12}
                sm={12}
                md={8}
                lg={8}
              >
                <Card
                  hoverable
                  className={styles.feedCard}
                  bodyStyle={{ padding: 0 }}
                  onClick={() => handleShopClick(shop)}
                >
                  <div className={styles.feedCover}>
                    <img
                      src={shop.cover}
                      alt={shop.title}
                      className={styles.feedImg}
                    />
                    <div className={styles.feedTitleOverlay}>
                      {shop.title}
                    </div>
                  </div>
                  <div className={styles.feedInfo}>
                    <div className={styles.feedMeta}>
                      <Avatar
                        size={24}
                        src={shop.author_icon}
                        icon={<UserOutlined />}
                      />
                      <span className={styles.feedAuthor}>
                        {shop.author}
                      </span>
                      <span className={styles.feedLikes}>
                        <LikeOutlined /> {shop.likes}
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </section>
    </div>
  );
}
