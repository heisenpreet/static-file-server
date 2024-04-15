// Import necessary modules
const express = require("express");
const path = require("path");
const cors = require("cors");
const puppeteer = require("puppeteer");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");

// Middleware to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.text({ type: "text/html" }));
// enabling CORS for some specific origins only.
let corsOptions = {
  origin: [
    "https://lender-dev.azurewebsites.net",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
};
app.use(cors(corsOptions), express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => res.type("html").send(html));
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
    timeout:60000
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

// Define a route to serve the static file

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`;
