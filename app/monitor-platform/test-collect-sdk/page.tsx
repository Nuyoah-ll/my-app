"use client";

import { Button } from "antd";

export default function TestCollectSDK() {
  const handleJSException = () => {
    throw new Error("Test JS Exception - 普通JS错误");
  };

  const handleUncaughtReject = () => {
    Promise.reject(new Error("Test Uncaught Reject - 未捕获的reject错误"));
  };

  const handleFetchError = () => {
    fetch("http://non-existent-host-12345.com/api/test", {
      method: "GET",
    });
  };

  const handleFetchError2 = () => {
    fetch("http://localhost:3000/api/404-not-exist", {
      method: "POST",
      body: JSON.stringify({ test: "data" }),
    });
  };

  const handleLinkResourceError = () => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "http://invalid-resource.com/nonexistent.css";
    document.head.appendChild(link);
  };

  const handleScriptResourceError = () => {
    const script = document.createElement("script");
    script.src = "http://invalid-resource.com/nonexistent.js";
    document.head.appendChild(script);
  };

  const handleImgResourceError = () => {
    const img = document.createElement("img");
    img.src = "http://invalid-resource.com/nonexistent.png";
    document.body.appendChild(img);
  };

  const handleVideoResourceError = () => {
    const video = document.createElement("video");
    video.src = "http://invalid-resource.com/nonexistent.mp4";
    document.body.appendChild(video);
    video.load();
  };

  const handleAudioResourceError = () => {
    const audio = document.createElement("audio");
    audio.src = "http://invalid-resource.com/nonexistent.mp3";
    document.body.appendChild(audio);
    audio.load();
  };

  const handleImageInstanceError = () => {
    const img = new Image();
    img.src = "http://invalid-resource.com/image-instance.png";
    document.body.appendChild(img);
  };

  const handleAudioInstanceError = () => {
    const audio = new Audio("http://invalid-resource.com/audio-instance.mp3");
    audio.load();
    document.body.appendChild(audio);
  };

  const handleImageInstanceSuccess = () => {
    const img = new Image();
    img.src = "http://localhost:3001/花朵.jpeg";
    document.body.appendChild(img);
  };

  const handleAudioInstanceSuccess = () => {
    const audio = new Audio("http://localhost:3001/花朵.mp4");
    audio.load();
    document.body.appendChild(audio);
  };

  const handleWhiteScreen = () => {
    document.body.innerHTML = "";
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 32, fontSize: 24, fontWeight: "bold" }}>
        Test Collect SDK
      </h1>

      <div style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 18, color: "#1f2937" }}>
          1. JS错误
        </h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Button type="primary" danger onClick={handleJSException}>
            触发普通JS错误
          </Button>
          <Button type="primary" danger onClick={handleUncaughtReject}>
            触发未捕获的reject错误
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 18, color: "#1f2937" }}>
          2. HTTP错误
        </h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Button type="primary" danger onClick={handleFetchError}>
            Fetch - 域名不存在
          </Button>
          <Button type="primary" danger onClick={handleFetchError2}>
            Fetch - 404接口
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 18, color: "#1f2937" }}>
          3. 静态资源错误（DOM标签方式）
        </h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Button type="primary" danger onClick={handleLinkResourceError}>
            Link标签 - CSS加载失败
          </Button>
          <Button type="primary" danger onClick={handleScriptResourceError}>
            Script标签 - JS加载失败
          </Button>
          <Button type="primary" danger onClick={handleImgResourceError}>
            Img标签 - 图片加载失败
          </Button>
          <Button type="primary" danger onClick={handleVideoResourceError}>
            Video标签 - 视频加载失败
          </Button>
          <Button type="primary" danger onClick={handleAudioResourceError}>
            Audio标签 - 音频加载失败
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 18, color: "#1f2937" }}>
          3. 静态资源错误（实例化对象方式）
        </h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Button type="primary" danger onClick={handleImageInstanceError}>
            new Image() - 图片加载失败
          </Button>
          <Button type="primary" danger onClick={handleAudioInstanceError}>
            new Audio() - 音频加载失败
          </Button>
        </div>
      </div>

        <div style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 18, color: "#1f2937" }}>
          3. 静态资源成功
        </h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Button type="primary" danger onClick={handleImageInstanceSuccess}>
            new Image() - 图片加载成功
          </Button>
          <Button type="primary" danger onClick={handleAudioInstanceSuccess}>
            new Audio() - 音频加载成功
          </Button>
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: 16, fontSize: 18, color: "#1f2937" }}>
          4. 白屏错误
        </h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Button type="primary" danger onClick={handleWhiteScreen}>
            触发白屏（清空body内容）
          </Button>
        </div>
        <p style={{ marginTop: 8, color: "#6b7280", fontSize: 12 }}>
          注意：此操作会清空页面所有内容，需刷新页面恢复
        </p>
      </div>
    </div>
  );
}