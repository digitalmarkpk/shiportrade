import { Metadata } from "next";
import LogoDownload from "./LogoDownload";

export const metadata: Metadata = {
  title: "Shiportrade Logo - Download High Resolution Brand Assets",
  description: "Download Shiportrade logo in high resolution PNG, SVG formats. Perfect for social media, presentations, and marketing materials.",
};

export default function LogoPage() {
  return <LogoDownload />;
}
