document.addEventListener('DOMContentLoaded', (event) => {
    let customerData, quantityData, revenueData, topProductsData;
    let customerChart, quantityChart, revenueChart, topProductsChart;

    // Fetch the JSON data from multiple online sources
    Promise.all([
        fetch('https://gist.githubusercontent.com/ElckyMT/a997876ccbaa45dae38bfb9b08eea7b5/raw/f7b0734a080a4319f5ade8922605fe5534a48034/customer.json').then(res => res.json()),
        fetch('https://gist.githubusercontent.com/ElckyMT/03de6d48068bdfdea58a6fb947e3a4f3/raw/a018ba618368bbef1e39c2430166fa49f1a11568/quantity.json').then(res => res.json()),
        fetch('https://gist.githubusercontent.com/ElckyMT/30419f4c641210d6dddd73aeb1181425/raw/ca34891140e8d400e16d29a4564a133a54360d54/revenue.json').then(res => res.json()),
        fetch('https://gist.githubusercontent.com/ElckyMT/54c447b88edddde5fcd18a12bdbf9a13/raw/c887b30b29bebbe7b3c4ff18246c7a7d7390bbda/top_5.json').then(res => res.json())
    ]).then(([customerRes, quantityRes, revenueRes, topProductsRes]) => {
        customerData = customerRes;
        quantityData = quantityRes;
        revenueData = revenueRes;
        topProductsData = topProductsRes;
        
        // Initialize dashboard with all data
        updateDashboard(customerData, quantityData, revenueData, topProductsData);

        // Add event listener to the dropdown
        document.getElementById('filter-month').addEventListener('change', (event) => {
            const selectedMonth = event.target.value;
            updateDashboard(customerData, quantityData, revenueData, topProductsData, selectedMonth);
        });
    }).catch(error => {
        console.error('Error fetching data:', error);
    });

    function updateDashboard(customerData, quantityData, revenueData, topProductsData, selectedMonth = '') {
        // Filter data based on the selected month if applicable
        const filteredCustomerData = selectedMonth ? 
            { Customer_Month: customerData.Customer_Month.filter(item => item.Month === selectedMonth) } : customerData;

        const filteredQuantityData = selectedMonth ? 
            { Quantity_Month: quantityData.Quantity_Month.filter(item => item.Month === selectedMonth) } : quantityData;

        const filteredRevenueData = selectedMonth ? 
            { Revenue_Month: revenueData.Revenue_Month.filter(item => item.Month === selectedMonth) } : revenueData;

        const filteredTopProductsData = selectedMonth ? 
            { Top5_Month: topProductsData.Top5_Month.filter(item => item.Month === selectedMonth) } : topProductsData;

        // Update Customer Section
        const customerElement = document.getElementById('customer');
        const totalCustomers = filteredCustomerData.Customer_Month.reduce((acc, item) => acc + item.Customer, 0);
        customerElement.textContent = `Total Customers: ${totalCustomers}`;

        // Destroy previous chart if it exists
        if (customerChart) customerChart.destroy();

        // Customer Chart
        const customerCtx = document.getElementById('customerChart').getContext('2d');
        customerChart = new Chart(customerCtx, {
            type: 'bar',
            data: {
                labels: filteredCustomerData.Customer_Month.map(item => item.Month),
                datasets: [{
                    label: 'Total Customers',
                    data: filteredCustomerData.Customer_Month.map(item => item.Customer),
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Update Quantity Section
        const quantityElement = document.getElementById('quantity');
        const totalQuantity = filteredQuantityData.Quantity_Month.reduce((acc, item) => acc + item.quantity, 0);
        quantityElement.textContent = `Total Quantity: ${totalQuantity}`;

        // Destroy previous chart if it exists
        if (quantityChart) quantityChart.destroy();

        // Quantity Chart
        const quantityCtx = document.getElementById('quantityChart').getContext('2d');
        quantityChart = new Chart(quantityCtx, {
            type: 'line',
            data: {
                labels: filteredQuantityData.Quantity_Month.map(item => item.Month),
                datasets: [{
                    label: 'Total Quantity',
                    data: filteredQuantityData.Quantity_Month.map(item => item.quantity),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Update Revenue Section
        const revenueElement = document.getElementById('revenue');
        const totalRevenue = filteredRevenueData.Revenue_Month.reduce((acc, item) => acc + item.Revenue, 0);
        revenueElement.textContent = `Total Revenue: $${totalRevenue}`;

        // Destroy previous chart if it exists
        if (revenueChart) revenueChart.destroy();

        // Revenue Chart
        const revenueCtx = document.getElementById('revenueChart').getContext('2d');
        revenueChart = new Chart(revenueCtx, {
            type: 'pie',
            data: {
                labels: filteredRevenueData.Revenue_Month.map(item => item.Month),
                datasets: [{
                    label: 'Total Revenue',
                    data: filteredRevenueData.Revenue_Month.map(item => item.Revenue),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)'
                    ]
                }]
            }
        });

        // Update Top Products Section
        const topProductsElement = document.getElementById('top_products');
        topProductsElement.innerHTML = ''; // Clear previous entries

        // Assuming you want to display data for a specific month, e.g., "Jan"
        const topProductsForMonth = filteredTopProductsData.Top5_Month.length > 0 ? filteredTopProductsData.Top5_Month[0] : null;
        if (topProductsForMonth) {
            Object.entries(topProductsForMonth).forEach(([key, value]) => {
                if (key !== "Month") { // Exclude the "Month" key
                    const productElement = document.createElement('li');
                    productElement.textContent = `${key}: $${value}`;
                    topProductsElement.appendChild(productElement);
                }
            });
        }

        // Destroy previous chart if it exists
        if (topProductsChart) topProductsChart.destroy();

        // Top Products Chart
        const topProductsCtx = document.getElementById('topProductsChart').getContext('2d');
        topProductsChart = new Chart(topProductsCtx, {
            type: 'doughnut',
            data: {
                labels: topProductsForMonth ? Object.keys(topProductsForMonth).filter(key => key !== 'Month') : [],
                datasets: [{
                    data: topProductsForMonth ? Object.values(topProductsForMonth).filter(value => typeof value === 'number') : [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                        'rgba(255, 205, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
});
