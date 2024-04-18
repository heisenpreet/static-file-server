// Import necessary modules
const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.text({ type: "text/html" }));
let corsOptions = {
  origin: [
    "https://lender-dev.azurewebsites.net",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
};
app.use(cors(corsOptions));
// POST endpoint
app.post("/render", cors(corsOptions), async (req, res) => {
  const postData = req.body;
  const browser = await puppeteer.launch({
    headless: true,
  });

  // create a new page
  const page = await browser.newPage();

  // set your html as the pages content
  await page.setContent(postData, {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  // create a pdf buffer
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { bottom: 15, left: 15, top: 15, right: 15 },
  });

  await browser.close();
  // res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdfBuffer.length })
  // res.send(pdfBuffer)
  // Convert PDF buffer to Blob
  const pdfBlob = Buffer.from(pdfBuffer);

  // Set response headers
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": 'attachment; filename="output.pdf"',
  });

  // Send PDF Blob as response
  res.send(pdfBlob);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
