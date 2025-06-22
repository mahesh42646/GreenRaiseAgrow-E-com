'use client';

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Header from "./eng/components/header";
import Footer from "./eng/components/footer";
import Home from "./eng/components/home";
import Shop from "./eng/components/shop";
import Product from "./eng/components/product";
import Blog from "./eng/components/blog";
import Pages from "./eng/components/pages";

export default function MainPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // Extract the tab from the URL path
    const path = pathname.split('/')[1];
    if (path === '') {
      setActiveTab('home');
    } else if (['home', 'shop', 'product', 'blog', 'pages'].includes(path)) {
      setActiveTab(path);
    }
  }, [pathname]);

  useEffect(() => {
    // Update URL when active tab changes
    if (activeTab === 'home') {
      router.push('/');
    } else {
      router.push(`/${activeTab}`);
    }
  }, [activeTab, router]);

  // Render the appropriate component based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'shop':
        return <Shop />;
      case 'product':
        return <Product />;
      case 'blog':
        return <Blog />;
      case 'pages':
        return <Pages />;
      case 'home':
      default:
        return <Home />;
    }
  };

  return (
    <div>
      <Header />
      {renderContent()}
      <Footer />
    </div>
  );
}
