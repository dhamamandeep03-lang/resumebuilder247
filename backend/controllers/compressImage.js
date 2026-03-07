import sharp from "sharp";

export default async function compressImage(req, res) {
  try {
    const compressedImage = await sharp(req.file.path)
      .jpeg({ quality: 50 })  // 50% quality compression
      .toBuffer();

    res.setHeader("Content-Type", "image/jpeg");
    res.send(compressedImage);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error compressing image");
  }
}
