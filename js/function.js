let customerData, quantityData, revenueData, topProductsData;
let customerChart, quantityChart, revenueChart, topProductsChart;
//tabulasi
let currentPage = 1;
const rowsPerPage = 10;
let logSalesData = [];

//preloader bisa dihapus wkwkwkwk ini hasil gabut aja
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        document.getElementById('preloader').style.display = 'none';
    }, 3000); // 10000 milliseconds = 10 seconds
});
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
        fetch('../json/data1.json').then(res => res.json()), // customer
        fetch('../json/data2.json').then(res => res.json()), // quantity
        fetch('../json/data3.json').then(res => res.json()), // revenue
        fetch('../json/data4.json').then(res => res.json()), // top 5
        fetch('../json/data5.json').then(res => res.json())  // Fetching data5.json
    ]).then(([customerRes, quantityRes, revenueRes, topProductsRes, logSalesRes]) => {
        customerData = customerRes;
        quantityData = quantityRes;
        revenueData = revenueRes;
        topProductsData = topProductsRes;
        logSalesData = logSalesRes.log_sales; // Storing the fetched data from data5.json

        updateDashboard(customerData, quantityData, revenueData, topProductsData);
        populateLogSalesTable(); // Populate the table with log sales data
        updatePaginationControls();
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
});

//menampilkan tabel
function populateLogSalesTable() {
    const tableBody = document.querySelector('#dataRows');
    if (!tableBody) {
        console.error('Table body not found');
        return;
    }
    tableBody.innerHTML = ''; // Clear any existing rows

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = logSalesData.slice(start, end);

    paginatedData.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(sale.datetime).toLocaleString()}</td>
            <td>${sale.name}</td>
            <td>${sale.size}</td>
            <td>${sale.quantity}</td>
            <td>${sale.price.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });
}
//pindah2 page
function updatePaginationControls() {
    const pageInfo = document.getElementById('pageInfo');
    const totalPages = Math.ceil(logSalesData.length / rowsPerPage);

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

function changePage(direction) {
    currentPage += direction;
    populateLogSalesTable();
    updatePaginationControls();
}

//dashboard
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
    type: 'pie',
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