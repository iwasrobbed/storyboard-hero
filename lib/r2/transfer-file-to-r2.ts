import { mimeTypeFromFileExtension } from '../mime-types/mime-type-from-file-extension'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

const r2Client = new S3Client({
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT_URL!,
  region: 'auto', // ignored
})

type TransferFileToR2Options = {
  sourceUrl: string
  fileExtension: string
  organizationId?: string
  folderId: string
}

type TransferFileToR2Result = {
  url: string
  key: string
}

export async function transferFileToR2({
  sourceUrl,
  fileExtension,
  organizationId,
  folderId,
}: TransferFileToR2Options): Promise<TransferFileToR2Result> {
  const Bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL
  if (!Bucket || !publicUrl) {
    throw new Error(
      'CLOUDFLARE_R2_BUCKET_NAME or CLOUDFLARE_R2_PUBLIC_URL is not set',
    )
  }

  const mimeType = mimeTypeFromFileExtension(fileExtension)
  const filename = `${uuidv4()}.${fileExtension}`
  const Key = organizationId
    ? `${organizationId}/${folderId}/${filename}`
    : `${folderId}/${filename}`
  const normalizedKey = normalizeUrl(Key)

  const response = await fetch(sourceUrl)
  const arrayBuffer = await response.arrayBuffer()
  const data = Buffer.from(arrayBuffer)

  const uploadParams = {
    Bucket,
    Key: normalizeUrl(Key),
    Body: data,
    ContentType: mimeType,
  }

  await r2Client.send(new PutObjectCommand(uploadParams))

  const normalizedPublicUrl = normalizeUrl(publicUrl)
  const urlInBucket = `${normalizedPublicUrl}/${normalizedKey}`

  return {
    url: urlInBucket,
    key: Key,
  }
}

// Remove leading and trailing slashes from a URL or path
const normalizeUrl = (url: string) => url.replace(/^\/+|\/+$/g, '')
