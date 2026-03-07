import { PDFDocument } from "pdf-lib";
import fs from "fs";

export default async function mergePdf(req, res) {
  try {
    console.log("Files received:", req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No PDF files uploaded");
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of req.files) {
      console.log("Reading:", file.path);

      const fileBuffer = fs.readFileSync(file.path);
      console.log("File size:", fileBuffer.length);

      const pdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
      console.log("Pages in this PDF:", pdf.getPageCount());

      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }

    const mergedPdfBytes = await mergedPdf.save();
    const buffer = Buffer.from(mergedPdfBytes);

    console.log("Merged PDF size:", buffer.length);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=merged.pdf");

    return res.send(buffer);

  } catch (error) {
    console.error("Merge error:", error);
    return res.status(500).send("Error merging PDFs");
  }
}

