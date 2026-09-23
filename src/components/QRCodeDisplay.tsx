"use client";

import { useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, Link2 } from "lucide-react";
import styles from "./QRCodeDisplay.module.css";

interface QRCodeDisplayProps {
  url: string;
  size?: number;
}

export default function QRCodeDisplay({ url, size = 200 }: QRCodeDisplayProps) {
  const svgRef = useRef<HTMLDivElement>(null);

  function copyLink() {
    navigator.clipboard.writeText(url);
  }

  function downloadQR() {
    if (!svgRef.current) return;
    const svg = svgRef.current.querySelector("svg");
    if (!svg) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = size * 2;
      canvas.height = size * 2;
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "evisitors-qr.png";
      link.href = pngUrl;
      link.click();
      URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.qrContainer} ref={svgRef}>
        <QRCodeSVG
          value={url}
          size={size}
          bgColor="#ffffff"
          fgColor="#0f1629"
          level="H"
          marginSize={2}
        />
      </div>

      <div className={styles.urlBox}>
        <span className={styles.urlText}>{url}</span>
      </div>

      <div className={styles.actions}>
        <button className="btn btn-secondary" onClick={copyLink} id="copy-link-btn">
          <Link2 size={15} />
          Copy Link
        </button>
        <button className="btn btn-primary" onClick={downloadQR} id="download-qr-btn">
          <Download size={15} />
          Download QR
        </button>
      </div>
    </div>
  );
}
