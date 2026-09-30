/**
 * PORTFOLIO SPECIFIC LOGIC - Dynamic Supabase Version
 * Handles: Live Data Fetching, Stat Calculations, and Sequencing
 */

// Import the supabase client from your config (if using modules)
// import { supabase } from './config.js'; 

const PortfolioManager = {
    // 1. Live State Management
    state: {
        totalPortfolioValue: 0,
        availableBalance: 0,
        holdings: []
    },

    // 2. Initialize the Section
    async init() {
        console.log("Connecting to Supabase...");
        await this.fetchPortfolioData();
        this.bindEvents();
        console.log("Portfolio Logic Initialized.");
    },

    // 3. Fetch Real Data from Supabase
    // Inside portfolio_logic.js

        // ... other state properties ...

        async fetchPortfolioData() {
            try {
                // 1. Fetch investments and joined asset data from Supabase
                const { data: investments, error } = await supabase
                    .from("investments")
                    .select("*, assets(symbol, name, external_id)");

                if (error) throw error;

                // 2. Get live prices from your API (e.g., CoinGecko)
                const prices = await getPrices();

                let totalValue = 0;

                // 3. Calculate current value using live prices (Groww-style math)
                investments.forEach(inv => {
                    // Ensure external_id matches the key in your prices object
                    const currentPrice = prices[inv.assets.external_id]?.usd || 0;
                    totalValue += inv.total_quantity * currentPrice;
                });

                // 4. Sync with the UI IDs in your index.html
                const valueDisplay = document.getElementById("total-portfolio-value");
                if (valueDisplay) {
                    valueDisplay.innerText = `$${totalValue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}`;
                }

                // Update the local state for Graham Score calculations
                this.state.totalPortfolioValue = totalValue;
                this.updateUI();

            } catch (err) {
                console.error("Portfolio Load Error:", err.message);
            }
        },

    // 4. Update UI with Live Values
    updateUI() {
        // Calculate totals based on live holdings
        const equity = this.state.holdings
            .filter(h => h.asset_type === 'stock' || h.asset_type === 'crypto')
            .reduce((acc, h) => acc + (h.qty * h.ltp), 0);

        const debt = this.state.holdings
            .filter(h => h.asset_type === 'forex') // Or your debt-equivalent type
            .reduce((acc, h) => acc + (h.qty * h.ltp), 0);

        this.state.totalPortfolioValue = equity + debt;

        // Target the specific IDs seen in your index.html
        const totalValEl = document.getElementById('total-portfolio-value');
        if (totalValEl) {
            totalValEl.innerText = `$${this.state.totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
        }

        // Available Balance (static for now or fetched from a 'wallets' table)
        const balanceEl = document.getElementById('available-balance-value');
        if (balanceEl) {
            balanceEl.innerText = `$${this.state.availableBalance.toLocaleString()}`;
        }

        this.calculateHealthScore(equity, debt);
    },

    // 5. Graham Method Calculations (Using dynamic inputs)
/**
 * Advanced Portfolio Decision & Efficiency Engine
 */
calculateDecisionScore(holdings, marketStatus, sips) {
    let baseScore = 100;
    let feedback = [];

    holdings.forEach(asset => {
        const currentPrice = marketStatus[asset.external_id]?.usd || 0;
        const priceChange24h = marketStatus[asset.external_id]?.usd_24h_change || 0;
        
        // 1. TIMING ANALYSIS: Opportunity Cost vs. Holding Time
        const holdingMonths = (new Date() - new Date(asset.created_at)) / (1000 * 60 * 60 * 24 * 30);
        
        if (priceChange24h < -10 && asset.total_quantity > 0) {
            // Market is crashing, but user held through the volatility
            baseScore -= 5;
            feedback.push(`Volatility Alert: ${asset.name} dropped ${priceChange24h.toFixed(2)}%. High exposure during dip decreased health.`);
        }

        // 2. SIP & FUTURE COMMITMENT: Term of Investment
        const activeSip = sips.find(s => s.asset_id === asset.id);
        if (!activeSip) {
            baseScore -= 10;
            feedback.push(`Planning Gap: No future SIP detected for ${asset.symbol}. Long-term compounding efficiency is low.`);
        } else if (activeSip.term_months < 12) {
            baseScore -= 5;
            feedback.push(`Term Risk: Short-term SIP for ${asset.symbol} reduces market-cycle protection.`);
        }

        // 3. WITHDRAWAL TIMING: Right Decision vs. Wrong Decision
        // (Logic checks if user sold before a pump or during a dump)
        if (asset.last_sale_price > currentPrice) {
            baseScore += 10; // "Right Decision": Sold high
            feedback.push(`Precision Move: Profitable exit on ${asset.symbol} before market retracement.`);
        }
    });

    // Final Normalization
    const finalScore = Math.max(0, Math.min(100, baseScore));
    this.renderProfessionalDashboard(finalScore, feedback);
},

renderProfessionalDashboard(score, insights) {
    const scoreEl = document.querySelector('#portfolio-section .text-amber-400');
    const advisorEl = document.getElementById('advisor-tips'); // Add this ID to your HTML

    if (scoreEl) {
        scoreEl.innerText = `${score}/100`;
        // Dynamic Tiering
        scoreEl.className = score > 80 ? "text-emerald-400" : score > 50 ? "text-amber-400" : "text-red-400";
    }

    if (advisorEl) {
        advisorEl.innerHTML = insights.map(tip => 
            `<p class="text-xs text-slate-400 mb-1">● ${tip}</p>`
        ).join('');
    }
},

    // 6. Event Listeners
    bindEvents() {
        const rebalanceBtn = document.querySelector('#portfolio-section button.bg-blue-600');
        if (rebalanceBtn) {
            rebalanceBtn.addEventListener('click', () => this.executeRebalance());
        }

        const reportBtn = document.getElementById('download-report-btn');
        if (reportBtn) {
            reportBtn.addEventListener('click', () => this.generatePDF());
        }
    },

    executeRebalance() {
        // Logic remains similar but could now push a transaction to Supabase
        alert("Analyzing Graham thresholds based on your Supabase data...");
    },

    generatePDF() {
        console.log("Generating report for holdings:", this.state.holdings);
    }
};

document.addEventListener('DOMContentLoaded', () => PortfolioManager.init());


// THE LISTENER//



// Inside PortfolioManager.init()
// Ensure this is inside your PortfolioManager object
const PortfolioManager = {
    // ... existing state and other functions ...

    async init() {
        console.log("Connecting to Supabase...");

        // 1. Initial Data Load
        await this.fetchPortfolioData();
        this.bindEvents();

        // 2. Realtime Listener
        // Use a single channel to watch for changes
        supabase
            .channel('transaction-updates')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'transactions'
                },
                (payload) => {
                    console.log('New transaction detected, updating portfolio...', payload);
                    this.fetchPortfolioData(); // Re-run the fetch and UI update
                }
            )
            .subscribe();
    },

    // Ensure your other functions follow here with commas between them
    async fetchPortfolioData() {
        // ... your fetch logic ...
    },

    bindEvents() {
        // ... your event binding logic ...
    }
};




