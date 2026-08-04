"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Checkbox, Form, message } from "antd";
import { UserOutlined, SafetyOutlined } from "@ant-design/icons";
import styles from "./login.module.scss";
import { request } from "@/app/utils/request";
import { useRequest } from "ahooks";

export default function LoginPage() {
  const [form] = Form.useForm();
  const [countdown, setCountdown] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  const handleSendCode = useCallback(async () => {
    const values = await form.validateFields(["phone"]);
    const res = await request<unknown>(
      `http://localhost:3001/auth/verify-code?phone=${encodeURIComponent(values.phone)}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    message.success(`验证码已发送:${res}`);
    setCountdown(10);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [form]);

  const { runAsync: handleLogin, loading } = useRequest(
    async () => {
      if (!agreed) {
        message.error("请先阅读并同意用户服务协议");
        return;
      }
      const values = await form.validateFields();
      await request<unknown>(`http://localhost:3001/auth/login`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(values),
      });
      message.success("登录成功");
      router.push("/");
    },
    {
      manual: true,
    },
  );

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1 className={styles.title}>手机号码快捷登录</h1>
        </div>

        <div className={styles.formBody}>
          <Form form={form} layout="vertical" className={styles.loginForm}>
            <Form.Item
              validateFirst
              name="phone"
              rules={[
                { required: true, message: "请输入手机号" },
                {
                  validator: (_, value) => {
                    if (value?.length !== 11) {
                      return Promise.reject("请输入正确的手机号");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <div className={styles.phoneInputWrapper}>
                <Input
                  className={styles.phoneInput}
                  size="large"
                  placeholder="请输入手机号"
                  prefix={<UserOutlined className={styles.inputIcon} />}
                  maxLength={11}
                  type="tel"
                />
                <Button
                  className={styles.sendCodeBtn}
                  size="large"
                  type="primary"
                  disabled={countdown > 0}
                  onClick={handleSendCode}
                >
                  {countdown > 0 ? `${countdown}s 后重试` : "发送验证码"}
                </Button>
              </div>
            </Form.Item>

            <Form.Item
              validateFirst
              name="verifyCode"
              rules={[{ required: true, message: "请输入验证码" }]}
            >
              <Input
                size="large"
                placeholder="请输入验证码"
                prefix={<SafetyOutlined className={styles.inputIcon} />}
                maxLength={6}
              />
            </Form.Item>

            <div className={styles.tip}>未注册的手机号验证后自动创建账户</div>

            <Form.Item>
              <Button
                className={styles.loginBtn}
                size="large"
                type="primary"
                block
                loading={loading}
                onClick={handleLogin}
              >
                登录
              </Button>
            </Form.Item>

            <div className={styles.passwordLoginLink}>
              <span>密码登录</span>
            </div>
          </Form>
        </div>

        <div className={styles.footer}>
          <Checkbox
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          >
            我已阅读并同意
            <a className={styles.link} href="#user-agreement">
              《用户服务协议》
            </a>
            和
            <a className={styles.link} href="#privacy-policy">
              《隐私政策》
            </a>
          </Checkbox>
        </div>
      </div>
    </div>
  );
}
