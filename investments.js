/**
 * INVESTMENT HUB ENGINE
 * Handles: Tab Toggling, Risk-Aware Investing, and Transaction Logging
 */

const InvestmentManager = {
    // 1. Configuration & Thresholds
    config: {
        riskThreshold: 10.0, // Any investment > 10% return is flagged as "High Risk"
        balance: 12040.00     // Initial cash balance
    },

    // 2. Tab Switcher Logic
    switchTab(mode) {
        const exploreTab = document.getElementById('investments-explore-tab');
        const sipsTab = document.getElementById('investments-sips-tab');
        const exploreContent = document.getElementById('investments-explore-content');
        const sipsContent = document.getElementById('investments-sips-content');

        if (!exploreTab || !sipsTab || !exploreContent || !sipsContent) return;

        const isExplore = mode === 'explore';

        // Toggle Visibility
        exploreContent.classList.toggle('hidden', !isExplore);
        sipsContent.classList.toggle('hidden', isExplore);

        // Update Button Styles (Tailwind)
        exploreTab.className = isExplore
            ? 'px-4 py-1.5 text-xs font-bold bg-blue-600 rounded-md text-white'
            : 'px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-white';

        sipsTab.className = !isExplore
            ? 'px-4 py-1.5 text-xs font-bold bg-blue-600 rounded-md text-white'
            : 'px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-white';

        showToast(`Viewing ${mode.charAt(0).toUpperCase() + mode.slice(1)} Hub`);
    },

    // 3. Risk-Aware Investment Execution
    async openInvestModal(planName, returns) {
        // Warning for High Risk
        if (returns > this.config.riskThreshold) {
            const proceed = confirm(`⚠️ RISK WARNING: ${planName} has estimated returns of ${returns}%. \n\nHigh-return plans often carry significant volatility. Do you wish to proceed?`);
            if (!proceed) return;
        }

        const amountInput = prompt(`Enter amount to invest in ${planName}:`, "500");
        const amount = parseFloat(amountInput);

        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid investment amount.");
            return;
        }

        // Balance Check
        if (amount > this.config.balance) {
            alert("❌ Insufficient Funds! Please add money to your account first.");
            return;
        }

        // Execute "Trade"
        this.config.balance -= amount;
        this.logInvestment(planName, amount);
        this.updateGlobalBalance();

        showToast(`✅ Successfully invested $${amount.toLocaleString()} in ${planName}`);
    },

    // 4. Log to Table with Color Formatting
    logInvestment(plan, amount) {
        const tableBody = document.querySelector('#investments-sips-content table tbody');
        if (!tableBody) return;

        const txnId = `SIP_${Math.floor(Math.random() * 900000) + 100000}`;
        const date = new Date().toISOString().split('T')[0];

        const row = document.createElement('tr');
        row.className = "border-b border-slate-800/50 bg-emerald-500/5 animate-pulse";
        row.innerHTML = `
            <td class="px-6 py-4 font-mono text-xs text-slate-400">${txnId}</td>
            <td class="px-6 py-4 text-xs text-white">${plan}</td>
            <td class="px-6 py-4 text-emerald-500 font-bold">$${amount.toLocaleString()}</td>
            <td class="px-6 py-4">
                <span class="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full text-[10px]">SUCCESS</span>
            </td>
            <td class="px-6 py-4 text-xs text-slate-500">${date}</td>
        `;

        // Insert at top of table
        tableBody.prepend(row);

        // Remove the pulse effect after 3 seconds
        setTimeout(() => row.classList.remove('animate-pulse', 'bg-emerald-500/5'), 3000);
    },

    // 5. Sync with Global Dashboard
    updateGlobalBalance() {
        const balanceEl = document.getElementById('available-balance-value');
        if (balanceEl) {
            balanceEl.innerText = `$${this.config.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
        }
    }
};

// Global Exposure (so HTML onclick can find them)  
window.switchInvestmentTab = (mode) => InvestmentManager.switchTab(mode);
window.openInvestModal = (name, ret) => InvestmentManager.openInvestModal(name, ret);