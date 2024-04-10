// Import necessary modules
const express = require('express');
const path = require('path');
const cors = require("cors");
// Create an instance of Express
const app = express();
// const authorize = [
//     "http://localhost:3000", // local server
//     "http://localhost:3001", //local server
//     "https://dev.seller.gowholsale.com", // stag seller
//     "https://dev.buyer.gowholsale.com", // stag buyer
//     "https://gowholsale.com", // buyer prod
//     "https://seller.gowholsale.com", // seller prod
//   ];
// Define the port your server will listen on
const PORT = process.env.PORT || 3000;

// Define a route to serve the static file
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
