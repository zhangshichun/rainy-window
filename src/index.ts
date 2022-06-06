import { RainyCanvas } from "./RainyCanvas";

async function rain(target: string | HTMLImageElement , url: string , options: any) {
  if (typeof target != 'string') {
    return // todo support Element
  }
  const targetEl = document.getElementById(target);
  const rainyCanvas = new RainyCanvas(targetEl, url)
  return rainyCanvas
}

export default rain;