import gsap from "gsap";
import { getCtx } from "./helpers/element";
import { getRandomInt } from "./helpers/math";
export type Environment = {
  reflection: HTMLCanvasElement,
  glassCanvas: HTMLCanvasElement,
  minification: number
}

export type DropHooks = {
  onBirthChild?: (drop: Drop) => void
}

class Drop {
  public speedX = 0;
  public speedY = 0;
  private moveTarget?: [ number, number ];
  public direction = 0;
  public ctx: CanvasRenderingContext2D;
  public environment: Environment;
  public minReflectionRatio = 0.4;
  public maxReflectionRatio = 0.8;
  public hooks: DropHooks = {};
  private birthTimer?: NodeJS.Timer;

  constructor(public x: number, public y: number, public r: number) {
    
  }

  setEnvironment(environment: Environment) {
    this.ctx = getCtx(environment.glassCanvas)
    this.environment = environment
  }

  setSpeed(speedX: number, speedY: number, duration: number) {
    this.speedX = speedX;
    this.speedY = speedY;
    this.moveTarget = [this.x + speedX * duration, this.y + speedY * duration]
    gsap.to(this, {
      duration: duration,
      x: this.moveTarget[0],
      y: this.moveTarget[1],
      onComplete: () => {
        this.speedX = 0
        this.speedY = 0
      }
    })
    this.prepareToBirth()
  }

  hasSpeed() {
    return this.speedX !== 0 || this.speedY !== 0
  }

  setPosition(x: number, y: number) {
    this.x = x
    this.y = y
  }

  resize(r: number) {
    this.r = r
  }

  /**
   * 获取本水滴应该渲染的倒影的范围，这样滚动起来倒影才是会动的，更真实
   * @returns 
   */
  getScopeReflection() {
    const [canvasWidth, canvasHeigh] = [this.environment.glassCanvas.width, this.environment.glassCanvas.height]
    const minDistanceToEdge = Math.min(this.x, canvasWidth - this.x, this.y, canvasHeigh - this.y)
    const shorterEdge = Math.min(canvasHeigh, canvasWidth)
    const visionRadian = Math.min(Math.max(minDistanceToEdge, shorterEdge * this.minReflectionRatio / 2), shorterEdge * this.maxReflectionRatio / 2)
    const sx = canvasWidth - 2 * visionRadian - (canvasWidth - 2 * visionRadian) * this.x / canvasWidth
    const sy = canvasHeigh - 2 * visionRadian - (canvasHeigh - 2 * visionRadian) * this.y / canvasHeigh
    return [sx, sy, visionRadian, visionRadian].map(t => t * this.environment.minification)
  }

  draw() {
    const { reflection } = this.environment
    const ctx = this.ctx
    ctx.save()
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.clip();
    const [sx, sy, sw, sh] = this.getScopeReflection()
    ctx.drawImage(reflection, sx, sy, sw, sh, this.x - this.r, this.y - this.r, 2 * this.r, 2 * this.r)
    ctx.restore()
  }

  prepareToBirth() {
    if (this.birthTimer) {
      clearTimeout(this.birthTimer)
      this.birthTimer = undefined
    }
    const birthAndBirth = () => {
      if (this.speedX === 0 && this.speedY === 0) {
        return;
      }
      if (!this.moveTarget) {
        return
      }
      if (Math.sqrt(Math.pow(this.moveTarget[0] - this.x, 2) + Math.pow(this.moveTarget[1] - this.y, 2)) <= this.r) {
        return;
      }
      this.birthChild()
      const delay = getRandomInt(500, 2000)
      this.birthTimer = setTimeout(() => { birthAndBirth() }, delay)
    }
    const delay = getRandomInt(500, 1000)
    this.birthTimer = setTimeout(() => {
      birthAndBirth()
    }, delay)
  }

  birthChild() {
    // 遗留出的水珠半径
    const r = getRandomInt(1, 3)
    // 水珠的 x 在 0.5r 的范围内
    const x = getRandomInt(this.x - this.r * 0.5, this.x + this.r * 0.5)
    // 利用勾股定理确认从边沿析出;算出 y
    const y = this.y - Math.sqrt(Math.pow(this.r + 1 + r, 2) - Math.pow(x - this.x, 2)) - 1
    // 创建水滴
    const drop = new Drop(x, y, r)
    this.hooks?.onBirthChild?.(drop)
    // todo 析出水滴后，本水滴的大小应该降低
  }

  setOnBirthChild(callback: (drop: Drop) => void) {
    this.hooks.onBirthChild = callback;
  }
}

export { Drop }