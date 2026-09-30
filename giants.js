// CONFIGURATION
const API_KEY = '_api_key';
const SYMBOLS = [
    'NVDA', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', // Tech Giants
    'TSLA', 'AVGO', 'TSM', 'LLY', 'JPM', 'V',        // Global Leaders
    'UNH', 'MA', 'COST', 'NFLX', 'AMD', 'ORCL',     // Growth & Retail
    'ADBE', 'CRM', 'PLTR', 'COIN', 'SMCI', 'MSTR'   // High Movers
];

async function loadGiantsDashboard() {
    const grid = document.getElementById('giants-grid');

    try {
        // 1. Batch fetch the current quotes
        const response = await fetch(`https://api.twelvedata.com/quote?symbol=${SYMBOLS.join(',')}&apikey=${API_KEY}`);
        const result = await response.json();

        grid.innerHTML = ''; // Clear loading spinner

        SYMBOLS.forEach(symbol => {
            const stock = result[symbol];
            if (!stock) return;

            const price = parseFloat(stock.close).toLocaleString(undefined, { minimumFractionDigits: 2 });
            const change = parseFloat(stock.percent_change).toFixed(2);
            const isUp = parseFloat(change) >= 0;

            // 2. Build the Docker Card
            const card = document.createElement('div');
            card.className = "giant-card bg-slate-900 border border-slate-800 p-6 rounded-[20px] transition-all duration-500 hover:border-blue-500 hover:-translate-y-2 group relative overflow-hidden";

            card.innerHTML = `
                <div class="flex justify-between items-start relative z-10">
                    <div>
                        <span class="text-[10px] font-black text-blue-500 tracking-tighter uppercase mb-1 block">${symbol}</span>
                        <h4 class="text-white font-bold text-sm truncate w-32">${stock.name}</h4>
                    </div>
                    <div class="text-right">
                        <p class="text-slate-100 font-mono font-bold">$${price}</p>
                        <span class="text-[10px] font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}">
                            ${isUp ? '▲' : '▼'} ${isUp ? '+' : ''}${change}%
                        </span>
                    </div>
                </div>

                <div class="h-20 w-full mt-4 mb-2">
                    <canvas id="chart-${symbol}"></canvas>
                </div>

                <div class="flex justify-between items-center mt-4 pt-4 border-t border-slate-800/50 relative z-10">
                    <span class="text-[9px] text-slate-500 font-bold uppercase">Mkt Cap: ${stock.market_cap || 'N/A'}</span>
                    <button class="text-blue-500 text-[10px] font-bold group-hover:underline">ANALYSIS →</button>
                </div>

                <div class="absolute -right-4 -bottom-4 w-24 h-24 ${isUp ? 'bg-emerald-500/5' : 'bg-rose-500/5'} blur-3xl rounded-full"></div>
            `;

            grid.appendChild(card);

            // 3. Render the Sparkline
            createMiniSparkline(`chart-${symbol}`, isUp);
        });

    } catch (error) {
        grid.innerHTML = `<div class="col-span-full text-rose-500 text-center">Failed to load market data. Check API Key.</div>`;
    }
}

function createMiniSparkline(canvasId, isUp) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    // For "Live" look, we generate 12 points that trend in the direction of the change
    const points = Array.from({ length: 12 }, (_, i) => {
        const base = 50;
        const trend = isUp ? i * 2 : i * -2;
        return base + trend + (Math.random() * 10);
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: new Array(12).fill(''),
            datasets: [{
                data: points,
                borderColor: isUp ? '#10b981' : '#f43f5e',
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
                backgroundColor: (context) => {
                    const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 80);
                    gradient.addColorStop(0, isUp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)');
                    gradient.addColorStop(1, 'transparent');
                    return gradient;
                },
                tension: 0.4
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });
}

// Kick off the load
document.addEventListener('DOMContentLoaded', loadGiantsDashboard);