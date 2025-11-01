import multer from "multer";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Note: Environment variables should be configured in .env.local at project root
// Required variables: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET

// 1. set up multer to save temp file to /tmp
const upload = multer({ dest: "/tmp" });

// 2. we need to turn off Next.js default body parsing for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

// wrap multer in a promise so Next can use it
function runMulter(req, res) {
  return new Promise((resolve, reject) => {
    upload.single("file")(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // parse multipart form with multer
    await runMulter(req, res);

    // multer puts file info on req.file
    const { originalname, path: tempPath, mimetype } = req.file;

    // set up S3 client
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    // read file buffer
    const fileBuffer = fs.readFileSync(tempPath);

    // build S3 key (where we'll store in bucket)
    const key = `agents/${Date.now()}-${originalname}`;

    // upload to S3
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: fileBuffer,
        ContentType: mimetype || "application/x-tar",
      })
    );

    // optional: clean up local temp file
    fs.unlinkSync(tempPath);

    // respond success
    return res.status(200).json({
      ok: true,
      message: "Uploaded to S3",
      key,
      s3Url: `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    });
  } catch (err) {
    console.error("uploadTar error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
