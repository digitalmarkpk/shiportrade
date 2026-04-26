"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function HomePage() {
  const [breakingNews, setBreakingNews] = useState<any[]>([]);
  const [tickerPaused, setTickerPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Mock news data
  const mockNews = [
    { id: "1", title: "Red Sea diversions push rates up 23%", excerpt: "Container freight rates surge as vessels reroute", category: "Ocean Freight", source: "Lloyd's List", publishedAt: new Date(Date.now() - 2*60*60*1000), isAlert: true, imageUrl: "https://picsum.photos/id/10/400/200" },
    { id: "2", title: "Panama Canal restrictions eased", excerpt: "Drought measures reduced, transit capacity increases", category: "Logistics", source: "Journal of Commerce", publishedAt: new Date(Date.now() - 5*60*60*1000), isAlert: false, imageUrl: "https://picsum.photos/id/11/400/200" },
    { id: "3", title: "EU ETS surcharge updates for 2026", excerpt: "Shipping lines announce new emission fees", category: "Sustainability", source: "TradeWinds", publishedAt: new Date(Date.now() - 24*60*60*1000), isAlert: false, imageUrl: "https://picsum.photos/id/12/400/200" }
  ];

  useEffect(() => {
    setBreakingNews(mockNews.filter(n => n.isAlert));
    // Load dark mode preference
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", String(newMode));
  };

  // World clock
  const hubs = [
    { city: "Shanghai", tz: "Asia/Shanghai", flag: "🇨🇳" },
    { city: "Rotterdam", tz: "Europe/Amsterdam", flag: "🇳🇱" },
    { city: "Singapore", tz: "Asia/Singapore", flag: "🇸🇬" },
    { city: "Los Angeles", tz: "America/Los_Angeles", flag: "🇺🇸" }
  ];
  const [clockTimes, setClockTimes] = useState<string[]>([]);
  useEffect(() => {
    const update = () => {
      setClockTimes(hubs.map(h => 
        new Date().toLocaleTimeString('en-US', { timeZone: h.tz, hour: '2-digit', minute: '2-digit', hour12: false })
      ));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Search suggestions
  const suggestions = ['CBM Calculator', 'HS Code Finder', 'Container Tracking', 'Ocean Freight Rates', 'Port Directory'].filter(item =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = winScroll / height;
      const progressBar = document.getElementById('progressBar');
      if (progressBar) progressBar.style.transform = `scaleX(${scrolled})`;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Reading Progress Bar */}
      <div id="progressBar" className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0F4C81] via-[#2E8B57] to-[#0F4C81] z-50 origin-left" style={{ transform: 'scaleX(0)' }} />

      {/* Breaking News Ticker */}
      {breakingNews.length > 0 && (
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-2 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 flex-shrink-0 bg-white/20 px-3 py-1 rounded-full">
                <i className="fas fa-exclamation-triangle text-sm animate-pulse"></i>
                <span className="font-bold text-sm">BREAKING</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className={`flex gap-8 whitespace-nowrap ${tickerPaused ? '' : 'animate-marquee'}`}>
                  {breakingNews.map((news, idx) => (
                    <Link key={idx} href="#" className="hover:underline font-medium text-sm">
                      🔥 {news.title}
                    </Link>
                  ))}
                  {breakingNews.map((news, idx) => (
                    <Link key={`dup-${idx}`} href="#" className="hover:underline font-medium text-sm">
                      🔥 {news.title}
                    </Link>
                  ))}
                </div>
              </div>
              <button onClick={() => setTickerPaused(!tickerPaused)} className="h-6 w-6 text-white/80 hover:text-white flex-shrink-0">
                <i className={`fas fa-${tickerPaused ? 'play' : 'pause'} text-xs`}></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0F4C81]/5 via-white to-[#2E8B57]/5 dark:via-slate-900">
        <div className="container mx-auto px-4 py-10 md:py-16">
          {/* Top bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3 md:gap-4">
              {hubs.map((hub, idx) => (
                <div key={hub.city} className="flex items-center gap-1.5 text-xs bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded-full">
                  <span>{hub.flag}</span>
                  <span className="font-mono">{clockTimes[idx] || '--:--'}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleDarkMode} className="rounded-full p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 transition">
                <i className={`fas fa-${isDarkMode ? 'sun' : 'moon'} text-slate-700 dark:text-slate-200 text-lg`}></i>
              </button>
              <button className="rounded-full p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 transition">
                <i className="fas fa-keyboard text-slate-700 dark:text-slate-200 text-lg"></i>
              </button>
            </div>
          </div>

          {/* Hero content */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
              Global Logistics Tools
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
              Calculate freight, find ports, check HS codes — all in one place
            </p>

            {/* Search bar */}
            <div className="relative max-w-2xl mx-auto mb-6">
              <div className="relative">
                <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search calculators, tools, ports, HS codes..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-14 pr-24 h-16 text-lg rounded-2xl border-2 border-[#0F4C81]/20 focus:border-[#0F4C81] w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xl"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block">
                  <kbd className="px-2 py-1.5 text-xs font-mono bg-slate-100 dark:bg-slate-800 rounded-lg border">Ctrl+K</kbd>
                </div>
              </div>
              {showSuggestions && searchQuery && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 p-2">
                  {suggestions.map(s => (
                    <Link key={s} href="#" className="block p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                      {s}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Quick pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {["CBM Calculator", "Container Planner", "HS Code", "Port Finder", "Landed Cost"].map((tool, idx) => (
                <Link key={idx} href="#" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#0F4C81]/20 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 text-sm font-medium">
                  <i className="fas fa-box text-[#0F4C81]"></i> {tool}
                </Link>
              ))}
            </div>

            {/* Stats counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {[
                { icon: "fa-calculator", label: "Calculators+", target: 82 },
                { icon: "fa-file-alt", label: "Documents+", target: 72 },
                { icon: "fa-newspaper", label: "News Sources+", target: 40 },
                { icon: "fa-dollar-sign", label: "Currencies+", target: 50 }
              ].map((stat, idx) => (
                <div key={idx} className="text-center p-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-xl shadow-md">
                  <i className={`fas ${stat.icon} text-[#0F4C81] text-xl mb-1 block`}></i>
                  <div className="text-xl font-bold">{stat.target}+</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Market Data Strip */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b shadow-sm py-3">
        <div className="container mx-auto px-4 flex justify-center gap-6 md:gap-10 flex-wrap">
          {[
            { name: "FBX", value: "3,920", change: "+2.4%", up: true },
            { name: "BDI", value: "1,847", change: "-1.2%", up: false },
            { name: "EUR/USD", value: "1.0842", change: "+0.12%", up: true },
            { name: "WTI", value: "$79.20", change: "+0.8%", up: true }
          ].map((idx, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-sm text-slate-500">{idx.name}</span>
              <span className="font-bold">{idx.value}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${idx.up ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20'}`}>
                {idx.change}
              </span>
            </div>
          ))}
          <Link href="#" className="text-xs text-slate-500 hover:text-slate-900">More Data <i className="fas fa-chevron-right text-[10px]"></i></Link>
        </div>
      </div>

      <main>
        {/* Map Section */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2"><i className="fas fa-globe text-[#0F4C81]"></i> Global Port Activity</h2>
                <p className="text-slate-500">Live view of 1,354 major hubs</p>
              </div>
              <Link href="#" className="text-sm border rounded-lg px-4 py-2">View All Ports <i className="fas fa-chevron-right ml-1"></i></Link>
            </div>
            <div className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] rounded-xl overflow-hidden h-[400px] flex items-center justify-center text-white text-xl font-bold shadow-lg">
              🌍 Interactive World Map (Live Demo)
            </div>
          </div>
        </section>

        {/* Trade Tools Grid */}
        <section className="py-10 bg-slate-50 dark:bg-slate-800/30">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <div><h2 className="text-2xl font-bold flex items-center gap-2"><i className="fas fa-calculator text-[#0F4C81]"></i> Trade Tools</h2><p className="text-slate-500">Essential calculators for logistics professionals</p></div>
              <Link href="#" className="text-sm border rounded-lg px-4 py-2">All 82+ Tools →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Distance & Time", desc: "Transit times", icon: "fa-ship", color: "blue" },
                { name: "Volumetric Weight", desc: "Air freight charge", icon: "fa-weight-hanging", color: "purple" },
                { name: "Freight Rates", desc: "Compare rates", icon: "fa-chart-line", color: "green" },
                { name: "Currency", desc: "Live exchange", icon: "fa-dollar-sign", color: "amber" },
                { name: "Incoterms", desc: "Trade terms", icon: "fa-globe-americas", color: "pink" },
                { name: "Demurrage", desc: "Storage fees", icon: "fa-clock", color: "red" },
                { name: "Tracking", desc: "Container tracking", icon: "fa-map-marker-alt", color: "cyan" },
                { name: "Documents", desc: "Generate docs", icon: "fa-file-invoice", color: "emerald" }
              ].map((tool, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-md text-center hover:shadow-xl transition cursor-pointer">
                  <div className={`w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center bg-${tool.color}-100 dark:bg-${tool.color}-900/30`}>
                    <i className={`fas ${tool.icon} text-2xl text-${tool.color}-600`}></i>
                  </div>
                  <h3 className="font-semibold">{tool.name}</h3>
                  <p className="text-xs text-slate-500">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Calculators */}
        <section className="py-10 bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5">
          <div className="container mx-auto px-4 text-center">
            <span className="inline-block bg-[#0F4C81]/10 text-[#0F4C81] text-xs px-3 py-1 rounded-full mb-3"><i className="fas fa-sparkle mr-1"></i> Featured</span>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Most Used Calculators</h2>
            <p className="text-slate-500 max-w-xl mx-auto mb-8">Tools logistics professionals rely on daily</p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "CBM Calculator", desc: "Calculate cubic meters & container fit", icon: "fa-boxes", color: "blue", features: ["Volume calculation", "Container fit"] },
                { title: "Container Load Planner", desc: "Optimize pallet placement", icon: "fa-pallet", color: "green", features: ["Pallet optimization", "Maximize space"] },
                { title: "HS Code Finder", desc: "Find customs codes for products", icon: "fa-hashtag", color: "purple", features: ["Product search", "Duty rates"] }
              ].map((calc, idx) => (
                <div key={idx} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-${calc.color}-100 mb-4 mx-auto`}>
                    <i className={`fas ${calc.icon} text-3xl text-${calc.color}-600`}></i>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{calc.title}</h3>
                  <p className="text-sm text-slate-500">{calc.desc}</p>
                  <div className="mt-4 text-left text-xs space-y-1">
                    {calc.features.map((f, i) => (
                      <div key={i}><i className="fas fa-check-circle text-green-600"></i> {f}</div>
                    ))}
                  </div>
                  <div className="mt-4 text-[#0F4C81] font-medium">Open Tool <i className="fas fa-arrow-right ml-1"></i></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Trade News */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <div><h2 className="text-2xl font-bold flex items-center gap-2"><i className="fas fa-newspaper text-[#0F4C81]"></i> Latest Trade News</h2><p className="text-slate-500">Real-time updates from global sources</p></div>
              <Link href="#" className="text-sm border rounded-lg px-4 py-2">View All News →</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {mockNews.map((news) => (
                <div key={news.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden">
                  <div className="h-44 bg-cover bg-center relative" style={{ backgroundImage: `url(${news.imageUrl})` }}>
                    <div className="absolute top-3 left-3"><span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">{news.category}</span></div>
                    {news.isAlert && <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded animate-pulse">ALERT</span>}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold">{news.title}</h3>
                    <p className="text-sm text-slate-500 my-2">{news.excerpt}</p>
                    <div className="flex justify-between text-xs">
                      <span>{news.source}</span>
                      <span>{news.publishedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Knowledge Hub */}
        <section className="py-10 bg-slate-50 dark:bg-slate-800/30">
          <div className="container mx-auto px-4 text-center">
            <span className="inline-block bg-[#2E8B57]/10 text-[#2E8B57] text-xs px-3 py-1 rounded-full mb-3"><i className="fas fa-graduation-cap mr-1"></i> Learn Trade</span>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Essential Trade Knowledge</h2>
            <p className="text-slate-500 max-w-2xl mx-auto mb-8">Master international trade, shipping, and logistics</p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Incoterms 2020", desc: "Understand 11 international trade terms", icon: "fa-globe", color: "[#0F4C81]" },
                { title: "HS Codes Guide", desc: "Classify products for customs", icon: "fa-chart-simple", color: "[#2E8B57]" },
                { title: "Container Types", desc: "ISO container specifications", icon: "fa-box", color: "purple-600" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow hover:shadow-xl transition cursor-pointer">
                  <i className={`fas ${item.icon} text-3xl text-${item.color} mb-3`}></i>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                  <div className="mt-4 text-[#0F4C81]">Learn More <i className="fas fa-arrow-right ml-1"></i></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industry Directories */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><i className="fas fa-building text-[#0F4C81]"></i> Industry Directories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Global Ports", count: "500+", icon: "fa-anchor" },
                { name: "Shipping Lines", count: "150+", icon: "fa-ship" },
                { name: "Freight Forwarders", count: "200+", icon: "fa-truck" },
                { name: "Customs Brokers", count: "100+", icon: "fa-shield-alt" }
              ].map((dir, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 text-center p-5 rounded-xl shadow cursor-pointer">
                  <i className={`fas ${dir.icon} text-3xl text-[#0F4C81] mb-2`}></i>
                  <h3 className="font-medium">{dir.name}</h3>
                  <p className="text-2xl font-bold text-[#2E8B57]">{dir.count}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Badges & CTA */}
        <section className="py-6 bg-slate-50 dark:bg-slate-800/30">
          <div className="container mx-auto px-4 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <div><i className="fas fa-shield-alt text-green-600 mr-1"></i> ISO 27001 Certified</div>
            <div><i className="fas fa-check-circle text-green-600 mr-1"></i> SOC 2 Compliant</div>
            <div><i className="fas fa-globe text-green-600 mr-1"></i> GDPR Ready</div>
            <div><i className="fas fa-bolt text-green-600 mr-1"></i> 99.9% Uptime</div>
          </div>
        </section>

        <section className="py-12 bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Optimize Your Trade Operations?</h2>
          <p className="max-w-xl mx-auto mb-6 text-slate-600 dark:text-slate-300">Access 82+ calculators, 72+ document generators, and real-time market data — all free.</p>
          <div className="flex gap-4 justify-center">
            <button className="bg-[#0F4C81] text-white px-6 py-3 rounded-full shadow">Explore Calculators</button>
            <button className="border border-slate-300 px-6 py-3 rounded-full">Generate Documents</button>
          </div>
        </section>
      </main>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-lg border flex items-center justify-center hover:shadow-xl transition-all hidden md:flex"
        id="backToTop"
      >
        <i className="fas fa-arrow-up"></i>
      </button>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
      `}</style>
    </div>
  );
}