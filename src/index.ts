import { RainyCanvas } from "./RainyCanvas";

async function rain(target: string | HTMLImageElement , url: string , options: any) {
  let targetEl
  if (typeof target === 'string') {
    targetEl = document.getElementById(target);
  } else {
    targetEl = target
  }
  const rainyCanvas = new RainyCanvas(targetEl, url, options)
  return rainyCanvas
}

export default rain;