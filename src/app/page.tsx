<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Global Logistics Tools | Live Preview</title>
  <!-- Tailwind CSS v3 + base styles -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Custom font & extra utilities -->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&display=swap');
    * { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
    body { background: #f8fafc; }
    .dark body { background: #0f172a; }
    /* scroll progress */
    .progress-bar { transform-origin: 0%; transition: transform 0.1s linear; }
    /* marquee animation */
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee { animation: marquee 28s linear infinite; }
    .animation-paused { animation-play-state: paused; }
    /* custom backdrop blur */
    .glass-card { backdrop-filter: blur(12px); background-color: rgba(255,255,255,0.7); }
    .dark .glass-card { background-color: rgba(15,23,42,0.7); }
    /* hide scrollbar but keep functionality */
    .no-scrollbar::-webkit-scrollbar { display: none; }
    /* map placeholder */
    .map-placeholder { background: linear-gradient(135deg, #0F4C81 0%, #2E8B57 100%); }
  </style>
  <!-- Simple icons via Font Awesome (for simplicity & compatibility) -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <!-- Chart.js (for freight rate chart) -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
</head>
<body class="bg-white dark:bg-slate-900 transition-colors duration-300">
  <div class="min-h-screen" id="app-root">
    <!-- Reading Progress Bar (sticky) -->
    <div class="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0F4C81] via-[#2E8B57] to-[#0F4C81] z-50 origin-left progress-bar" style="transform: scaleX(0);" id="progressBar"></div>

    <!-- Breaking News Ticker -->
    <div id="breakingNewsBar" class="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-2 relative overflow-hidden hidden">
      <div class="container mx-auto px-4">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 flex-shrink-0 bg-white/20 px-3 py-1 rounded-full">
            <i class="fas fa-exclamation-triangle text-sm animate-pulse"></i>
            <span class="font-bold text-sm">BREAKING</span>
          </div>
          <div class="flex-1 overflow-hidden">
            <div id="tickerContent" class="flex gap-8 animate-marquee whitespace-nowrap">
              <!-- filled by JS -->
            </div>
          </div>
          <button id="pauseTickerBtn" class="h-6 w-6 text-white/80 hover:text-white flex-shrink-0">
            <i class="fas fa-pause text-xs"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-[#0F4C81]/5 via-white to-[#2E8B57]/5 dark:via-slate-900">
      <div class="container mx-auto px-4 py-10 md:py-16 relative">
        <!-- Top bar: clocks + theme toggle -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div class="flex items-center gap-3 md:gap-4" id="worldClocks">
            <!-- dynamic clocks loaded by JS -->
          </div>
          <div class="flex items-center gap-2">
            <button id="darkModeToggle" class="rounded-full p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 transition">
              <i id="themeIcon" class="fas fa-moon text-slate-700 dark:text-slate-200 text-lg"></i>
            </button>
            <button id="shortcutsBtn" class="rounded-full p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 transition">
              <i class="fas fa-keyboard text-slate-700 dark:text-slate-200 text-lg"></i>
            </button>
          </div>
        </div>

        <!-- Hero content -->
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">Global Logistics Tools</h1>
          <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">Calculate freight, find ports, check HS codes — all in one place</p>
          
          <!-- Search Bar -->
          <div class="relative max-w-2xl mx-auto mb-6">
            <div class="relative">
              <i class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
              <input type="text" id="globalSearch" placeholder="Search calculators, tools, ports, HS codes..." class="pl-14 pr-24 h-16 text-lg rounded-2xl border-2 border-[#0F4C81]/20 focus:border-[#0F4C81] w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xl">
              <div class="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block">
                <kbd class="px-2 py-1.5 text-xs font-mono bg-slate-100 dark:bg-slate-800 rounded-lg border">Ctrl+K</kbd>
              </div>
            </div>
            <div id="searchSuggestions" class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 hidden"></div>
          </div>

          <!-- Quick Pills -->
          <div class="flex flex-wrap justify-center gap-2 mb-8">
            <a href="#" class="pill-btn inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#0F4C81]/20 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 text-sm font-medium"><i class="fas fa-box text-[#0F4C81]"></i> CBM Calculator</a>
            <a href="#" class="pill-btn inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#0F4C81]/20 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 text-sm font-medium"><i class="fas fa-pallet text-[#0F4C81]"></i> Container Planner</a>
            <a href="#" class="pill-btn inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#0F4C81]/20 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 text-sm font-medium"><i class="fas fa-hashtag text-[#0F4C81]"></i> HS Code</a>
            <a href="#" class="pill-btn inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#0F4C81]/20 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 text-sm font-medium"><i class="fas fa-anchor text-[#0F4C81]"></i> Port Finder</a>
            <a href="#" class="pill-btn inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#0F4C81]/20 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 text-sm font-medium"><i class="fas fa-dollar-sign text-[#0F4C81]"></i> Landed Cost</a>
          </div>

          <!-- Stats Row -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div class="text-center p-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-xl shadow-md"><i class="fas fa-calculator text-[#0F4C81] text-xl mb-1 block"></i><div class="text-xl font-bold counter" data-target="82">0</div><div class="text-xs text-slate-500">Calculators+</div></div>
            <div class="text-center p-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-xl shadow-md"><i class="fas fa-file-alt text-[#0F4C81] text-xl mb-1 block"></i><div class="text-xl font-bold counter" data-target="72">0</div><div class="text-xs text-slate-500">Documents+</div></div>
            <div class="text-center p-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-xl shadow-md"><i class="fas fa-newspaper text-[#0F4C81] text-xl mb-1 block"></i><div class="text-xl font-bold counter" data-target="40">0</div><div class="text-xs text-slate-500">News Sources+</div></div>
            <div class="text-center p-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-xl shadow-md"><i class="fas fa-dollar-sign text-[#0F4C81] text-xl mb-1 block"></i><div class="text-xl font-bold counter" data-target="50">0</div><div class="text-xs text-slate-500">Currencies+</div></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Market Data Strip (sticky) -->
    <div class="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b shadow-sm py-3">
      <div class="container mx-auto px-4 flex justify-center gap-6 md:gap-10 flex-wrap">
        <div class="flex items-center gap-2"><span class="text-sm text-slate-500">FBX</span><span class="font-bold">3,920</span><span class="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">+2.4%</span></div>
        <div class="flex items-center gap-2"><span class="text-sm text-slate-500">BDI</span><span class="font-bold">1,847</span><span class="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">-1.2%</span></div>
        <div class="flex items-center gap-2"><span class="text-sm text-slate-500">EUR/USD</span><span class="font-bold">1.0842</span><span class="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">+0.12%</span></div>
        <div class="flex items-center gap-2"><span class="text-sm text-slate-500">WTI</span><span class="font-bold">$79.20</span><span class="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">+0.8%</span></div>
        <a href="#" class="text-xs text-slate-500 hover:text-slate-900">More Data <i class="fas fa-chevron-right text-[10px]"></i></a>
      </div>
    </div>

    <main>
      <!-- World Map Section (static placeholder) -->
      <section class="py-10">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center mb-6"><div><h2 class="text-2xl font-bold flex items-center gap-2"><i class="fas fa-globe text-[#0F4C81]"></i> Global Port Activity</h2><p class="text-slate-500">Live view of 1,354 major hubs</p></div><a href="#" class="text-sm border rounded-lg px-4 py-2">View All Ports <i class="fas fa-chevron-right ml-1"></i></a></div>
          <div class="map-placeholder rounded-xl overflow-hidden h-[400px] flex items-center justify-center text-white text-xl font-bold shadow-lg">🌍 Interactive World Map (Live Demo)</div>
        </div>
      </section>

      <!-- Trade Tools Grid (8 Tools) -->
      <section class="py-10 bg-slate-50 dark:bg-slate-800/30">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center mb-6"><div><h2 class="text-2xl font-bold flex items-center gap-2"><i class="fas fa-calculator text-[#0F4C81]"></i> Trade Tools</h2><p class="text-slate-500">Essential calculators for logistics professionals</p></div><a href="#" class="text-sm border rounded-lg px-4 py-2">All 82+ Tools →</a></div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <!-- 8 tool cards -->
            <div class="tool-card bg-white dark:bg-slate-900 rounded-xl p-5 shadow-md text-center hover:shadow-xl transition"><div class="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30"><i class="fas fa-ship text-2xl text-[#0F4C81]"></i></div><h3 class="font-semibold">Distance & Time</h3><p class="text-xs text-slate-500">Transit times</p></div>
            <div class="tool-card bg-white dark:bg-slate-900 rounded-xl p-5 shadow-md text-center hover:shadow-xl transition"><div class="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center bg-purple-100"><i class="fas fa-weight-hanging text-2xl text-purple-600"></i></div><h3 class="font-semibold">Volumetric Weight</h3><p class="text-xs text-slate-500">Air freight charge</p></div>
            <div class="tool-card bg-white dark:bg-slate-900 rounded-xl p-5 shadow-md text-center hover:shadow-xl transition"><div class="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center bg-green-100"><i class="fas fa-chart-line text-2xl text-[#2E8B57]"></i></div><h3 class="font-semibold">Freight Rates</h3><p class="text-xs text-slate-500">Compare rates</p></div>
            <div class="tool-card bg-white dark:bg-slate-900 rounded-xl p-5 shadow-md text-center hover:shadow-xl transition"><div class="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center bg-amber-100"><i class="fas fa-dollar-sign text-2xl text-amber-600"></i></div><h3 class="font-semibold">Currency</h3><p class="text-xs text-slate-500">Live exchange</p></div>
            <div class="tool-card bg-white dark:bg-slate-900 rounded-xl p-5 shadow-md text-center hover:shadow-xl transition"><div class="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center bg-pink-100"><i class="fas fa-globe-americas text-2xl text-pink-600"></i></div><h3 class="font-semibold">Incoterms</h3><p class="text-xs text-slate-500">Trade terms</p></div>
            <div class="tool-card bg-white dark:bg-slate-900 rounded-xl p-5 shadow-md text-center hover:shadow-xl transition"><div class="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center bg-red-100"><i class="fas fa-clock text-2xl text-red-600"></i></div><h3 class="font-semibold">Demurrage</h3><p class="text-xs text-slate-500">Storage fees</p></div>
            <div class="tool-card bg-white dark:bg-slate-900 rounded-xl p-5 shadow-md text-center hover:shadow-xl transition"><div class="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center bg-cyan-100"><i class="fas fa-map-marker-alt text-2xl text-cyan-600"></i></div><h3 class="font-semibold">Tracking</h3><p class="text-xs text-slate-500">Container tracking</p></div>
            <div class="tool-card bg-white dark:bg-slate-900 rounded-xl p-5 shadow-md text-center hover:shadow-xl transition"><div class="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center bg-emerald-100"><i class="fas fa-file-invoice text-2xl text-emerald-600"></i></div><h3 class="font-semibold">Documents</h3><p class="text-xs text-slate-500">Generate docs</p></div>
          </div>
        </div>
      </section>

      <!-- Featured Calculators (3 cards) -->
      <section class="py-10 bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5">
        <div class="container mx-auto px-4 text-center"><span class="inline-block bg-[#0F4C81]/10 text-[#0F4C81] text-xs px-3 py-1 rounded-full mb-3"><i class="fas fa-sparkle mr-1"></i> Featured</span><h2 class="text-2xl md:text-3xl font-bold mb-2">Most Used Calculators</h2><p class="text-slate-500 max-w-xl mx-auto mb-8">Tools logistics professionals rely on daily</p>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"><div class="w-16 h-16 rounded-2xl flex items-center justify-center bg-blue-100 mb-4"><i class="fas fa-boxes text-3xl text-[#0F4C81]"></i></div><h3 class="font-bold text-lg mb-2">CBM Calculator</h3><p class="text-sm text-slate-500">Calculate cubic meters & container fit</p><div class="mt-4 text-left text-xs space-y-1"><div><i class="fas fa-check-circle text-green-600"></i> Volume calculation</div><div><i class="fas fa-check-circle text-green-600"></i> Container fit</div></div><div class="mt-4 text-[#0F4C81] font-medium">Open Tool <i class="fas fa-arrow-right ml-1"></i></div></div>
            <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"><div class="w-16 h-16 rounded-2xl flex items-center justify-center bg-green-100 mb-4"><i class="fas fa-pallet text-3xl text-[#2E8B57]"></i></div><h3 class="font-bold text-lg mb-2">Container Load Planner</h3><p class="text-sm text-slate-500">Optimize pallet placement in containers</p><div class="mt-4 text-left text-xs space-y-1"><div><i class="fas fa-check-circle text-green-600"></i> Pallet optimization</div><div><i class="fas fa-check-circle text-green-600"></i> Maximize space</div></div><div class="mt-4 text-[#0F4C81] font-medium">Open Tool <i class="fas fa-arrow-right ml-1"></i></div></div>
            <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"><div class="w-16 h-16 rounded-2xl flex items-center justify-center bg-purple-100 mb-4"><i class="fas fa-hashtag text-3xl text-purple-600"></i></div><h3 class="font-bold text-lg mb-2">HS Code Finder</h3><p class="text-sm text-slate-500">Find customs codes for products</p><div class="mt-4 text-left text-xs space-y-1"><div><i class="fas fa-check-circle text-green-600"></i> Product search</div><div><i class="fas fa-check-circle text-green-600"></i> Duty rates</div></div><div class="mt-4 text-[#0F4C81] font-medium">Open Tool <i class="fas fa-arrow-right ml-1"></i></div></div>
          </div>
        </div>
      </section>

      <!-- Latest Trade News (3 cards + loading simulation) -->
      <section class="py-10">
        <div class="container mx-auto px-4"><div class="flex justify-between items-center mb-6"><div><h2 class="text-2xl font-bold flex items-center gap-2"><i class="fas fa-newspaper text-[#0F4C81]"></i> Latest Trade News</h2><p class="text-slate-500">Real-time updates from global sources</p></div><a href="#" class="text-sm border rounded-lg px-4 py-2">View All News →</a></div>
          <div id="newsGrid" class="grid md:grid-cols-3 gap-6"></div>
        </div>
      </section>

      <!-- Knowledge Hub -->
      <section class="py-10 bg-slate-50 dark:bg-slate-800/30">
        <div class="container mx-auto px-4 text-center"><span class="inline-block bg-[#2E8B57]/10 text-[#2E8B57] text-xs px-3 py-1 rounded-full mb-3"><i class="fas fa-graduation-cap mr-1"></i> Learn Trade</span><h2 class="text-2xl md:text-3xl font-bold mb-2">Essential Trade Knowledge</h2><p class="text-slate-500 max-w-2xl mx-auto mb-8">Master international trade, shipping, and logistics</p>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow hover:shadow-xl"><i class="fas fa-globe text-3xl text-[#0F4C81] mb-3"></i><h3 class="font-bold text-lg">Incoterms 2020</h3><p class="text-sm text-slate-500">Understand 11 international trade terms</p><div class="mt-4 text-[#0F4C81]">Learn More <i class="fas fa-arrow-right ml-1"></i></div></div>
            <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow hover:shadow-xl"><i class="fas fa-chart-simple text-3xl text-[#2E8B57] mb-3"></i><h3 class="font-bold text-lg">HS Codes Guide</h3><p class="text-sm text-slate-500">Classify products for customs</p><div class="mt-4 text-[#0F4C81]">Learn More <i class="fas fa-arrow-right ml-1"></i></div></div>
            <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow hover:shadow-xl"><i class="fas fa-box text-3xl text-purple-600 mb-3"></i><h3 class="font-bold text-lg">Container Types</h3><p class="text-sm text-slate-500">ISO container specifications</p><div class="mt-4 text-[#0F4C81]">Learn More <i class="fas fa-arrow-right ml-1"></i></div></div>
          </div>
        </div>
      </section>

      <!-- Industry Directories -->
      <section class="py-10">
        <div class="container mx-auto px-4"><h2 class="text-2xl font-bold flex items-center gap-2 mb-6"><i class="fas fa-building text-[#0F4C81]"></i> Industry Directories</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white dark:bg-slate-900 text-center p-5 rounded-xl shadow"><i class="fas fa-anchor text-3xl text-[#0F4C81] mb-2"></i><h3 class="font-medium">Global Ports</h3><p class="text-2xl font-bold text-[#2E8B57]">500+</p></div>
            <div class="bg-white dark:bg-slate-900 text-center p-5 rounded-xl shadow"><i class="fas fa-ship text-3xl text-[#0F4C81] mb-2"></i><h3 class="font-medium">Shipping Lines</h3><p class="text-2xl font-bold text-[#2E8B57]">150+</p></div>
            <div class="bg-white dark:bg-slate-900 text-center p-5 rounded-xl shadow"><i class="fas fa-truck text-3xl text-[#0F4C81] mb-2"></i><h3 class="font-medium">Freight Forwarders</h3><p class="text-2xl font-bold text-[#2E8B57]">200+</p></div>
            <div class="bg-white dark:bg-slate-900 text-center p-5 rounded-xl shadow"><i class="fas fa-shield-alt text-3xl text-[#0F4C81] mb-2"></i><h3 class="font-medium">Customs Brokers</h3><p class="text-2xl font-bold text-[#2E8B57]">100+</p></div>
          </div>
        </div>
      </section>

      <!-- Trust Badges & CTA -->
      <section class="py-6 bg-slate-50 dark:bg-slate-800/30"><div class="container mx-auto px-4 flex flex-wrap justify-center gap-6 text-sm text-slate-500"><div><i class="fas fa-shield-alt text-green-600 mr-1"></i> ISO 27001 Certified</div><div><i class="fas fa-check-circle text-green-600 mr-1"></i> SOC 2 Compliant</div><div><i class="fas fa-globe text-green-600 mr-1"></i> GDPR Ready</div><div><i class="fas fa-bolt text-green-600 mr-1"></i> 99.9% Uptime</div></div></section>

      <section class="py-12 bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5 text-center"><h2 class="text-2xl md:text-3xl font-bold mb-4">Ready to Optimize Your Trade Operations?</h2><p class="max-w-xl mx-auto mb-6 text-slate-600 dark:text-slate-300">Access 82+ calculators, 72+ document generators, and real-time market data — all free.</p><div class="flex gap-4 justify-center"><button class="bg-[#0F4C81] text-white px-6 py-3 rounded-full shadow">Explore Calculators</button><button class="border border-slate-300 px-6 py-3 rounded-full">Generate Documents</button></div></section>
    </main>

    <!-- Quick Action Modals (simplified) and global JS -->
    <div id="cbmModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden"><div class="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6"><h3 class="text-xl font-bold mb-2">Quick CBM Calculator</h3><input type="number" placeholder="Length cm" class="w-full border rounded-lg p-2 my-1"><input type="number" placeholder="Width cm" class="w-full border rounded-lg p-2 my-1"><input type="number" placeholder="Height cm" class="w-full border rounded-lg p-2 my-1"><div class="mt-4 flex gap-2"><button class="flex-1 border rounded py-2" onclick="closeAllModals()">Cancel</button><button class="flex-1 bg-[#0F4C81] text-white rounded py-2">Calculate</button></div></div></div>
    <!-- other modals similar, omitted for brevity but functional to match preview -->

    <script>
      // Mock news data
      const mockNews = [
        { id: "1", title: "Red Sea diversions push rates up 23%", excerpt: "Container freight rates surge as vessels reroute", category: "Ocean Freight", source: "Lloyd's List", publishedAt: new Date(Date.now() - 2*60*60*1000).toISOString(), isAlert: true, imageUrl: "https://picsum.photos/id/10/400/200" },
        { id: "2", title: "Panama Canal restrictions eased", excerpt: "Drought measures reduced, transit capacity increases", category: "Logistics", source: "Journal of Commerce", publishedAt: new Date(Date.now() - 5*60*60*1000).toISOString(), isAlert: false, imageUrl: "https://picsum.photos/id/11/400/200" },
        { id: "3", title: "EU ETS surcharge updates for 2026", excerpt: "Shipping lines announce new emission fees", category: "Sustainability", source: "TradeWinds", publishedAt: new Date(Date.now() - 24*60*60*1000).toISOString(), isAlert: false, imageUrl: "https://picsum.photos/id/12/400/200" }
      ];
      const breakingNews = mockNews.filter(n=>n.isAlert);
      // render news
      function renderNews(){
        const grid = document.getElementById('newsGrid');
        if(grid) grid.innerHTML = mockNews.map(news => `<div class="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden"><div class="h-44 bg-cover bg-center relative" style="background-image:url('${news.imageUrl}')"><div class="absolute top-3 left-3"><span class="bg-blue-600 text-white text-xs px-2 py-1 rounded">${news.category}</span></div>${news.isAlert?'<span class="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded animate-pulse">ALERT</span>':''}</div><div class="p-4"><h3 class="font-bold">${news.title}</h3><p class="text-sm text-slate-500 my-2">${news.excerpt}</p><div class="flex justify-between text-xs"><span>${news.source}</span><span>${new Date(news.publishedAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span></div></div></div>`).join('');
      }
      renderNews();

      // breaking ticker
      if(breakingNews.length){
        document.getElementById('breakingNewsBar')?.classList.remove('hidden');
        const tickerDiv = document.getElementById('tickerContent');
        if(tickerDiv) tickerDiv.innerHTML = breakingNews.map(n=>`<a href="#" class="hover:underline">🔥 ${n.title}</a>`).join('') + breakingNews.map(n=>`<a href="#" class="hover:underline">🔥 ${n.title}</a>`).join('');
      }
      let tickerPaused = false;
      document.getElementById('pauseTickerBtn')?.addEventListener('click',()=>{
        tickerPaused=!tickerPaused;
        const el = document.querySelector('#tickerContent');
        if(tickerPaused) el?.classList.add('animation-paused');
        else el?.classList.remove('animation-paused');
      });

      // World clocks simulation
      const hubs = [{city:"Shanghai", tz:"Asia/Shanghai", flag:"🇨🇳"},{city:"Rotterdam", tz:"Europe/Amsterdam", flag:"🇳🇱"},{city:"Singapore", tz:"Asia/Singapore", flag:"🇸🇬"},{city:"Los Angeles", tz:"America/Los_Angeles", flag:"🇺🇸"}];
      function updateClocks(){
        const container = document.getElementById('worldClocks');
        if(container) container.innerHTML = hubs.map(h=>`<div class="flex items-center gap-1.5 text-xs bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded-full"><span>${h.flag}</span><span class="font-mono">${new Date().toLocaleTimeString('en-US',{timeZone:h.tz, hour:'2-digit', minute:'2-digit', hour12:false})}</span></div>`).join('');
      }
      updateClocks(); setInterval(updateClocks, 1000);

      // Counters animation
      const counters = document.querySelectorAll('.counter');
      const animateCounters = () => {
        counters.forEach(c => { const target = parseInt(c.dataset.target); let current = 0; const step = target/50; const timer = setInterval(()=>{ current+=step; if(current>=target){c.innerText=target; clearInterval(timer);} else c.innerText=Math.floor(current); },20); });
      };
      const observer = new IntersectionObserver((entries)=> { entries.forEach(e=>{if(e.isIntersecting){animateCounters(); observer.disconnect();}}); }, {threshold:0.1});
      const statsContainer = document.querySelector('.grid.max-w-3xl');
      if(statsContainer) observer.observe(statsContainer);

      // dark mode
      const darkModeToggle = document.getElementById('darkModeToggle');
      const html = document.documentElement;
      if(localStorage.getItem('darkMode') === 'true') html.classList.add('dark');
      darkModeToggle?.addEventListener('click',()=>{
        html.classList.toggle('dark');
        localStorage.setItem('darkMode', html.classList.contains('dark'));
      });

      // search suggestions simple
      const searchInput = document.getElementById('globalSearch');
      const suggestionsDiv = document.getElementById('searchSuggestions');
      searchInput?.addEventListener('input', (e) => {
        const q = e.target.value.trim().toLowerCase();
        if(q.length<2){ suggestionsDiv.classList.add('hidden'); return; }
        const fakeResults = ['CBM Calculator', 'HS Code Finder', 'Container Tracking', 'Ocean Freight Rates', 'Port Directory'].filter(i=>i.toLowerCase().includes(q));
        if(fakeResults.length){
          suggestionsDiv.innerHTML = `<div class="p-2"><div class="text-xs text-slate-400 mb-1">Suggestions</div>${fakeResults.map(r=>`<a href="#" class="block p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">${r}</a>`).join('')}</div>`;
          suggestionsDiv.classList.remove('hidden');
        } else suggestionsDiv.classList.add('hidden');
      });
      document.addEventListener('click',(e)=>{ if(!searchInput?.contains(e.target) && !suggestionsDiv?.contains(e.target)) suggestionsDiv?.classList.add('hidden'); });

      // simple scroll progress
      window.addEventListener('scroll',()=>{
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (winScroll / height);
        document.getElementById('progressBar')?.style.setProperty('transform', `scaleX(${scrolled})`);
      });

      // modal demonstration (quick)
      window.closeAllModals = function(){ document.querySelectorAll('[id$="Modal"]').forEach(m=>m.classList.add('hidden')); };
      // Back to top floating button (simple)
      const backBtn = document.createElement('button');
      backBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
      backBtn.className = 'fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-lg border flex items-center justify-center hover:shadow-xl transition-all';
      backBtn.onclick = () => window.scrollTo({top:0,behavior:'smooth'});
      document.body.appendChild(backBtn);
      window.addEventListener('scroll',()=>{ if(window.scrollY>500) backBtn.style.display='flex'; else backBtn.style.display='none'; });
      backBtn.style.display='none';
    </script>
  </div>
</body>
</html>