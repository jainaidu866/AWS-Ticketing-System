const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuidv4 } = require("uuid");
const { success, error } = require("../utils/response");

const s3 = new S3Client({});
const BUCKET = process.env.S3_BUCKET;

exports.getPresignedUrl = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const fileName = `attachments/${uuidv4()}-${body.fileName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: fileName,
      ContentType: body.fileType
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 300 });

    return success({
      uploadUrl: url,
      fileUrl: `https://${BUCKET}.s3.amazonaws.com/${fileName}`
    });
  } catch (err) {
    return error(500, err.message);
  }
};