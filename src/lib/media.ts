/**
 * Browser-side measurement of a file the admin has picked, before it is
 * uploaded.
 *
 * The gallery grid reserves space from each item's aspect ratio, so measuring
 * here is what stops the masonry columns jumping around once images decode.
 */

export interface MeasuredMedia {
  aspectRatio: number
  /** Videos only: a still from the first moment of the file, used as the poster. */
  poster?: Blob
}

/** Runs `work` with an object URL and always revokes it afterwards. */
async function withObjectUrl<T>(file: Blob, work: (url: string) => Promise<T>): Promise<T> {
  const url = URL.createObjectURL(file)
  try {
    return await work(url)
  } finally {
    URL.revokeObjectURL(url)
  }
}

function measureImage(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () =>
      resolve(image.naturalHeight > 0 ? image.naturalWidth / image.naturalHeight : 1)
    image.onerror = () => reject(new Error('That image could not be read.'))
    image.src = url
  })
}

/**
 * Measures a video and grabs a frame for the poster. Seeking a little way in
 * avoids the black frame most recordings open on.
 */
function measureVideo(url: string): Promise<MeasuredMedia> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    const fail = () => reject(new Error('That video could not be read.'))

    video.onloadedmetadata = () => {
      const aspectRatio = video.videoHeight > 0 ? video.videoWidth / video.videoHeight : 16 / 9
      // Some browsers refuse to seek past the end of a very short clip.
      video.currentTime = Math.min(0.2, (video.duration || 1) / 2)

      video.onseeked = () => {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const context = canvas.getContext('2d')
        if (!context) return resolve({ aspectRatio })
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(
          (blob) => resolve({ aspectRatio, poster: blob ?? undefined }),
          'image/jpeg',
          0.82,
        )
      }
      video.onerror = fail
    }
    video.onerror = fail
    video.src = url
  })
}

export async function measureMedia(file: File): Promise<MeasuredMedia> {
  if (file.type.startsWith('video/')) {
    return withObjectUrl(file, measureVideo)
  }
  const aspectRatio = await withObjectUrl(file, measureImage)
  return { aspectRatio }
}

/** Human-readable file size for the upload list. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
