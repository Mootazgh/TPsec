// Common scraping logic for both Jumia and Carrefour
async function scrapeProducts(url, displayFunction) {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Use the display function provided to handle the scraped data
      displayFunction(doc);
    } else {
      console.log("Failed to retrieve the page");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Common function to display scraped data in HTML
function displayProduct(name, price, containerId) {
  const container = document.getElementById(containerId);
  const productElement = document.createElement("div");
  productElement.innerHTML = `<strong>Name:</strong> ${
    name || "N/A"
  }, <strong>Price:</strong> ${price || "N/A"}`;
  container.appendChild(productElement);
}

// Function to handle the search button click for Jumia and Carrefour
function searchProducts() {
  // Get the value from the input field
  const searchTerm = document.getElementById("searchInput").value;

  // Update the URLs with the search term
  const jumiaUrl = `https://www.jumia.com.tn/catalog/?q=${searchTerm}`;
  const carrefourUrl = `https://www.carrefour.tn/default/catalogsearch/result/?q=${searchTerm}`;

  // Clear existing products
  document.getElementById("jumia-products-container").innerHTML = "";
  document.getElementById("carrefour-products-container").innerHTML = "";

  // Perform the scrape with the updated URLs and use the display function for Jumia
  scrapeProducts(jumiaUrl, (doc) => {
    const products = doc.querySelectorAll("a.core");
    const firstProduct = products[0];

    if (firstProduct) {
      const name = firstProduct.dataset.name;
      const price = firstProduct.dataset.price;
      console.log(name, price);
      displayProduct(name, price, "jumia-products-container");
    } else {
      console.log("No products found on the Jumia page");
    }
  });

  // Perform the scrape with the updated URLs and use the display function for Carrefour
  scrapeProducts(carrefourUrl, (doc) => {
    const prices = doc.querySelectorAll("span.price-wrapper");
    const firstPriceElement = prices[0];

    if (firstPriceElement) {
      const price = firstPriceElement.getAttribute("data-price-amount");
      console.log(price);
      displayProduct(null, price, "carrefour-products-container");
    } else {
      console.log("No prices found on the Carrefour page");
    }
  });
}
