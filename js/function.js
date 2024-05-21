let customerData, quantityData, revenueData, topProductsData;
let customerChart, quantityChart, revenueChart, topProductsChart;

// Define the handleSort function in the global scope
function handleSort() {
    const sortOption = document.getElementById('sort-option').value;
    console.log(`Sorting data by ${sortOption}`);
    // Implement sorting logic based on sortOption
    if (sortOption === 'revenue-desc') {
        revenueData.Revenue_Month.sort((a, b) => b.Revenue - a.Revenue);
    } else if (sortOption === 'revenue-asc') {
        revenueData.Revenue_Month.sort((a, b) => a.Revenue - b.Revenue);
    } else if (sortOption === 'quantity-desc') {
        quantityData.Quantity_Month.sort((a, b) => b.quantity - a.quantity);
    } else if (sortOption === 'quantity-asc') {
        quantityData.Quantity_Month.sort((a, b) => a.quantity - b.quantity);
    } else if (sortOption === 'customer-desc') {
        customerData.Customer_Month.sort((a, b) => b.Customer - a.Customer);
    } else if (sortOption === 'customer-asc') {
        customerData.Customer_Month.sort((a, b) => a.Customer - b.Customer);
    }
    // Call updateDashboard with sorted data
    updateDashboard(customerData, quantityData, revenueData, topProductsData);
}

document.addEventListener('DOMContentLoaded', (event) => {
    // Fetch the JSON data from multiple online sources
    Promise.all([
        fetch('https://gist.githubusercontent.com/ElckyMT/a997876ccbaa45dae38bfb9b08eea7b5/raw/f7b0734a080a4319f5ade8922605fe5534a48034/customer.json').then(res => res.json()),
        fetch('https://gist.githubusercontent.com/ElckyMT/03de6d48068bdfdea58a6fb947e3a4f3/raw/7d1fc284ce579a2146f0d102157f4db32a12f1a2/quantity.json').then(res => res.json()),
        fetch('https://gist.githubusercontent.com/ElckyMT/30419f4c641210d6dddd73aeb1181425/raw/ca34891140e8d400e16d29a4564a133a54360d54/revenue.json').then(res => res.json()),
        fetch('https://gist.githubusercontent.com/ElckyMT/54c447b88edddde5fcd18a12bdbf9a13/raw/c887b30b29bebbe7b3c4ff18246c7a7d7390bbda/top_5.json').then(res => res.json())
    ]).then(([customerRes, quantityRes, revenueRes, topProductsRes]) => {
        customerData = customerRes;
        quantityData = quantityRes;
        revenueData = revenueRes;
        topProductsData = topProductsRes;

        updateDashboard(customerData, quantityData, revenueData, topProductsData);
    });
});

function updateDashboard(customerData, quantityData, revenueData, topProductsData) {
    // Update Customer Chart
    const customerCtx = document.getElementById('customerChart').getContext('2d');
    if (customerChart) customerChart.destroy();
    customerChart = new Chart(customerCtx, {
        type: 'bar',
        data: {
            labels: customerData.Customer_Month.map(item => item.Month),
            datasets: [{
                label: 'Total Customers',
                data: customerData.Customer_Month.map(item => item.Customer),
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

    // Update Total Customers Section
    const customerElement = document.getElementById('customer');
    if (customerElement) {
        const totalCustomers = customerData.Customer_Month.reduce((acc, item) => acc + item.Customer, 0);
        customerElement.textContent = `Total Customers: ${totalCustomers}`;
    }

    // Update Quantity Section
    const quantityElement = document.getElementById('quantity');
    if (quantityElement) {
        const totalQuantity = quantityData.Quantity_Month.reduce((acc, item) => acc + item.quantity, 0);
        quantityElement.textContent = `Total Quantity: ${totalQuantity}`;
    }

    // Destroy previous chart if it exists
    if (quantityChart) quantityChart.destroy();

    // Quantity Chart
    const quantityCtx = document.getElementById('quantityChart').getContext('2d');
    quantityChart = new Chart(quantityCtx, {
        type: 'line',
        data: {
            labels: quantityData.Quantity_Month.map(item => item.Month),
            datasets: [{
                label: 'Total Quantity',
                data: quantityData.Quantity_Month.map(item => item.quantity),
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
    const revenueElement = document.getElementById('total-revenue');
    if (revenueElement) {
        const totalRevenue = revenueData.Revenue_Month.reduce((acc, item) => acc + item.Revenue, 0);
        revenueElement.textContent = totalRevenue;
    }

    // Destroy previous chart if it exists
    if (revenueChart) revenueChart.destroy();

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    revenueChart = new Chart(revenueCtx, {
        type: 'bar',
        data: {
            labels: revenueData.Revenue_Month.map(item => item.Month),
            datasets: [{
                label: 'Total Revenue',
                data: revenueData.Revenue_Month.map(item => item.Revenue),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
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

    // Update Top Products Section
    const topProductsForMonth = topProductsData.Top5_Month.length > 0 ? topProductsData.Top5_Month[0] : null;

    // Destroy previous chart if it exists
    if (topProductsChart) topProductsChart.destroy();

    // Top Products Chart
// Top Products Chart
const topProductsCtx = document.getElementById('topProductsChart').getContext('2d');
topProductsChart = new Chart(topProductsCtx, {
    type: 'bar',
    data: {
        labels: topProductsForMonth ? Object.keys(topProductsForMonth).filter(key => key !== 'Month') : [],
        datasets: [{
            label: 'Top Products', // Change this line
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

//update revenue
function updateRevenueChart(selectedMonth) {
    const filteredRevenueData = revenueData.Revenue_Month.filter(item => item.Month === selectedMonth);
    const revenueElement = document.getElementById('total-revenue');
    const totalRevenue = filteredRevenueData.reduce((acc, item) => acc + item.Revenue, 0);
    revenueElement.textContent = totalRevenue;

    if (revenueChart) revenueChart.destroy();

    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    revenueChart = new Chart(revenueCtx, {
        type: 'bar',
        data: {
            labels: filteredRevenueData.map(item => item.Month),
            datasets: [{
                label: 'Total Revenue',
                data: filteredRevenueData.map(item => item.Revenue),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
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
}

//update customer
function updateCustomerChart(selectedMonth) {
    const filteredCustomerData = customerData.Customer_Month.filter(item => item.Month === selectedMonth);
    const customerElement = document.getElementById('customer');
    const totalCustomers = filteredCustomerData.reduce((acc, item) => acc + item.Customer, 0);
    customerElement.textContent = `Total Customers: ${totalCustomers}`;

    if (customerChart) customerChart.destroy();

    const customerCtx = document.getElementById('customerChart').getContext('2d');
    customerChart = new Chart(customerCtx, {
        type: 'bar',
        data: {
            labels: filteredCustomerData.map(item => item.Month),
            datasets: [{
                label: 'Total Customers',
                data: filteredCustomerData.map(item => item.Customer),
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
}