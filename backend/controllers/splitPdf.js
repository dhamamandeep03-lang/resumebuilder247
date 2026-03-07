import fs from "fs";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

export default async function splitPdf(req, res) {
  try {
    const fileBuffer = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const totalPages = pdfDoc.getPageCount();

    const zip = new JSZip();

    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();
      const copiedPage = await newPdf.copyPages(pdfDoc, [i]);

      newPdf.addPage(copiedPage[0]);

      const pdfBytes = await newPdf.save();

      // ⭐ FIX: convert Uint8Array → Buffer
      zip.file(`page_${i + 1}.pdf`, Buffer.from(pdfBytes));
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=split.zip");

    res.send(zipBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error splitting PDF");
  }
}
