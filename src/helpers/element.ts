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

export const getCtx = (el: HTMLCanvasElement) => {
  const ctx = el.getContext('2d')
  ctx.imageSmoothingEnabled = false;
  return ctx;
}