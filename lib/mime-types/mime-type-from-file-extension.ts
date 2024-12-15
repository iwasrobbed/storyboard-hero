import { mime } from './mime'

export const mimeTypeFromFileExtension = (
  fileExtension: string,
): string | undefined => {
  const mimeType = mime().contentType(fileExtension)
  return typeof mimeType === 'string' ? mimeType : undefined
}
