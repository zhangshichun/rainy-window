import { Drop } from "./Drop";
import { DropKeeper } from "./DropKeeper";
import { createImageElement, getCtx } from "./helpers/element";
import { getRandomInt } from "./helpers/math";
import { TimeKeeper } from "./TimeKeeper";
import { RainyOptions } from "./types";
class RainyCanvas {
  img: HTMLImageElement;
  backgroundCanvas: HTMLCanvasElement;
  glassCanvas: HTMLCanvasElement;
  reflection: HTMLCanvasElement;
  keeper: DropKeeper;
  timeKeeper: TimeKeeper = new TimeKeeper()

  constructor(public targetEl: HTMLElement, public url: string, private options: RainyOptions = { baseZIndex : 10, minification: 0.2, blurLength: 4, maxDropRadian : 10 }) {
    this.prepare()
  }

  async prepare(): Promise<void> {
    this.formatTargetElStyle()
    this.img = await createImageElement(this.url)
    this.backgroundCanvas = this.createBackgroundCanvas()
    this.appendBackgroundCanvas()
    this.drawBackgroundCanvas()
    this.glassCanvas = this.createGlassCanvas()
    this.appendGlassCanvas()
    this.reflection = this.createReflection()
    this.keeper = this.createDropKeeper()
    // this.targetEl.appendChild(this.reflection)
    this.timeKeeper.addRandomInterval(100, 1000, () => {
      const dropCount = getRandomInt(1, 3);
      this.keeper.addDrop(dropCount)
    })
    
    this.timeKeeper.addRandomInterval(1000, 2000, () => {
      this.keeper.setSpeedForDrops()
    })
    // this.keeper.addDrop(1)
    // this.keeper.setSpeedRandom()
    this.timeKeeper.addFrameEvent(() => {
      this.render()
    })
  }

  render() {
    this.keeper.removeDropsOut()
    this.keeper.checkIntersects()
    this.keeper.drawDrops()
  }

  formatTargetElStyle() {
    const computedStyle = window.getComputedStyle(this.targetEl)
    if (!['relative', 'fixed'].includes(computedStyle.position)) {
      console.warn('target element should be relative or fixed')
      this.targetEl.style.position = 'relative'
    }
  }

  createFullFilledCanvas() {
    const { clientHeight, clientWidth } = this.targetEl;
    const width = this.options.width ?? clientWidth
    const height = this.options.height ?? clientHeight
    const canvasEl = document.createElement('canvas');
    canvasEl.width = width;
    canvasEl.height = height;
    canvasEl.style.position = 'absolute'
    canvasEl.style.top = '0'
    canvasEl.style.left = '0'
    return canvasEl;
  }

  createBackgroundCanvas() {
    const canvasEl = this.createFullFilledCanvas()
    canvasEl.style.zIndex = String(this.options.baseZIndex)
    const ctx = getCtx(canvasEl)
    ctx.filter = `blur(${this.options.blurLength}px)`
    return canvasEl;
  }

  createGlassCanvas() {
    const canvasEl = this.createFullFilledCanvas()
    canvasEl.style.zIndex = String(this.options.baseZIndex + 1)
    return canvasEl;
  }

  appendBackgroundCanvas() {
    this.targetEl.appendChild(this.backgroundCanvas)
  }

  appendGlassCanvas() {
    this.targetEl.appendChild(this.glassCanvas)
  }

  drawBackgroundCanvas() {
    const ctx = getCtx(this.backgroundCanvas);
    ctx.drawImage(this.img, 0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height)
  }

  createReflection() {
    const canvasEl = document.createElement('canvas')
    const ctx = getCtx(canvasEl)
    canvasEl.width = this.backgroundCanvas.width * this.options.minification
    canvasEl.height = this.backgroundCanvas.height * this.options.minification
    ctx.translate(canvasEl.width/2, canvasEl.height/2)
    ctx.rotate(Math.PI)
    ctx.drawImage(this.img, -canvasEl.width/2, -canvasEl.height/2, canvasEl.width, canvasEl.height)
    return canvasEl;
  }

  createDropKeeper(): DropKeeper {
    const environment = {
      glassCanvas: this.glassCanvas,
      reflection: this.reflection,
      minification: this.options.minification
    }
    return new DropKeeper(environment, this.options)
  }
}

export {
  RainyCanvas
}