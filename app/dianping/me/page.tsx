/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Button, Tabs, Modal, Empty, message } from "antd";
import {
  EditOutlined,
  LogoutOutlined,
  UserOutlined,
  FileTextOutlined,
  StarOutlined,
  TeamOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import styles from "./page.module.scss";
import { request } from "@/app/utils/request";
import { UserInfo } from "../types";

export default function MePage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getUserInfo = useCallback(async () => {
    setLoading(true);
    try {
      const info = await request<UserInfo>(
        `http://localhost:3001/auth/user-info`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (info) {
        setUser(info);
      }
    } catch {
      // error already handled by request utility
    } finally {
      setLoading(false);
    }
  }, []);

  const doLogout = useCallback(async () => {
    await request<void>(`http://localhost:3001/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  }, []);

  const handleLogout = useCallback(() => {
    Modal.confirm({
      title: "确认退出登录？",
      content: "退出后需要重新登录才能使用",
      okText: "确认退出",
      cancelText: "取消",
      onOk: () => {
        doLogout();
        setUser(null);
        message.success("已退出登录");
        router.push("/dianping/login");
      },
    });
  }, [router]);

  const handleEditProfile = useCallback(() => {
    message.info("编辑资料功能开发中");
  }, []);

  const handleGoLogin = useCallback(() => {
    router.push("/dianping/login");
  }, [router]);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  const tabItems = [
    {
      key: "notes",
      label: (
        <span>
          <FileTextOutlined /> 笔记
        </span>
      ),
      children: <Empty description="暂无笔记" className={styles.emptyState} />,
    },
    {
      key: "reviews",
      label: (
        <span>
          <StarOutlined /> 评价
        </span>
      ),
      children: <Empty description="暂无评价" className={styles.emptyState} />,
    },
    {
      key: "followers",
      label: (
        <span>
          <TeamOutlined /> 粉丝（0）
        </span>
      ),
      children: <Empty description="暂无粉丝" className={styles.emptyState} />,
    },
    {
      key: "following",
      label: (
        <span>
          <HeartOutlined /> 关注（0）
        </span>
      ),
      children: <Empty description="暂无关注" className={styles.emptyState} />,
    },
  ];

  if (loading) {
    return (
      <div className={styles.me}>
        <div className={styles.loadingContainer}>加载中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.me}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="用户未登录">
          <Button type="primary" onClick={handleGoLogin}>
            去登录
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className={styles.me}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.userInfo}>
            <Avatar
              size={96}
              src={user.icon}
              icon={<UserOutlined />}
              className={styles.avatar}
            />
            <div className={styles.userMeta}>
              <h2 className={styles.username}>{user.nick_name}</h2>
              {/* {user.city && (
                <div className={styles.location}>
                  <EnvironmentOutlined /> {user.city}
                </div>
              )} */}
            </div>
          </div>

          <div className={styles.actions}>
            <Button
              icon={<EditOutlined />}
              onClick={handleEditProfile}
              className={styles.editBtn}
            >
              编辑资料
            </Button>
            <Button
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className={styles.logoutBtn}
              danger
            >
              退出登录
            </Button>
          </div>
        </div>

        <div className={styles.bio}>
          <p className={styles.bioPlaceholder}>
              添加个人简介，让大家更好的认识你
            </p>
        </div>

        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>0</span>
            <span className={styles.statLabel}>笔记</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>0</span>
            <span className={styles.statLabel}>评价</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>0</span>
            <span className={styles.statLabel}>粉丝</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>0</span>
            <span className={styles.statLabel}>关注</span>
          </div>
        </div>
      </div>

      <div className={styles.contentCard}>
        <Tabs
          defaultActiveKey="notes"
          items={tabItems}
          className={styles.tabs}
        />
      </div>
    </div>
  );
}
