import { mimeTypeFromFileExtension } from '@/lib/mime-types/mime-type-from-file-extension'
import { describe, expect, test } from 'bun:test'

describe('mimeTypeFromFileExtension', () => {
  test('returns correct mime type for our supported file extensions', () => {
    expect(mimeTypeFromFileExtension('mp4')).toBe('video/mp4')
    expect(mimeTypeFromFileExtension('webp')).toBe('image/webp')
  })
})
