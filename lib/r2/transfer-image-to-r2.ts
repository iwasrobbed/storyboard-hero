import { GenerateImageResult } from '../images/generate-image'
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

type TransferImageToS3Options = {
  imageResult: GenerateImageResult
  fileExtension: string
  organizationId?: string
  folderId: string
}

type TransferImageToS3Result = {
  url: string
  key: string
}

export async function transferImageToR2({
  imageResult,
  fileExtension,
  organizationId,
  folderId,
}: TransferImageToS3Options): Promise<TransferImageToS3Result> {
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

  const response = await fetch(imageResult.url)
  const arrayBuffer = await response.arrayBuffer()
  const data = Buffer.from(arrayBuffer)

  const uploadParams = {
    Bucket,
    Key,
    Body: data,
    ContentType: mimeType,
  }

  await r2Client.send(new PutObjectCommand(uploadParams))

  const urlInBucket = `${publicUrl}/${Key}`

  return {
    url: urlInBucket,
    key: Key,
  }
}
