//masih beta/contoh
document.addEventListener('DOMContentLoaded', (event) => {
    // Fetch the JSON data from multiple online sources
    Promise.all([
        fetch('https://gist.githubusercontent.com/ElckyMT/a997876ccbaa45dae38bfb9b08eea7b5/raw/f7b0734a080a4319f5ade8922605fe5534a48034/customer.json').then(res => res.json()),
        fetch('https://gist.githubusercontent.com/ElckyMT/03de6d48068bdfdea58a6fb947e3a4f3/raw/a018ba618368bbef1e39c2430166fa49f1a11568/quantity.json').then(res => res.json()),
        fetch('https://gist.githubusercontent.com/ElckyMT/30419f4c641210d6dddd73aeb1181425/raw/ca34891140e8d400e16d29a4564a133a54360d54/revenue.json').then(res => res.json()),
        fetch('https://gist.githubusercontent.com/ElckyMT/54c447b88edddde5fcd18a12bdbf9a13/raw/c887b30b29bebbe7b3c4ff18246c7a7d7390bbda/top_5.json').then(res => res.json())
    ]).then(([customerData, quantityData, revenueData, topProductsData]) => {
        // Update dashboard sections
        updateDashboard(customerData, quantityData, revenueData, topProductsData);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
});

function updateDashboard(customerData, quantityData, revenueData, topProductsData) {
    // Update Customer Section
    const customerElement = document.getElementById('customer');
    const totalCustomers = customerData.Customer_Month.reduce((acc, item) => acc + item.Customer, 0);
    customerElement.textContent = `Total Customers: ${totalCustomers}`;

    // Update Quantity Section
    const quantityElement = document.getElementById('quantity');
    const totalQuantity = quantityData.Quantity_Month.reduce((acc, item) => acc + item.quantity, 0);
    quantityElement.textContent = `Total Quantity: ${totalQuantity}`;

    // Update Revenue Section
    const revenueElement = document.getElementById('revenue');
    const totalRevenue = revenueData.Revenue_Month.reduce((acc, item) => acc + item.Revenue, 0);
    revenueElement.textContent = `Total Revenue: $${totalRevenue}`;

    // Update Top Products Section
    const topProductsElement = document.getElementById('top_products');
    topProductsElement.innerHTML = ''; // Clear previous entries

    // Assuming you want to display data for a specific month, e.g., "Jan"
    const janData = topProductsData.Top5_Month.find(monthData => monthData.Month === "Jan");
    if (janData) {
        Object.entries(janData).forEach(([key, value]) => {
            if (key !== "Month") { // Exclude the "Month" key
                const productElement = document.createElement('li');
                productElement.textContent = `${key}: $${value}`;
                topProductsElement.appendChild(productElement);
            }
        });
    }
}
/*
function sortData(sortValue, data) {
    let sortedData = [...data]; // Create a copy of the data array
    switch (sortValue) {
        case 'revenue-asc':
            sortedData.sort((a, b) => a.revenue - b.revenue);
            break;
        case 'revenue-desc':
            sortedData.sort((a, b) => b.revenue - a.revenue);
            break;
        case 'quantity-asc':
            sortedData.sort((a, b) => a.quantity - b.quantity);
            break;
        case 'quantity-desc':
            sortedData.sort((a, b) => b.quantity - a.quantity);
            break;
    }
    updateDisplay(sortedData);
}

function filterDataByMonth(month, data) {
    const filteredData = data.filter(item => item.month === month || month === '');
    updateDisplay(filteredData);
}

function filterDataByProduct(product, data) {
    const filteredData = data.filter(item => item.product === product || product === '');
    updateDisplay(filteredData);
}

function updateDisplay(data) {
    const revenueElement = document.getElementById('revenue');
    const quantityElement = document.getElementById('quantity');
    const topProductsElement = document.getElementById('top_products');

    // Calculate total revenue and quantity
    const totalRevenue = data.reduce((acc, item) => acc + item.revenue, 0);
    const totalQuantity = data.reduce((acc, item) => acc + item.quantity, 0);

    // Update DOM elements
    revenueElement.textContent = `Total Revenue: $${totalRevenue}`;
    quantityElement.textContent = `Total Quantity: ${totalQuantity}`;

    // Clear previous top products list
    topProductsElement.innerHTML = '';

    // Assuming 'top_products' is a list of top 5 products by revenue
    data.sort((a, b) => b.revenue - a.revenue).slice(0, 5).forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.product} - $${item.revenue}`;
        topProductsElement.appendChild(li);
    });
} */ 

