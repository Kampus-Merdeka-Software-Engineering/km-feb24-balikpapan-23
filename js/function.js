//masih beta/contoh
document.addEventListener('DOMContentLoaded', (event) => {
    // Fetch the JSON data from the online source
    fetch('https://gist.githubusercontent.com/ElckyMT/3d929c20aac30bfebedfc5f09785b2fa/raw/4f4c20d9aff7079d23568ac684c7e59dd5585080/datatest2.json')
        .then(response => response.json())
        .then(jsonData => {
            const data = jsonData.data;

            // Aggregate total revenue and quantity
            let totalRevenue = 0;
            let totalQuantity = 0;
            const revenueBySize = { small: 0, medium: 0, large: 0 }; // Placeholder for sizes if needed

            data.forEach(item => {
                totalRevenue += item.revenue;
                totalQuantity += item.quantity;

                // Example revenue by size aggregation logic (if size data was available)
                // if (item.size === 'small') revenueBySize.small += item.revenue;
                // else if (item.size === 'medium') revenueBySize.medium += item.revenue;
                // else if (item.size === 'large') revenueBySize.large += item.revenue;
            });

            // Display aggregated Revenue
            document.getElementById('revenue').textContent = totalRevenue;

            // Display aggregated Quantity
            document.getElementById('quantity').textContent = totalQuantity;

            // Display Top 5 Products by revenue
            const topProductsList = document.getElementById('top_products');
            topProductsList.innerHTML = ''; // Clear previous list if any

            const topProducts = data.sort((a, b) => b.revenue - a.revenue).slice(0, 5);
            topProducts.forEach(product => {
                const listItem = document.createElement('li');
                listItem.textContent = product.product;
                topProductsList.appendChild(listItem);
            });

            // Display Revenue by Size (example placeholder text, update as per actual data)
            const revenueBySizeText = `Small: ${revenueBySize.small}, Medium: ${revenueBySize.medium}, Large: ${revenueBySize.large}`;
            document.getElementById('revenue_by_size').textContent = revenueBySizeText;

            // Event listener for sorting
            document.getElementById('sort-option').addEventListener('change', function() {
                const sortValue = this.value;
                sortData(sortValue, data);
            });

            // Event listener for month filtering
            document.getElementById('filter-month').addEventListener('change', function() {
                const month = this.value;
                filterDataByMonth(month, data);
            });

            // Event listener for product filtering
            document.getElementById('filter-product').addEventListener('change', function() {
                const product = this.value;
                filterDataByProduct(product, data);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    console.log("JavaScript is connected and loaded!");
});

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
}
