export const createImageElement = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img')
    img.onload = function () {
      resolve(img)
    }
    img.onerror = function (err) {
      reject(err)
    }
    img.src = url
  })
}

export const getCtx = (el: HTMLCanvasElement): CanvasRenderingContext2D => {
  const ctx = el.getContext('2d')
  if (!ctx) {
    throw new Error('the 2dContext should not be null')
  }
  ctx.imageSmoothingEnabled = false;
  return ctx;
}