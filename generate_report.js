/**
 * GrahamAI Portfolio Report Generator
 * Uses jsPDF to create a professional financial summary
 */

const generatePortfolioReport = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 1. Setup Branding & Colors
    const primaryColor = [15, 23, 42]; // Slate 900
    const accentColor = [59, 130, 246]; // Blue 500

    // 2. Header Information
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text("GrahamAI", 14, 20);
A
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Investment Portfolio Performance Report", 14, 28);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 34);

    // 3. Current Portfolio Summary (Global State)
    doc.setDrawColor(200);
    doc.line(14, 40, 196, 40); // Horizontal Line

    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("PORTFOLIO SUMMARY", 14, 50);

    // Pulling data from your global portfolioState
    doc.setFont("helvetica", "normal");
    doc.text(`Total Portfolio Value: $${portfolioState.totalValue.toLocaleString()}`, 14, 60);
    doc.text(`Available Cash Balance: $${portfolioState.availableBalance.toLocaleString()}`, 14, 66);
    doc.text(`Overall Return Rate: 18.4%`, 14, 72);

    // 4. ACTUAL HOLDINGS TABLE (Scraped from the DOM)
    doc.setFont("helvetica", "bold");
    doc.text("CURRENT ASSET HOLDINGS", 14, 85);

    const holdingsData = [];
    const holdingsRows = document.querySelectorAll("#portfolio-section tbody tr");

    holdingsRows.forEach(row => {
        const cols = row.querySelectorAll("td");
        if (cols.length > 0) {
            holdingsData.push([
                cols[0].innerText.split('\n')[0], // Asset Name
                cols[1].innerText,              // Qty
                cols[2].innerText,              // Avg Price
                cols[3].innerText,              // LTP
                cols[4].innerText               // P&L
            ]);
        }
    });

    doc.autoTable({
        startY: 90,
        head: [['Asset', 'Qty', 'Avg Price', 'Current Price', 'P&L']],
        body: holdingsData,
        theme: 'striped',
        headStyles: { fillColor: primaryColor }
    });

    // 5. INVESTMENT HISTORY TABLE
    const finalY = doc.lastAutoTable.finalY || 150;
    doc.setFont("helvetica", "bold");
    doc.text("RECENT INVESTMENT HISTORY", 14, finalY + 15);

    const historyData = [];
    const historyRows = document.querySelectorAll("#transaction-history-body tr");

    historyRows.forEach(row => {
        const cols = row.querySelectorAll("td");
        if (cols.length > 0) {
            historyData.push([
                cols[0].innerText, // TXN ID
                cols[1].innerText, // Method
                cols[2].innerText, // Amount
                cols[4].innerText  // Date
            ]);
        }
    });

    doc.autoTable({
        startY: finalY + 20,
        head: [['Transaction ID', 'Method', 'Amount', 'Date']],
        body: historyData,
        theme: 'grid',
        headStyles: { fillColor: [51, 65, 85] } // Slate 700
    });

    // 6. Footer Disclaimer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("Disclaimer: Investment returns are subject to market risks. GrahamAI is an algorithmic advisory tool.", 14, 285);
    }

    // 7. Download PDF
    doc.save(`GrahamAI_Report_${new Date().getTime()}.pdf`);
};

// Connect to the button
document.addEventListener('DOMContentLoaded', () => {
    const reportBtn = document.querySelector('button:contains("Download Report")') ||
        document.getElementById('download-report-btn'); // Fallback

    if (reportBtn) {
        reportBtn.addEventListener('click', generatePortfolioReport);
    }
});