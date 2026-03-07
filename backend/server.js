import express from "express";
import cors from "cors";
import multer from "multer";

import mergePdf from "./controllers/mergePdf.js";
import splitPdf from "./controllers/splitPdf.js";
import compressPdf from "./controllers/compressPdf.js";
import compressImage from "./controllers/compressImage.js";
import textToPdf from "./controllers/textToPdf.js";
import generateResume from "./controllers/generateResume.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const upload = multer({ dest: "uploads/" });


app.post("/api/merge-pdf", upload.array("files"), mergePdf);
app.post("/api/split-pdf", upload.single("file"), splitPdf);
app.post("/api/compress-pdf", upload.single("file"), compressPdf);
app.post("/api/text-to-pdf", upload.none(), textToPdf);
app.post("/api/compress-image", upload.single("file"), compressImage);


app.post("/api/generate-resume", upload.none(), generateResume);


app.listen(8080, () => console.log("Backend running on port 8080"));
