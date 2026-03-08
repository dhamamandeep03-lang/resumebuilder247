import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import puppeteer from "puppeteer";
handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

export default async function generateResume(req, res) {
  try {
    console.log("\n===== PDF REQUEST RECEIVED =====");

    const data = req.body;

    // -------- LOAD TEMPLATE ----------
    const templatePath = path.join(
      process.cwd(),
      "templates",
      data.template + ".html"
    );

    if (!fs.existsSync(templatePath)) {
      console.log("❌ TEMPLATE NOT FOUND");
      return res.status(400).json({ error: "Template not found" });
    }

    const templateHTML = fs.readFileSync(templatePath, "utf-8");
    const compileTemplate = handlebars.compile(templateHTML);
    const finalHTML = compileTemplate(data);

    // -------- LAUNCH BROWSER ----------
    const browser = await puppeteer.launch({
  headless: "new",
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
  ],
});

    const page = await browser.newPage();

    // IMPORTANT: Use setContent instead of file://
    await page.setContent(finalHTML, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
});

    await browser.close();

    console.log("PDF GENERATED SIZE:", pdfBuffer.length);

    // -------- SEND PDF ----------
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="resume.pdf"'
    );
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF ERROR:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
