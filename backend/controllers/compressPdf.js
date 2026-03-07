import fs from "fs";
import path from "path";
import { exec } from "child_process";

export default async function compressPdf(req, res) {
  try {
    const inputPath = req.file.path;
    const outputPath = path.join("uploads", `compressed_${Date.now()}.pdf`);

    // Ghostscript compression command
    const command = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputPath} ${inputPath}`;

    exec(command, (error) => {
      if (error) {
        console.error("Ghostscript Error:", error);
        return res.status(500).send("Error compressing PDF");
      }

      const compressedPdf = fs.readFileSync(outputPath);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=compressed.pdf");
      res.send(compressedPdf);
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error compressing PDF");
  }
}

