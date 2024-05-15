//masih contoh
document.addEventListener('DOMContentLoaded', (event) => {
    // Fetch the JSON data from the online source
    fetch('https://gist.githubusercontent.com/ElckyMT/af7a3d5423bf2178046336247b613960/raw/851ea52116e84fbfe495a8c5bfba9165442316ba/data.json')  // replace with your raw URL
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Display Revenue
            document.getElementById('revenue').textContent = data.revenue;

            // Display Quantity
            document.getElementById('quantity').textContent = data.quantity;

            // Display Top 5 Products
            const topProductsList = document.getElementById('top_products');
            data.topProducts.forEach(product => {
                const listItem = document.createElement('li');
                listItem.textContent = product;
                topProductsList.appendChild(listItem);
            });

            // Display Revenue by Size
            const revenueBySizeText = `Small: ${data.revenueBySize.small}, Medium: ${data.revenueBySize.medium}, Large: ${data.revenueBySize.large}`;
            document.getElementById('revenue_by_size').textContent = revenueBySizeText;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
