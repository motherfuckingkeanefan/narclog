document.addEventListener('DOMContentLoaded', () => {
    const logForm = document.getElementById('log-form');
    const eventLogs = document.getElementById('event-logs');
    const lastEventCounter = document.getElementById('days-since-last');
    const exportBtn = document.getElementById('export-btn');
    
    let logs = JSON.parse(localStorage.getItem('logs')) || [];
    
    const updateLastEventCounter = () => {
        if (logs.length > 0) {
            // Find the latest date in the logs
            const latestLogDate = logs
                .map(log => new Date(log.date))
                .reduce((latest, current) => (current > latest ? current : latest));
            
            const diffDays = Math.floor((new Date() - latestLogDate) / (1000 * 60 * 60 * 24));
            lastEventCounter.textContent = diffDays;
        } else {
            lastEventCounter.textContent = 0;
        }
    };

    const renderLogs = () => {
        // Sort logs by newest date first
        logs.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Clear and re-render logs
        eventLogs.innerHTML = '';
        logs.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${log.date}</td>
                <td>${log.type}</td>
                <td>${log.description}</td>
            `;
            eventLogs.appendChild(row);
        });
    };

    const saveLogs = () => {
        localStorage.setItem('logs', JSON.stringify(logs));
    };

    logForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('event-date').value;
        const type = document.getElementById('event-type').value;
        const description = document.getElementById('event-description').value;

        // Add new log and sort by date
        logs.push({ date, type, description });
        logs.sort((a, b) => new Date(b.date) - new Date(a.date)); // Ensure sorted order

        saveLogs();
        renderLogs();
        updateLastEventCounter();

        logForm.reset();
    });

    exportBtn.addEventListener('click', () => {
        let csvContent = 'Datum,Type,Beschrijving\n';
        logs.forEach(log => {
            csvContent += `${log.date},${log.type},${log.description}\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'narcistische_gedragslogboek.csv';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Initial render
    renderLogs();
    updateLastEventCounter();
});
