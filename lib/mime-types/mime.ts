import * as mimeTypes from 'mime-types'

export function mime() {
  return {
    lookup: (filenameOrExt: string) => {
      return mimeTypes.lookup(filenameOrExt)
    },
    contentType: (filenameOrExt: string) => {
      return mimeTypes.contentType(filenameOrExt)
    },
    extensions: (typeString: string) => {
      const extension: string | false = mimeTypes.extension(typeString)
      return extension ? [extension] : []
    },
    extension: (typeString: string) => {
      return mime().extensions(typeString)?.[0]
    },
    charset: (typeString: string) => {
      return mimeTypes.charset(typeString)
    },
  }
}
