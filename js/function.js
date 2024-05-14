// kerangka fetching 
fetch('path_to_your_file.json')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));