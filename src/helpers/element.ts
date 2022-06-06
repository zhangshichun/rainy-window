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

export const getImageEleFromElement = async (ele: HTMLElement): Promise<HTMLImageElement> => {
  if (ele.tagName.toLowerCase() === 'img') {
    return ele as HTMLImageElement;
  }
  // 如果不是 `img` 标签，那一定是具备 `background-image` 属性的其他元素 
  // 生成一个新的 `img` 标签
  const computedStyle = window.getComputedStyle(ele)
  const backgroundImageAttr = computedStyle.backgroundImage
  const matchedResults = backgroundImageAttr.match(/url\("(.*)"\)/);
  const url = matchedResults[1]
  return createImageElement(url)
}

export const getOffset = function (element) {
  const rect = element.getBoundingClientRect()
  const doc = element.ownerDocument
  const docElem = doc.documentElement
  const win = doc.defaultView
  return {
    top: rect.top + win.pageYOffset - docElem.clientTop,
    left: rect.left + win.pageXOffset - docElem.clientLeft
  }
}

export const getCtx = (el: HTMLCanvasElement) => {
  const ctx = el.getContext('2d')
  ctx.imageSmoothingEnabled = false;
  return ctx;
}