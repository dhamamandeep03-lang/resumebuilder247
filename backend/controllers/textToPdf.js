import PDFDocument from "pdfkit";

export default function textToPdf(req, res) {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).send("No text provided");
    }

    const doc = new PDFDocument();
    let chunks = [];

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=text.pdf");

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.send(pdfBuffer);
    });

    doc.fontSize(14).text(text, { align: "left" });
    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).send("Error converting text to PDF");
  }
}
