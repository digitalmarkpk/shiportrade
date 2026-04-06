import { Metadata } from "next";
import { ContainersBuyPage } from "./ContainersBuyPage";

export const metadata: Metadata = {
  title: "Buy Shipping Containers | Container Marketplace | Shiportrade",
  description: "Browse hundreds of shipping containers for sale. Buy new and used 20ft, 40ft, high cube, reefer, and special containers from verified sellers worldwide. Competitive prices, global shipping.",
  keywords: [
    "buy shipping containers",
    "containers for sale",
    "20ft container for sale",
    "40ft container for sale",
    "used containers",
    "new containers",
    "container trading",
    "shipping container price",
    "container marketplace",
    "CSC certified containers",
  ],
  openGraph: {
    title: "Buy Shipping Containers | Container Marketplace | Shiportrade",
    description: "Browse hundreds of shipping containers for sale. Buy new and used containers from verified sellers worldwide.",
    type: "website",
    url: "https://shiportrade.com/marketplace/containers/buy",
  },
};

export default function Page() {
  return <ContainersBuyPage />;
}
