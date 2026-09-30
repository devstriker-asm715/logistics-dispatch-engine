/**
 * PORTFOLIO SERVICE
 * Handles: API fetching, Performance Stats, and Data Normalization
 */
export const PortfolioService = {
    // Calculate performance stats for each holding
    calculateStats(holdings) {
        return holdings.map(stock => {
            const currentVal = stock.qty * stock.ltp;
            const costBasis = stock.qty * stock.avgPrice;
            const gainLoss = currentVal - costBasis;
            const gainLossPct = ((gainLoss / costBasis) * 100).toFixed(2);

            return {
                ...stock,
                currentVal,
                gainLoss,
                gainLossPct: parseFloat(gainLossPct)
            };
        });
    },

    // Mock API Fetch (Replace this with your actual Supabase/API call)
    async getMarketData() {
        // Here you would call: await supabase.from('holdings').select('*')
        return [
            { symbol: 'AAPL', name: 'Apple Inc.', qty: 45, avgPrice: 150.20, ltp: 182.40, type: 'EQUITY' },
            { symbol: 'BND', name: 'Vanguard Total Bond', qty: 120, avgPrice: 72.10, ltp: 71.80, type: 'DEBT' }
        ];
    }
};