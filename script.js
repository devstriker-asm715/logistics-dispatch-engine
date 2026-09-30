/**
 * GLOBAL APPLICATION STATE
 */
let portfolioState = {
    totalValue: 124500.00,
    availableBalance: 12040.00
};

/**
 * APP INITIALIZER (Waits for HTML to load first)
 */
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initNavigation();
    initCharts();
    initPayments();
    startLiveSimulation();
    console.log("GrahamAI Core Engine Started.");
});

/**
 * MOBILE MENU SYSTEM
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.querySelector('aside');

    // Safety check: Only run if these elements actually exist on the page
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking a link (if on mobile)
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    sidebar.classList.remove('active');
                }
            });
        });
    }
}

/**
 * NAVIGATION SYSTEM
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-item');
    const sections = {
        Dashboard: document.getElementById('dashboard-section'),
        Portfolio: document.getElementById('portfolio-section'),
        Investments: document.getElementById('investments-section')
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetText = link.innerText.trim();

            // Update Sidebar Visuals
            navLinks.forEach(item => item.classList.remove('active-tab'));
            link.classList.add('active-tab');

            // Hide All Sections safely
            Object.values(sections).forEach(sec => {
                if (sec) sec.classList.add('hidden');
            });

            // Show Targeted Section
            if (targetText.includes("Dashboard") && sections.Dashboard) {
                sections.Dashboard.classList.remove('hidden');
            } else if (targetText.includes("Portfolio") && sections.Portfolio) {
                sections.Portfolio.classList.remove('hidden');
            } else if (targetText.includes("Investments") && sections.Investments) {
                sections.Investments.classList.remove('hidden');
            } else {
                showToast(`Accessing ${targetText}... Section loading.`);
            }
        });
    });
}

/**
 * AI ANALYSIS SIMULATION
 */
function analyzeTicker() {
    const tickerInput = document.getElementById('ticker-input');
    if (!tickerInput) return;

    const ticker = tickerInput.value.trim().toUpperCase();
    if (!ticker) return showToast("⚠️ Please enter a ticker symbol");

    showToast(`Analyzing ${ticker} via GrahamAI...`);

    setTimeout(() => {
        alert(`GrahamAI Analysis: ${ticker}\n\nDecision: BUY\nReasoning: Intrinsic value calculated at $${(Math.random() * 200 + 50).toFixed(2)} with strong margin of safety.`);
    }, 1800);
}

/**
 * CHARTING ENGINE
 */
function initCharts() {
    // Line Chart
    const performanceCanvas = document.getElementById('performanceChart');
    if (performanceCanvas) {
        const ctxLine = performanceCanvas.getContext('2d');
        new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
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

    // Donut Chart
    const allocationCanvas = document.getElementById('allocationChart');
    if (allocationCanvas) {
        const ctxDonut = allocationCanvas.getContext('2d');
        new Chart(ctxDonut, {
            type: 'doughnut',
            data: {
                labels: ['Equity', 'Debt', 'Gold'],
                datasets: [{
                    data: [60, 30, 10],
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
                    borderWidth: 0,
                    hoverOffset: 15
                }]
            },
            options: {
                cutout: '80%',
                plugins: { legend: { display: false } }
            }
        });
    }
}

/**
 * PAYMENT & FUNDING LOGIC
 */
function togglePaymentModal(show) {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.classList.toggle('hidden', !show);
    }
}

function initPayments() {
    const paymentForm = document.getElementById('payment-form');
    const loader = document.getElementById('payment-loader');

    if (paymentForm && loader) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const amountInput = document.getElementById('deposit-amount');
            const upiInput = document.getElementById('upi-id');
            const cardInput = document.getElementById('card-num');

            const amount = amountInput ? parseFloat(amountInput.value) : 0;
            const upi = upiInput ? upiInput.value : '';
            const card = cardInput ? cardInput.value : '';

            if (!upi && !card) return alert("Please provide card details or UPI ID.");

            togglePaymentModal(false);
            loader.classList.remove('hidden');

            // Simulate Bank/External Redirect
            setTimeout(() => {
                const txnId = `TXN_${Math.floor(Math.random() * 1000000)}`;
                const method = upi ? 'UPI' : 'Credit Card';

                loader.innerHTML = `
                <div class="text-center p-12 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl animate-section max-w-sm">
                    <div class="text-7xl mb-8">✅</div>
                    <h2 class="text-3xl font-bold mb-3">Payment Verified</h2>
                    <p class="text-slate-500 mb-10 text-sm">Auth ID: ${txnId}</p>
                    <button id="return-btn" class="bg-blue-600 hover:bg-blue-500 px-10 py-4 rounded-2xl font-bold transition w-full">Finalize Deposit</button>
                </div>
                `;

                const returnBtn = document.getElementById('return-btn');
                if (returnBtn) {
                    returnBtn.addEventListener('click', () => {
                        // UPDATE APP STATE
                        portfolioState.availableBalance += amount;

                        const balanceDisplay = document.getElementById('available-balance-value');
                        if (balanceDisplay) {
                            balanceDisplay.innerText = `$${portfolioState.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
                        }

                        // LOG TO TRANSACTION LIST
                        addTransactionToTable(amount, method, txnId);

                        // RESET OVERLAYS
                        loader.classList.add('hidden');
                        loader.innerHTML = `
                        <div class="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mb-8"></div>
                        <h2 class="text-2xl font-bold text-white mb-2">Connecting to Secure Vault</h2>
                        <p class="text-slate-500 text-sm tracking-widest uppercase">Encryption Handshake in Progress...</p>
                        `;
                        showToast(`Successfully deposited $${amount.toLocaleString()}`);
                    });
                }
            }, 2800);
        });
    }
}

function addTransactionToTable(amount, method, txnId) {
    const tableBody = document.getElementById('transaction-history-body');
    if (!tableBody) return;

    const now = new Date().toISOString().split('T')[0];
    const newRow = document.createElement('tr');
    newRow.className = "hover:bg-slate-800/20 transition-all bg-blue-500/5";

    newRow.innerHTML = `
    <td class="px-8 py-5 font-mono text-xs text-slate-400">${txnId}</td>
    <td class="px-8 py-5 text-slate-100 font-bold">${method} Top-up</td>
    <td class="px-8 py-5 text-emerald-500 font-bold">+$${parseFloat(amount).toLocaleString()}</td>
    <td class="px-8 py-5"><span class="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Success</span></td>
    <td class="px-8 py-5 text-right text-slate-500">${now}</td>
    `;
    tableBody.insertBefore(newRow, tableBody.firstChild);
    setTimeout(() => newRow.classList.remove('bg-blue-500/5'), 4000);
}

/**
 * UTILITY: LIVE PRICE TICKER
 */
function startLiveSimulation() {
    const totalEl = document.getElementById('total-portfolio-value');
    if (totalEl) {
        setInterval(() => {
            const fluctuation = (Math.random() * 10 - 5);
            portfolioState.totalValue += fluctuation;
            totalEl.innerText = `$${portfolioState.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

            // Visual feedback
            totalEl.style.color = fluctuation > 0 ? '#10b981' : '#ef4444';
            setTimeout(() => totalEl.style.color = '', 600);
        }, 4000);
    }
}

/**
 * UTILITY: UI TOAST
 */
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-success'; // Ensure you have this class in your CSS

    // Fallback styling just in case CSS is missing
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = '#1e293b';
    toast.style.color = '#fff';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '9999';
    toast.style.transition = 'opacity 0.5s ease';

    toast.innerHTML = `<span>✔️</span> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

/**
 * AUTH SIMULATION
 */
function handleLogout() {
    if (confirm("Terminate your secure session?")) {
        window.location.reload();
    }
}