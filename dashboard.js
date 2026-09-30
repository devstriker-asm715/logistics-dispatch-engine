/**
 * GrahamAI Professional Dashboard Logic
 * Handles: AI Analysis, Navigation, Charts, Payments, and Live Simulations
 */

// 1. GLOBAL STATE
let portfolioState = {
    totalValue: 124500.00,
    availableBalance: 12040.00
};

// 2. AI ANALYSIS LOGIC
const initAIAnalysis = () => {
    const searchBtn = document.querySelector('.btn-ai-analyze');
    const searchInput = document.querySelector('input[type="text"]');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const ticker = searchInput.value.toUpperCase();
            if (!ticker) {
                showToast("⚠️ Please enter a stock ticker");
                return;
            }

            searchBtn.innerText = "Analyzing...";
            searchBtn.disabled = true;

            // Simulate AI Analysis Delay
            setTimeout(() => {
                alert(`GrahamAI Analysis for ${ticker}:\nVerdict: BUY\nReasoning: P/E Ratio is 12.5 (Below 15 threshold). Margin of safety: 22%.`);
                searchBtn.innerText = "Analyze";
                searchBtn.disabled = false;
            }, 2000);
        });
    }
};

// Get prices //
async function getPrices() {
    const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
    );
    return await res.json();
}

// 3. SIDEBAR NAVIGATION
/**
 * GLOBAL NAVIGATION CONTROLLER
 * Ensures sections toggle correctly upon tapping sidebar
 */
const initGlobalNavigation = () => {
    const navLinks = document.querySelectorAll('.sidebar-item');

    // Map of what the user clicks to the Section ID in HTML
    const sectionMap = {
        "dashboard": "dashboard-section",
        "portfolio": "portfolio-section",
        "investments": "investments-section",
        "transactions": "transactions-section",
        "goals": "goals-section",
        "reports": "reports-section",
        "risk profile": "risk-section", // Note: This matches the 'Risk Profile' text
        "documents": "documents-section",
        "settings": "settings-section"
    };
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // This regex removes emojis and extra whitespace to get clean text
            const cleanText = link.innerText.replace(/[^\x00-\x7F]/g, "").trim().toLowerCase();
            const targetId = sectionMap[cleanText];

            if (targetId) {
                // 1. Hide EVERY section mentioned in the map
                Object.values(sectionMap).forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.classList.add('hidden');
                });

                // 2. Show the specific target
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    targetEl.classList.remove('hidden');
                    targetEl.classList.add('animate-section');
                }

                // 3. UI Update: Highlight the active sidebar button
                navLinks.forEach(l => l.classList.remove('active-tab', 'bg-slate-800'));
                link.classList.add('active-tab', 'bg-slate-800');
            }
        });
    });
};


// 4. CHARTS INITIALIZATION (Chart.js)
const initCharts = () => {
    const ctxLine = document.getElementById('performanceChart')?.getContext('2d');
    if (ctxLine) {
        new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Portfolio Value ($)',
                    data: [105000, 108000, 107500, 115000, 120000, 124500],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: '#1e293b' }, ticks: { color: '#64748b' } },
                    x: { grid: { display: false }, ticks: { color: '#64748b' } }
                }
            }
        });
    }

    const ctxDonut = document.getElementById('allocationChart')?.getContext('2d');
    if (ctxDonut) {
        new Chart(ctxDonut, {
            type: 'doughnut',
            data: {
                labels: ['Equity', 'Debt', 'Gold', 'Cash'],
                datasets: [{
                    data: [60, 25, 10, 5],
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#64748b'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                cutout: '80%',
                plugins: { legend: { display: false } }
            }
        });
    }
};

// 5. LIVE SIMULATION
function startLiveSimulation() {
    const totalValueEl = document.getElementById('total-portfolio-value');
    if (totalValueEl) {
        setInterval(() => {
            const fluctuation = (Math.random() * 10 - 5);
            portfolioState.totalValue += fluctuation;
            totalValueEl.innerText = `$${portfolioState.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
        }, 3000);
    }
}

// 6. PAYMENT & TRANSACTION LOGIC
const initPayments = () => {
    const modal = document.getElementById('payment-modal');
    const addFundsBtn = document.getElementById('add-funds-btn');
    const closeModal = document.getElementById('close-modal');
    const paymentForm = document.getElementById('payment-form');
    const loader = document.getElementById('payment-loader');

    if (addFundsBtn) addFundsBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    if (closeModal) closeModal.addEventListener('click', () => modal.classList.add('hidden'));

    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const amount = parseFloat(document.getElementById('deposit-amount').value);
            const upi = document.getElementById('upi-id').value;
            const card = document.getElementById('card-num').value;

            if (!upi && !card) {
                alert("Please enter Payment Details (UPI or Card)");
                return;
            }

            modal.classList.add('hidden');
            loader.classList.remove('hidden');

            // Simulate External Gateway Handshake
            setTimeout(() => {
                const fakeTxnId = `TXN_${Math.floor(Math.random() * 1000000)}`;
                const methodUsed = upi ? 'UPI' : 'Credit Card';

                loader.innerHTML = `
                    <div class="text-center p-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl">
                        <div class="text-6xl mb-4">✅</div>
                        <h2 class="text-2xl font-bold mb-2">Payment Verified</h2>
                        <p class="text-slate-400 mb-6">Transaction ID: ${fakeTxnId}</p>
                        <button id="return-btn" class="bg-blue-600 px-8 py-2 rounded-lg font-bold hover:bg-blue-500 transition">Return to Dashboard</button>
                    </div>
                `;

                document.getElementById('return-btn').addEventListener('click', () => {
                    // Update State
                    portfolioState.availableBalance += amount;

                    // Update UI
                    const balanceEl = document.getElementById('available-balance-value');
                    if (balanceEl) {
                        balanceEl.innerText = `$${portfolioState.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
                    }

                    // Add to Table
                    addTransactionToTable(amount, methodUsed, fakeTxnId);

                    // Close Loader and Reset
                    loader.classList.add('hidden');
                    loader.innerHTML = ""; // Clear for next time
                    showToast(`$${amount.toLocaleString()} added successfully!`);
                });
            }, 2500);
        });
    }
};

// 7. UTILITY FUNCTIONS
function addTransactionToTable(amount, method, txnId) {
    const tableBody = document.getElementById('transaction-history-body');
    if (!tableBody) return;

    const now = new Date().toISOString().split('T')[0];
    const newRow = document.createElement('tr');
    newRow.className = "border-b border-slate-800/50 animate-pulse bg-blue-500/5";

    newRow.innerHTML = `
        <td class="px-6 py-4 font-mono text-xs text-slate-400">${txnId}</td>
        <td class="px-6 py-4 text-xs">${method.toUpperCase()}</td>
        <td class="px-6 py-4 text-emerald-500 font-bold">+$${parseFloat(amount).toLocaleString()}</td>
        <td class="px-6 py-4">
            <span class="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full text-[10px]">SUCCESS</span>
        </td>
        <td class="px-6 py-4 text-xs text-slate-500">${now}</td>
    `;

    tableBody.insertBefore(newRow, tableBody.firstChild);
    setTimeout(() => newRow.classList.remove('animate-pulse', 'bg-blue-500/5'), 3000);
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-success';
    toast.innerHTML = `<span>✔️</span> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

/** Sidebar "Explore Giants" (2.html): Giants UI was removed from that page — avoid ReferenceError */
function switchNav(mode, buttonEl) {
    if (mode === 'explore') {
        showToast('Market Giants: use 1.html for the full chart + API grid, or embed that panel here.');
    }
}

// 8. INITIALIZE EVERYTHING
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initAIAnalysis();
    initCharts();
    initPayments();
    startLiveSimulation();
});

// portfolio section //
/**
 * PORTFOLIO NAVIGATION LOGIC
 * Manages switching between the Dashboard and Portfolio views.
 */

const initPortfolioManager = () => {
    const navLinks = document.querySelectorAll('.sidebar-item');
    const dashboardSection = document.getElementById('dashboard-section');
    const portfolioSection = document.getElementById('portfolio-section');

    // Ensure elements exist before adding listeners
    if (!dashboardSection || !portfolioSection) {
        console.warn("Navigation elements not found in DOM.");
        return;
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Get the text to identify which button was clicked
            const linkText = link.innerText.trim();

            // 1. Update Active State in Sidebar
            navLinks.forEach(item => item.classList.remove('active-tab'));
            link.classList.add('active-tab');

            // 2. Logic to Switch View
            if (linkText.includes("Dashboard")) {
                toggleView(dashboardSection, portfolioSection);
            }
            else if (linkText.includes("Portfolio")) {
                toggleView(portfolioSection, dashboardSection);
                // Potential Addon: refreshPortfolioData();
            }
        });
    });
};

/**
 * Helper to handle the CSS classes for switching
 */
function toggleView(showElement, hideElement) {
    // Hide the previous section
    hideElement.classList.add('hidden');
    hideElement.classList.remove('animate-section');

    // Show the target section
    showElement.classList.remove('hidden');
    showElement.classList.add('animate-section');
}

// Ensure this runs after the HTML is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initPortfolioManager();
});


// investmanets //
/**
 * INVESTMENT HUB LOGIC
 * Handles purchasing new plans and toggling views
 */

// 1. Extend Navigation
const updateNavForInvestments = () => {
    const navLinks = document.querySelectorAll('.sidebar-item');
    const sections = {
        Dashboard: document.getElementById('dashboard-section'),
        Portfolio: document.getElementById('portfolio-section'),
        Investments: document.getElementById('investments-section')
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.innerText.trim();

            // Hide all, then show target
            Object.values(sections).forEach(sec => sec?.classList.add('hidden'));

            if (target.includes("Dashboard")) sections.Dashboard.classList.remove('hidden');
            if (target.includes("Portfolio")) sections.Portfolio.classList.remove('hidden');
            if (target.includes("Investments")) sections.Investments.classList.remove('hidden');
        });
    });
};

// 2. Investment Execution Logic
function openInvestModal(planName, returns) {
    const amount = prompt(`Enter amount to invest in ${planName} (Est. ${returns}%):`);

    if (amount && !isNaN(amount)) {
        const cost = parseFloat(amount);

        if (cost > portfolioState.availableBalance) {
            return alert("Insufficient Balance! Please add funds first.");
        }

        // Deduct from state
        portfolioState.availableBalance -= cost;
        portfolioState.totalValue += cost; // Moves from cash to assets

        // Update UI
        document.getElementById('available-balance-value').innerText =
            `$${portfolioState.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

        // Log transaction
        addTransactionToTable(cost, "Investment", `INV_${Math.floor(Math.random() * 100000)}`);

        showToast(`Successfully invested $${cost} in ${planName}`);
    }
}

// Add to your DOMContentLoaded
document.addEventListener('DOMContentLoaded', updateNavForInvestments);

/**
* TRANSACTIONS SECTION LOGIC
* Handles Withdrawals, Pending States, and Statement Downloads
*/

// 1. Extend Navigation for Transactions
const initTransactionNav = () => {
    const navLinks = document.querySelectorAll('.sidebar-item');
    const sections = {
        Dashboard: document.getElementById('dashboard-section'),
        Portfolio: document.getElementById('portfolio-section'),
        Investments: document.getElementById('investments-section'),
        Transactions: document.getElementById('transactions-section')
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.innerText.trim();
            Object.values(sections).forEach(sec => sec?.classList.add('hidden'));

            if (target.includes("Transactions")) {
                sections.Transactions.classList.remove('hidden');
                // Move the history table into this section view (stable id — fragile selector was often null)
                const historyTable = document.getElementById('dashboard-transaction-history');
                const historyHost = document.getElementById('history-container-copy');
                if (historyTable && historyHost) {
                    historyHost.appendChild(historyTable);
                } else {
                    console.warn('Transactions: history table or host not found');
                }
            }
            // ... (keep other navigation logic)
        });
    });
};

// 2. Withdrawal Logic
function openWithdrawModal() {
    const amount = prompt("Enter amount to withdraw to your linked bank account:");

    if (amount && !isNaN(amount)) {
        const val = parseFloat(amount);

        if (val > portfolioState.availableBalance) {
            return alert("Error: Withdrawal amount exceeds available balance.");
        }

        // Processing Simulation
        if (confirm(`Confirm withdrawal of $${val} to Bank Account ending in 4421?`)) {
            // Deduct from state
            portfolioState.availableBalance -= val;

            // Sync UI
            const balanceEl = document.getElementById('available-balance-value');
            if (balanceEl) balanceEl.innerText = `$${portfolioState.availableBalance.toLocaleString()}`;

            // Add to Pending UI
            addPendingRequest(val);

            // Log to Table
            addTransactionToTable(val, "Withdrawal", `WTH_${Math.floor(Math.random() * 100000)}`, "PENDING");

            showToast(`Withdrawal request for $${val} submitted.`);
        }
    }
}

// 3. UI Helper for Pending Requests
function addPendingRequest(amount) {
    const list = document.getElementById('pending-list');
    const item = document.createElement('div');
    item.className = "bg-slate-900/50 p-4 rounded-xl border border-dashed border-slate-700 flex justify-between items-center animate-in";
    item.innerHTML = `
        <div class="flex items-center gap-3">
            <span class="animate-pulse h-2 w-2 bg-amber-500 rounded-full"></span>
            <div>
                <p class="text-sm font-bold">Withdrawal Processing</p>
                <p class="text-[10px] text-slate-500">Just now</p>
            </div>
        </div>
        <p class="font-bold text-slate-300">$${amount.toLocaleString()}</p>
    `;
    list.prepend(item);
}

// 4. Connect Statement Download
document.addEventListener('DOMContentLoaded', () => {
    initTransactionNav();
    const statementBtn = document.getElementById('download-statement-btn');
    if (statementBtn) {
        statementBtn.addEventListener('click', () => {
            if (typeof generatePortfolioReport === 'function') {
                generatePortfolioReport();
            } else {
                showToast("Statement engine loading...");
            }
        });
    }
});

/**
 * GOALS SECTION MANAGEMENT
 * Handles goal progress calculation and AI suggestions
 */

const initGoalsManager = () => {
    const navLinks = document.querySelectorAll('.sidebar-item');
    const sections = {
        Dashboard: document.getElementById('dashboard-section'),
        Portfolio: document.getElementById('portfolio-section'),
        Investments: document.getElementById('investments-section'),
        Transactions: document.getElementById('transactions-section'),
        Goals: document.getElementById('goals-section')
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.innerText.trim();

            // 1. Navigation Switch
            if (target.includes("Goals")) {
                // Hide all sections
                Object.values(sections).forEach(sec => sec?.classList.add('hidden'));
                // Show Goals
                sections.Goals.classList.remove('hidden');
                sections.Goals.classList.add('animate-section');

                // 2. Trigger AI Calculation Simulation
                calculateContributionGaps();
            }
        });
    });
};


/* timezone shift logic */
let clockInterval; // Holds the timer
let currentMarketTime; // Holds the live Date object

async function updateMarketClock() {
    const zone = document.getElementById('timezone-select').value;
    const timeDisplay = document.getElementById('active-market-time');
    const dateDisplay = document.getElementById('active-market-date');

    // 1. Clear any existing local ticker
    if (clockInterval) clearInterval(clockInterval);

    try {
        // 2. Fetch "Source of Truth" from TimeAPI.io (No Key needed)
        const response = await fetch(`https://www.timeapi.io/api/Time/current/zone?timeZone=${zone}`);
        const data = await response.json();

        // 3. Initialize our local Date object with the API's time
        currentMarketTime = new Date(data.dateTime);

        // 4. Start the Local Ticker (Ticks every 1 second)
        clockInterval = setInterval(() => {
            currentMarketTime.setSeconds(currentMarketTime.getSeconds() + 1);

            // Format the time (HH:MM:SS)
            timeDisplay.innerText = currentMarketTime.toLocaleTimeString('en-GB', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            // Update the date label
            dateDisplay.innerText = currentMarketTime.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        }, 1000);

    } catch (error) {
        timeDisplay.innerText = "Error";
        console.error("Clock Sync Failed:", error);
    }
}

// 5. Event Listener for the Down-Arrow change
document.getElementById('timezone-select').addEventListener('change', updateMarketClock);

// Initialize on page load
document.addEventListener('DOMContentLoaded', updateMarketClock);

/**
 * AI Suggestion Logic
 * Simulates finding the gap between current progress and target date
 */
function calculateContributionGaps() {
    console.log("Analyzing goal timelines...");
    // In a real app, you'd calculate: (Target - Achieved) / Months Remaining
    // If the required contribution is > current SIP, show the AI Suggestion Card.
}

/**
 * Placeholder for the Modal
 */
function openCreateGoalModal() {
    const goalName = prompt("Enter your new goal name (e.g., Tesla Model 3):");
    if (goalName) {
        showToast(`Draft for '${goalName}' created. Setting up tracking...`);
    }
}

// Add to your existing initialization block
document.addEventListener('DOMContentLoaded', () => {
    initGoalsManager();
});

// reports//
/**
 * REPORTS SECTION MANAGEMENT
 * Integrates navigation and PDF report generation
 */

const initReportsManager = () => {
    const navLinks = document.querySelectorAll('.sidebar-item');
    const sections = {
        Dashboard: document.getElementById('dashboard-section'),
        Portfolio: document.getElementById('portfolio-section'),
        Investments: document.getElementById('investments-section'),
        Transactions: document.getElementById('transactions-section'),
        Goals: document.getElementById('goals-section'),
        Reports: document.getElementById('reports-section')
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.innerText.trim();

            if (target.includes("Reports")) {
                // Hide all sections
                Object.values(sections).forEach(sec => sec?.classList.add('hidden'));
                // Show Reports
                if (sections.Reports) {
                    sections.Reports.classList.remove('hidden');
                    sections.Reports.classList.add('animate-section');
                }
            }
        });
    });
};

/**
 * Enhanced Report Generator
 * Connects the UI buttons to the jsPDF engine
 */
function generateReport(type) {
    showToast(`Preparing your ${type} Report...`);

    // Using the previously defined generatePortfolioReport function as a base
    setTimeout(() => {
        if (typeof generatePortfolioReport === 'function') {
            generatePortfolioReport();
            showToast(`✅ ${type} Report Downloaded`);
        } else {
            alert(`Simulation: Generating ${type} Report PDF... \n[Requires jsPDF Library]`);
        }
    }, 1500);
}

// Add to your initialization block
document.addEventListener('DOMContentLoaded', () => {
    initReportsManager();
});

// risk //
/**
 * RISK PROFILE MANAGEMENT
 * Handles assessment logic and meter visualizations
 */

const initRiskManager = () => {
    const navLinks = document.querySelectorAll('.sidebar-item');
    const sections = {
        Dashboard: document.getElementById('dashboard-section'),
        Portfolio: document.getElementById('portfolio-section'),
        Investments: document.getElementById('investments-section'),
        Transactions: document.getElementById('transactions-section'),
        Goals: document.getElementById('goals-section'),
        Reports: document.getElementById('reports-section'),
        Risk: document.getElementById('risk-section')
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.innerText.trim();

            if (target.includes("Risk Profile")) {
                // Hide all sections
                Object.values(sections).forEach(sec => sec?.classList.add('hidden'));
                // Show Risk Section
                if (sections.Risk) {
                    sections.Risk.classList.remove('hidden');
                    sections.Risk.classList.add('animate-section');
                    // Reset meter animation
                    updateRiskMeter(65);
                }
            }
        });
    });
};

/**
 * Calculates the Risk Score based on questionnaire inputs
 */
function calculateRiskScore() {
    const q1 = parseInt(document.querySelector('input[name="q1"]:checked')?.value || 0);
    const q2 = parseInt(document.querySelector('input[name="q2"]:checked')?.value || 0);

    // Simulate scoring algorithm
    let baseScore = q1 + q2 + 25; // Base offset + answers

    updateRiskMeter(baseScore);
    showToast(`Risk Profile Updated to Score: ${baseScore}`);
}

/**
 * Updates the SVG Circle Meter
 */
function updateRiskMeter(score) {
    const circle = document.getElementById('risk-score-circle');
    const display = document.getElementById('risk-score-display');
    const label = document.getElementById('risk-category-label');

    if (!circle || !display) return;

    // Circumference of the circle (2 * PI * R) where R=88
    const circumference = 552.92;
    const offset = circumference - (score / 100) * circumference;

    circle.style.strokeDashoffset = offset;
    display.innerText = score;

    // Update Label & Color based on score
    if (score < 40) {
        label.innerText = "Conservative / Defensive";
        label.className = "inline-block px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-sm mb-2";
        circle.style.color = "#10b981"; // Emerald
    } else if (score < 75) {
        label.innerText = "Moderate / Growth";
        label.className = "inline-block px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 font-bold text-sm mb-2";
        circle.style.color = "#3b82f6"; // Blue
    } else {
        label.innerText = "Aggressive / Equity Focus";
        label.className = "inline-block px-4 py-1 rounded-full bg-rose-500/10 text-rose-400 font-bold text-sm mb-2";
        circle.style.color = "#ef4444"; // Rose
    }
}

// Ensure execution on load
document.addEventListener('DOMContentLoaded', () => {
    initRiskManager();
});

// document manager
/**
 * DOCUMENTS SECTION MANAGEMENT
 * Handles the SPA navigation for the documents vault and simulates
 * a secure PDF upload process.
 */

const initDocumentsManager = () => {
    // 1. Navigation Logic
    const navLinks = document.querySelectorAll('.sidebar-item');
    const sections = {
        Dashboard: document.getElementById('dashboard-section'),
        Portfolio: document.getElementById('portfolio-section'),
        Investments: document.getElementById('investments-section'),
        Transactions: document.getElementById('transactions-section'),
        Goals: document.getElementById('goals-section'),
        Reports: document.getElementById('reports-section'),
        Risk: document.getElementById('risk-section'),
        Documents: document.getElementById('documents-section')
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetText = link.innerText.trim();

            if (targetText.includes("Documents")) {
                // Hide all sections first
                Object.values(sections).forEach(sec => {
                    if (sec) {
                        sec.classList.add('hidden');
                        sec.classList.remove('animate-section');
                    }
                });

                // Show Documents section with animation
                if (sections.Documents) {
                    sections.Documents.classList.remove('hidden');
                    sections.Documents.classList.add('animate-section');
                    console.log("Secure Vault Accessed: Verifying KYC status...");
                }
            }
        });
    });

    // 2. PDF Upload Simulation
    const fileInput = document.getElementById('pdf-upload');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];

            if (file) {
                // Validate File Type
                if (file.type !== "application/pdf") {
                    showToast("❌ Error: Only PDF documents are allowed.");
                    fileInput.value = ""; // Reset input
                    return;
                }

                // Simulate encryption and upload process
                showToast(`🔒 Encrypting ${file.name}...`);

                setTimeout(() => {
                    showToast(`📤 Uploading to secure server...`);

                    setTimeout(() => {
                        showToast(`✅ ${file.name} successfully vaulted.`);
                        // Optional: Logic to append the new file to the "Recent Uploads" UI
                        fileInput.value = "";
                    }, 2000);
                }, 1500);
            }
        });
    }
};

// Global initializer
document.addEventListener('DOMContentLoaded', () => {
    if (typeof initDocumentsManager === 'function') {
        initDocumentsManager();
    }
});


// settings //
/**
 * SETTINGS SECTION MANAGEMENT
 * Handles main navigation to settings and sub-tab toggling
 */

const initSettingsManager = () => {
    const navLinks = document.querySelectorAll('.sidebar-item');
    const sections = {
        Dashboard: document.getElementById('dashboard-section'),
        Portfolio: document.getElementById('portfolio-section'),
        Investments: document.getElementById('investments-section'),
        Transactions: document.getElementById('transactions-section'),
        Goals: document.getElementById('goals-section'),
        Reports: document.getElementById('reports-section'),
        Risk: document.getElementById('risk-section'),
        Documents: document.getElementById('documents-section'),
        Settings: document.getElementById('settings-section')
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.innerText.trim();

            if (target.includes("Settings")) {
                Object.values(sections).forEach(sec => sec?.classList.add('hidden'));
                if (sections.Settings) {
                    sections.Settings.classList.remove('hidden');
                    sections.Settings.classList.add('animate-section');
                }
            }
        });
    });
};

/**
 * Switch internal tabs within the Settings section
 */
function switchSettingsTab(tabId) {
    // 1. Update Tab Buttons
    const buttons = document.querySelectorAll('.settings-tab-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active-settings-tab', 'bg-blue-600/10', 'text-blue-400');
        btn.classList.add('text-slate-400');
    });

    const activeBtn = event.currentTarget;
    activeBtn.classList.add('active-settings-tab', 'bg-blue-600/10', 'text-blue-400');
    activeBtn.classList.remove('text-slate-400');

    // 2. Switch Content Panels
    const panels = document.querySelectorAll('.settings-content-panel');
    panels.forEach(panel => panel.classList.add('hidden'));

    const targetPanel = document.getElementById(`settings-${tabId}`);
    if (targetPanel) {
        targetPanel.classList.remove('hidden');
        targetPanel.classList.add('animate-in');
    }
}

/**
 * Logout Simulation
 */
function handleLogout() {
    if (confirm("Are you sure you want to end your secure session?")) {
        showToast("Ending session... clearing cache...");
        setTimeout(() => {
            window.location.reload(); // Simple way to reset state
        }, 1500);
    }
}

document.addEventListener('DOMContentLoaded', initSettingsManager);

// taxsumary//
/**
 * TAX COMPLIANCE API SIMULATION
 * Mimics fetching realized gains from a tax-engine source
 */
async function fetchTaxData() {
    const btn = document.getElementById('tax-api-btn');
    const stcgEl = document.getElementById('stcg-value');
    const ltcgEl = document.getElementById('ltcg-value');

    // 1. Visual Loading State
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin">⏳</span> Authenticating with TaxBit API...`;

    // 2. Simulate Network Latency (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Mock JSON Data (This would usually come from your 'fetch' call)
    const mockApiResponse = {
        stcg_realized: 4520.50,
        ltcg_realized: 12840.00,
        compliance_score: "98%",
        last_sync: new Date().toISOString()
    };

    // 4. Update UI with "Count-Up" Effect
    animateValue(stcgEl, 0, mockApiResponse.stcg_realized, 1000);
    animateValue(ltcgEl, 0, mockApiResponse.ltcg_realized, 1000);

    // 5. Reset Button & Success Feedback
    btn.disabled = false;
    btn.innerHTML = `<span>✅</span> API Synced Successfully`;
    btn.classList.replace('bg-slate-800', 'bg-emerald-600/20');
    btn.classList.add('text-emerald-400', 'border-emerald-500/50');

    showToast("Tax Liability updated from External Sources.");
}

/**
 * Utility: Smooth Number Animation
 */
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentVal = (progress * (end - start) + start).toFixed(2);
        obj.innerHTML = `$${parseFloat(currentVal).toLocaleString()}`;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
// option trading//
/**
 * OPTIONS TRADING ENGINE
 */
function simulateOptionTrade(type, strike, premium) {
    const quantity = 1; // 1 Lot
    const totalCost = (premium * 100) * quantity; // Standard options multiplier

    if (totalCost > portfolioState.availableBalance) {
        return showToast("❌ Insufficient Margin for this Option trade.");
    }

    if (confirm(`Confirm ${type} Order?\nStrike: $${strike}\nTotal Premium: $${totalCost.toFixed(2)}`)) {
        // Deduct from balance
        portfolioState.availableBalance -= totalCost;

        // Update Dashboard UI
        const balEl = document.getElementById('available-balance-value');
        if (balEl) balEl.innerText = `$${portfolioState.availableBalance.toLocaleString()}`;

        // Log to transaction history
        addTransactionToTable(totalCost, `${type} Option`, `OPT_${Math.random().toString(36).substr(2, 6).toUpperCase()}`);

        showToast(`Successfully bought ${type} @ ${strike}. Premium paid: $${totalCost}`);
    }
}


// explore giants //
const FINNHUB_KEY = "d6v6h49r01qig546ml10d6v6h49r01qig546ml1g";
const TICKERS = ["AAPL", "TSLA", "NVDA", "AMZN", "MSFT", "GOOGL", "BRK.B", "META"];
let giants = []; // We will fill this from the API

// 1. Function to fetch and format data
async function initializeMarketData() {
    try {
        const fetchPromises = TICKERS.map(async (symbol) => {
            // Fetch Quote (for Price & Change)
            const quoteRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`);
            const quote = await quoteRes.json();

            // Fetch Company Profile (for Name and Logo)
            const profileRes = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`);
            const profile = await profileRes.json();

            // Fetch Recommendation Trends (to determine Bullish/Bearish)
            const recRes = await fetch(`https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${FINNHUB_KEY}`);
            const recs = await recRes.json();
            const latestRec = recs[0] || { buy: 1, sell: 0 };

            // Determine Sentiment Logic
            const sentiment = (latestRec.buy + latestRec.strongBuy) >= (latestRec.sell + latestRec.strongSell) ? "Bullish" : "Bearish";

            // Map Finnhub data to YOUR 'giants' format
            return {
                n: profile.name || symbol,          // Name
                f: symbol,                          // Ticker
                cagr: quote.dp.toFixed(2),          // Daily Percentage Change (mapped to 'cagr' for your layout)
                start: profile.ipo ? profile.ipo.split('-')[0] : "1990", // Start year from IPO
                icon: symbol === "TSLA" ? "⚡" : "📈", // You can keep emojis or use profile.logo
                sent: sentiment,
                updated: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
            };
        });

        giants = await Promise.all(fetchPromises);

        // 2. Once data is ready, run UI only if Giants helpers exist (e.g. on 1.html)
        if (typeof populateGiants === 'function') populateGiants();
        if (giants.length > 0 && typeof visualizeGiant === 'function') visualizeGiant(giants[0].n);

    } catch (error) {
        console.error("Fin-hub Error:", error);
        showToast("Error fetching live data");
    }
}

// 3. Market Giants: only run on pages that include #giantInceptionChart + #giants-list (not on 2.html)
window.addEventListener('load', () => {
    const canvas = document.getElementById('giantInceptionChart');
    const list = document.getElementById('giants-list');
    if (!canvas || !list) return;

    const ctx = canvas.getContext('2d');
    if (typeof initializeChart === 'function') initializeChart(ctx);

    initializeMarketData();
});

// dynamic user //
const MARKET_RULES = {
    "America/New_York": { open: "09:30", close: "16:00", name: "NYSE/NASDAQ" },
    "Europe/London": { open: "08:00", close: "16:30", name: "LSE" },
    "Asia/Kolkata": { open: "09:15", close: "15:30", name: "NSE/BSE" },
    "Asia/Tokyo": { open: "09:00", close: "15:00", name: "JPX", break: ["11:30", "12:30"] }, // Tokyo has lunch!
    "Asia/Hong_Kong": { open: "09:30", close: "16:00", name: "HKEX" }
};

async function shiftMarketContext(timeZone) {
    const res = await fetch(`https://timeapi.io/api/Time/current/zone?timeZone=${timeZone}`);
    const data = await res.json();

    const currentTime = `${data.hour.toString().padStart(2, '0')}:${data.minute.toString().padStart(2, '0')}`;
    const rules = MARKET_RULES[timeZone];

    // Logic: Compare current time string to Open/Close strings
    const isOpen = currentTime >= rules.open && currentTime <= rules.close;

    // Determine Purchase Type
    // If Open: Instant Execution. If Closed: Scheduled/Limit Order.
    const purchaseMode = isOpen ? "⚡ INSTANT EXECUTION" : "⏳ SCHEDULED (NEXT OPEN)";

    return {
        status: isOpen ? "🟢 OPEN" : "🔴 CLOSED",
        localTime: currentTime,
        market: rules.name,
        action: purchaseMode,
        raw: data
    };
}

// Executing for transactions
async function handleBuyAction(assetId, amount, price) {
    const { data, error } = await supabase
        .from('transactions')
        .insert([
            {
                asset_id: assetId,
                transaction_type: 'BUY',
                quantity: amount,
                price_at_time: price
            }
        ]);

    if (error) {
        showToast("Error saving transaction.");
    } else {
        showToast("Investment added to history!");
        // portfolio_logic.js will detect this insert automatically
    }
}

// completed transitions 
// Inside dashboard.js
const TransactionHistory = {
    init() {
        this.fetchRecentTransactions();
        this.listenForChanges();
    },

    async fetchRecentTransactions() {
        const { data, error } = await supabase
            .from('transactions')
            .select(`
                *,
                assets (symbol, name)
            `)
            .order('created_at', { ascending: false })
            .limit(10);

        if (!error) this.renderTable(data);
    },

    listenForChanges() {
        supabase
            .channel('dashboard-history')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'transactions' },
                (payload) => {
                    // Refresh the list immediately when a new trade is made
                    this.fetchRecentTransactions();
                }
            )
            .subscribe();
    },

    renderTable(transactions) {
        const tableBody = document.getElementById('transaction-history-body');
        if (!tableBody) return;

        tableBody.innerHTML = transactions.map(t => `
            <div class="flex justify-between items-center p-4 border-b border-slate-800">
                <div>
                    <p class="font-bold">${t.assets.symbol}</p>
                    <p class="text-xs text-slate-500">${new Date(t.created_at).toLocaleDateString()}</p>
                </div>
                <div class="text-right">
                    <p class="${t.transaction_type === 'BUY' ? 'text-emerald-400' : 'text-red-400'} font-bold">
                        ${t.transaction_type} ${t.quantity}
                    </p>
                    <p class="text-xs text-slate-500">$${t.price_at_time}</p>
                </div>
            </div>
        `).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => TransactionHistory.init());

// At the bottom of dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    initGlobalNavigation(); // Run navigation first!
    initCharts();
    initPayments();

    // Wrap failing APIs so they don't break the navigation
    try {
        shiftMarketContext('Asia/Kolkata');
    } catch (e) {
        console.warn("Market API unavailable, skipping...");
    }
});





// CONFIGURATION CENTER
const API_KEYS = {
    FINNHUB: "YOUR_FINNHUB_KEY",
    LOCATION: "https://ipapi.co/json/" // No key needed for basic tier
};

// ASSET DATA MAP (The stocks/bonds for each region)
const MARKET_DATA = {
    "IN": { // India
        country: "India",
        stocks: ["RELIANCE.NS", "TCS.NS"],
        sips: ["Nifty 50 Index Fund", "HDFC Mid-Cap"],
        bonds: ["RBI Tax-Free Bonds", "Corporate AAA"],
        currency: "INR"
    },
    "US": { // USA
        country: "USA",
        stocks: ["AAPL", "NVDA"],
        sips: ["Vanguard S&P 500", "Nasdaq 100 QQQ"],
        bonds: ["10-Year Treasury", "Municipal Bonds"],
        currency: "USD"
    }
};



let currentRegion = "US"; // Default

async function detectUserLocation() {
    try {
        const response = await fetch(API_KEYS.LOCATION);
        const data = await response.json();
        const userCountry = data.country_code; // e.g., "IN"

        if (userCountry !== "US" && MARKET_DATA[userCountry]) {
            offerRegionalSwitch(userCountry);
        } else {
            renderDashboard("US");
        }
    } catch (e) {
        renderDashboard("US"); // Fallback
    }
}

function offerRegionalSwitch(newRegion) {
    const notify = document.getElementById('region-prompt');
    notify.innerHTML = `
        <div class="bg-blue-600/20 p-3 rounded-lg border border-blue-500 flex justify-between items-center">
            <span class="text-[10px]">📍 Detected you are in ${MARKET_DATA[newRegion].country}. Switch to local Markets?</span>
            <button onclick="renderDashboard('${newRegion}')" class="bg-blue-600 px-3 py-1 rounded text-[10px] font-bold">SWITCH</button>
        </div>
    `;
    notify.classList.remove('hidden');
}

function renderDashboard(region) {
    const data = MARKET_DATA[region];
    const list = document.getElementById('giants-list');

    // Clear and Hide the prompt
    document.getElementById('region-prompt').classList.add('hidden');

    // Render Stocks, SIPs, and Bonds into your UI
    list.innerHTML = `
        ${data.stocks.map(s => createCard(s, 'STOCK', '📈')).join('')}
        
        ${data.sips.map(s => createCard(s, 'SIP/FUND', '💰')).join('')}
        
        ${data.bonds.map(b => createCard(b, 'BOND', '📜')).join('')}
    `;

    showToast(`Dashboard Sync: ${data.country} Portfolio`);
}

// Re-usable Card Generator (using your existing CSS classes)
function createCard(name, type, icon) {
    return `
        <div class="card-sharp p-5 giant-card group flex flex-col justify-between">
            <div class="flex justify-between items-start mb-4">
                <span class="text-2xl">${icon}</span>
                <span class="px-2 py-0.5 rounded text-[7px] font-black uppercase bg-slate-800 text-slate-400">${type}</span>
            </div>
            <div>
                <h4 class="text-sm font-bold text-slate-100">${name}</h4>
                <p class="text-[9px] text-slate-500 uppercase tracking-tighter mt-1">Institutional Asset</p>
            </div>
            <div class="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                <span class="text-[8px] font-bold text-slate-500 uppercase">Status</span>
                <span class="text-[10px] font-black text-emerald-500">LIVE</span>
            </div>
        </div>
    `;
}

// Addon to your primary JS file
const InviteModule = {
    init() {
        const inviteBtn = document.getElementById('invite-trigger');
        if (inviteBtn) {
            inviteBtn.addEventListener('click', () => this.showModal());
        }
    },

    // Add this to handle the API handshake
    async sendInvite(email) {
        const response = await fetch('/api/invite', {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
    }
};

// Initialize only if on the dashboard page
if (window.location.pathname.includes('dashboard')) {
    InviteModule.init();
}


// Add this to your existing dashboard.js
async function analyzeTicker() {
    const ticker = document.getElementById('ticker-input').value.toUpperCase();
    if (!ticker) return;

    try {
        // Now calling your local Node.js server
        const response = await fetch(`http://localhost:3000/api/analyze/${ticker}`);
        const data = await response.json();

        // Update UI
        alert(`AI Suggestion for ${ticker}: ${data.ai_suggestion}`);
    } catch (error) {
        console.error("Error:", error);
    }
}


// ==========================================
// 6.5 KYC & DOCUMENT VERIFICATION LOGIC
// ==========================================

function openKYCVerificationModal() {
    const modal = document.getElementById('kyc-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.getElementById('kyc-step-1').classList.remove('hidden');
        document.getElementById('kyc-loading-state').classList.add('hidden');
        document.getElementById('kyc-result-state').classList.add('hidden');
    }
}

function closeKYCVerificationModal() {
    const modal = document.getElementById('kyc-modal');
    if (modal) modal.classList.add('hidden');
}

function toggleEngineUI() {
    const engine = document.getElementById('kyc-engine-type').value;
    document.getElementById('kra-input-group').classList.toggle('hidden', engine !== 'kra');
    document.getElementById('diro-input-group').classList.toggle('hidden', engine !== 'diro');
}

function handleFileSelected(e) {
    const file = e.target.files[0];
    if (file) {
        document.getElementById('file-name-display').innerText = `Selected: ${file.name}`;
    }
}

// REAL Execution Pipeline (Talking to your Backend)
async function executeVerificationPipeline() {
    const engine = document.getElementById('kyc-engine-type').value;

    document.getElementById('kyc-step-1').classList.add('hidden');
    document.getElementById('kyc-loading-state').classList.remove('hidden');

    const progressText = document.getElementById('kyc-progress-text');

    try {
        if (engine === 'kra') {
            const pan = document.getElementById('pan-number-input').value.trim();
            if (pan.length !== 10) throw new Error("Invalid PAN length. Must be 10 characters.");

            progressText.innerText = "Querying KRA via Backend...";

            // 1. Send data to YOUR backend (main.py)
            const response = await fetch('/api/verify-pan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pan: pan })
            });

            const data = await response.json();

            // 2. Handle Backend Response
            if (data.verified) {
                showKYCSuccessState("KYC Status: VALIDATED", `
                    <div><strong>PAN:</strong> ${pan.toUpperCase()}</div>
                    <div><strong>Status:</strong> ${data.kra_status || 'Validated'}</div>
                `);
            } else {
                showKYCErrorState("KYC Failed", "PAN not found in KRA registry or verification failed.");
            }

        } else if (engine === 'diro') {
            const fileInput = document.getElementById('kyc-file-input');
            if (!fileInput.files.length) throw new Error("No PDF file selected for DIRO proof.");

            progressText.innerText = "Sending PDF to Backend for DIRO Check...";

            const formData = new FormData();
            formData.append('document', fileInput.files[0]);

            // 1. Send file to YOUR backend (main.py)
            const response = await fetch('/api/verify-diro', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            // 2. Handle Backend Response
            if (data.isAuthentic) {
                showKYCSuccessState("DIRO Proof: AUTHENTIC", `
                    <div><strong>Integrity:</strong> Unaltered</div>
                    <div><strong>Hash:</strong> ${data.blockchain_hash || 'Verified'}</div>
                `);
            } else {
                showKYCErrorState("Tamper Alert", "Document failed DIRO cryptographic check.");
            }
        }
    } catch (error) {
        showKYCErrorState("Error Executing Request", error.message);
    }
}

// UI Helpers specific to KYC
function showKYCSuccessState(title, htmlDetails) {
    document.getElementById('kyc-loading-state').classList.add('hidden');
    document.getElementById('kyc-result-state').classList.remove('hidden');
    document.getElementById('kyc-status-icon').innerText = "✅";

    const titleEl = document.getElementById('kyc-status-title');
    titleEl.innerText = title;
    titleEl.className = "text-base font-bold text-emerald-400";

    document.getElementById('kyc-status-details').innerHTML = htmlDetails;

    const badge = document.getElementById('kyc-status-badge');
    if (badge) {
        badge.innerHTML = "VERIFIED KYC ✅";
        badge.className = "text-[10px] text-emerald-500 font-bold animate-pulse hover:underline flex items-center justify-end gap-1";
    }
}

function showKYCErrorState(title, message) {
    document.getElementById('kyc-loading-state').classList.add('hidden');
    document.getElementById('kyc-result-state').classList.remove('hidden');
    document.getElementById('kyc-status-icon').innerText = "🚨";

    const titleEl = document.getElementById('kyc-status-title');
    titleEl.innerText = title;
    titleEl.className = "text-base font-bold text-rose-500";

    document.getElementById('kyc-status-details').innerHTML = `<div>${message}</div>`;
}
// ==========================================
// END OF KYC LOGIC
// ==========================================