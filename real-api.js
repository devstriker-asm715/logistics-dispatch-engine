// 1. Configuration - Use a real API key here (e.g., Alpha Vantage or FMP)
const API_KEY = "YOUR_FREE_API_KEY";
const SYMBOLS = ["AAPL", "MSFT", "GOOGL", "TSLA", "NVDA", "META", "BRK-B", "AMZN", ];

// This will hold our "Real" Giants after the API fetch
let giants = [];

// 2. Fetch Real Data from API
async function fetchRealStockData() {
    try {
        // Example using a Quote API (Financial Modeling Prep or similar)
        const response = await fetch(`https://financialmodelingprep.com/api/v3/quote/${SYMBOLS.join(',')}?apikey=${API_KEY}`);
        const data = await response.json();

        // 3. Map API data to your EXACT "Giants" format
        giants = data.map(stock => ({
            n: stock.name,               // Real Company Name
            f: stock.symbol,             // Ticker Symbol
            cagr: stock.changesPercentage.toFixed(2), // Real Daily % Change
            start: "Est. 1980",          // Static or fetched from Company Profile API
            icon: "📈",                  // Could be logic-based
            sent: stock.change >= 0 ? "Bullish" : "Bearish", // Real Logic
            updated: new Date().toLocaleDateString(),
            price: stock.price           // Extra data for the chart
        }));

        populateGiants(); // Trigger your existing UI function
        if (giants.length > 0) visualizeGiant(giants[0].n); // Load first one into chart

    } catch (error) {
        console.error("API Error:", error);
        showToast("Failed to fetch live market data");
    }
}

// 4. Your EXACT UI Function (Unchanged, just uses 'giants' from API)
function populateGiants() {
    const list = document.getElementById('giants-list');
    if (!list) return;

    list.innerHTML = giants.map(g => `
        <div class="card-sharp p-5 giant-card group flex flex-col justify-between" onclick="visualizeGiant('${g.n}')">
            <div class="flex justify-between items-s  tart mb-4">
                <span class="text-2xl">${g.icon}</span>
                <span class="px-2 py-0.5 rounded text-[8px] font-black uppercase ${g.sent === 'Bullish' ? 'sentiment-bullish' : 'sentiment-bearish'}">
                    ${g.sent}
                </span>
            </div>
            <div>
                <h4 class="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors">${g.n}</h4>
                <p class="text-[9px] text-slate-500 uppercase tracking-tighter mb-4">${g.f}</p>
                
                <div class="flex justify-between text-[10px] mb-1">
                    <span class="text-slate-400">Inception:</span>
                    <span class="text-slate-200 font-mono italic">${g.start}</span>
                </div>
                <div class="flex justify-between text-[10px]">
                    <span class="text-slate-400">Last Sync:</span>
                    <span class="text-slate-500 font-bold">${g.updated}</span>
                </div>
            </div>
            <div class="mt-4 pt-4 border-t border-slate-800">
                 <div class="flex justify-between items-center">
                    <span class="text-[8px] font-bold text-slate-500 uppercase">Daily Change</span>
                    <span class="text-[10px] font-black ${g.cagr >= 0 ? 'text-emerald-500' : 'text-red-500'}">${g.cagr}%</span>
                 </div>
            </div>
        </div>
    `).join('');
}

// Initialize on Load
window.onload = () => {
    // Initialize your Chart.js instance here as you did before...
    initChart();

    // Call the API instead of hardcoding
    fetchRealStockData();
};