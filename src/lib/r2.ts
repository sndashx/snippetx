import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

let _r2: S3Client | null = null

function getR2() {
  if (!_r2) {
    if (!process.env.CLOUDFLARE_R2_ACCOUNT_ID) throw new Error("Missing R2 account ID")
    if (!process.env.CLOUDFLARE_R2_ACCESS_KEY_ID) throw new Error("Missing R2 access key")
    if (!process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY) throw new Error("Missing R2 secret key")

    _r2 = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
    })
  }
  return _r2
}

function getBucket() {
  if (!process.env.CLOUDFLARE_R2_BUCKET) throw new Error("Missing R2 bucket name")
  return process.env.CLOUDFLARE_R2_BUCKET
}

export async function uploadSnippet(key: string, body: Buffer, contentType: string) {
  const r2 = getR2()
  await r2.send(
    new PutObjectCommand({
      Bucket: getBucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  )
  return key
}

export async function getDownloadUrl(key: string) {
  const r2 = getR2()
  const command = new GetObjectCommand({
    Bucket: getBucket(),
    Key: key,
  })
  return getSignedUrl(r2, command, { expiresIn: 60 * 60 })
}

export async function deleteSnippet(key: string) {
  const r2 = getR2()
  await r2.send(
    new DeleteObjectCommand({
      Bucket: getBucket(),
      Key: key,
    })
  )
}
