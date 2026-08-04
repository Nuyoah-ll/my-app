"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Flex, Spin, Button, Modal, message } from "antd";
import type { MenuProps } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import Link from "next/link";

const LOGIN_PATH = "/dianping/login";
const USER_INFO_URL = "http://localhost:3001/auth/user-info";
const LOGOUT_URL = "http://localhost:3001/auth/logout";

type MenuItem = Required<MenuProps>["items"][number];

const allMenuItems: MenuItem[] = [
  { key: "/", label: <Link href="/">Home</Link> },
  {
    key: "/copywriting",
    label: <Link href="/copywriting">Copywriting</Link>,
  },
  {
    key: "/monitor-platform",
    label: "Monitor Platform",
    children: [
      {
        key: "monitor-platform/test-collect-sdk",
        label: (
          <Link href="/monitor-platform/test-collect-sdk">
            Test Collect SDK
          </Link>
        ),
      },
    ],
  },
  {
    key: "/dianping",
    label: <div>用户点评项目（练习redis）</div>,
    children: [
      {
        key: "/dianping/home",
        label: <Link href="/dianping/home">首页</Link>,
      },
      {
        key: "/dianping/list",
        label: <Link href="/dianping/list">商户列表</Link>,
      },
    ],
  },
  { key: "/dianping/me", label: <Link href="/dianping/me">我的页面</Link> },
];

type AuthState = "loading" | "logged" | "guest";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>("loading");

  // 进入任何页面都先调获取用户信息接口：
  // - 能获取到 → 展示对应页面
  // - 获取不到 → 跳转登录页
  // 注意：重定向必须在此 effect 内、当前路由的 fetch 真正返回 guest 后再执行，
  // 不能用单独的 effect 读 authState——否则登录成功 push 到首页时，authState
  // 还是登录页遗留的 "guest"，会立刻被误判并 replace 回登录页。
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let logged = false;
      try {
        const res = await fetch(USER_INFO_URL, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        logged = res.ok && data?.code === 0 && !!data?.data;
      } catch {
        logged = false;
      }
      if (cancelled) return;
      if (logged) {
        setAuthState("logged");
      } else {
        setAuthState("guest");
        if (pathname !== LOGIN_PATH) {
          router.replace(LOGIN_PATH);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  const handleLogout = useCallback(() => {
    Modal.confirm({
      title: "确认退出登录？",
      content: "退出后需要重新登录才能使用",
      okText: "确认退出",
      cancelText: "取消",
      onOk: async () => {
        try {
          await fetch(LOGOUT_URL, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });
        } catch {
          // 网络异常也清除本地态，允许重新登录
        }
        message.success("已退出登录");
        setAuthState("guest");
        router.replace(LOGIN_PATH);
      },
    });
  }, [router]);

  // 登录页不展示菜单，内容区整宽展示
  if (pathname === LOGIN_PATH) {
    return <div style={{ width: "100%", padding: 12 }}>{children}</div>;
  }

  // loading 或未登录访问受保护路由（等待重定向）期间展示 loading，
  // 避免受保护内容闪现
  if (authState !== "logged") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Flex flex={1} gap={12}>
      <div
        style={{
          width: "240px",
          height: "100vh",
          position: "sticky",
          top: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Menu
          style={{
            flex: 1,
            minWidth: 0,
            overflowY: "auto",
            borderRight: "1px solid #f0f0f0",
          }}
          mode="vertical"
          items={allMenuItems}
        />
        <div style={{ padding: 12, borderTop: "1px solid #f0f0f0" }}>
          <Button
            block
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            退出登录
          </Button>
        </div>
      </div>
      <div style={{ width: "calc(100% - 240px)", padding: 12 }}>{children}</div>
    </Flex>
  );
}
