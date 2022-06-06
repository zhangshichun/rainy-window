import { Drop, Environment } from "./Drop";
import { combineDrops, getGravityCenter, intersects } from "./helpers/drop";
import { getCtx } from "./helpers/element";
import { getRandomInt } from "./helpers/math";
import { RainyOptions } from "./types";

class DropKeeper {
  public drops: Drop[] = []
  public ctx: CanvasRenderingContext2D;
  
  constructor(public environment: Environment, public rainyOptions: RainyOptions) {
    this.ctx = getCtx(environment.glassCanvas)
  } 


  bindDrop(drop: Drop) {
    drop.setEnvironment(this.environment)
    drop.setOnBirthChild(this.onDropBirthDrop.bind(this))
  }

  public push(drop: Drop) {
    this.bindDrop(drop)
    this.drops.push(drop)
  }

  onDropBirthDrop(drop: Drop) {
    this.push(drop)
  }

  addDrop(count: number = 1) {
    for(let i = 0; i < count; i ++) {
      const x = getRandomInt(0, this.environment.glassCanvas.width)
      const y = getRandomInt(0, this.environment.glassCanvas.height)
      const r = getRandomInt(1, 10)
      const drop = new Drop(x, y, r)
      this.push(drop)
    }
  }

  drawDrops() {
    this.ctx.clearRect(0, 0, this.environment.glassCanvas.width, this.environment.glassCanvas.height);
    this.drops.forEach(drop => {
      drop.draw()
    })
  }

  checkIntersects() {
    for(let i = 0; i < this.drops.length; i++){
      let dropA = this.drops[i];
      for(let j = i + 1; j < this.drops.length; j++){
        let dropB = this.drops[j];
        if (!dropB || !dropA) {
          continue;
        }
        if(intersects(dropA,dropB)){
          const newDrop = combineDrops(dropA, dropB)
          if (!dropA.hasSpeed() && !dropB.hasSpeed()) {
            this.bindDrop(newDrop)
            this.drops[i] = null
            this.drops[j] = newDrop            
          } else if (dropA.hasSpeed()) {
            this.drops[i].setPosition(newDrop.x, newDrop.y)
            this.drops[i].resize(newDrop.r)
            this.drops[j] = null
          } else {
            this.drops[i] = null
            this.drops[j].setPosition(newDrop.x, newDrop.y)
            this.drops[j].resize(newDrop.r)
          }

          break;
        }
      }
    };
    this.drops = this.drops.filter(t => !!t)
  }

  setSpeedForDrops() {
    if (this.drops.length === 0) {
      return;
    }
    this.drops.forEach(drop => {
      if (drop.r > this.rainyOptions.maxDropRadian) {
        if (drop.hasSpeed()) {
          drop.setSpeed(drop.speedX, drop.speedY, 1000)
        } else {
          drop.setSpeed(0, 10, 1000)
        }
      }
    })
    const index = getRandomInt(0, this.drops.length -1)
    const speedY = getRandomInt(10, 30)
    const duration = getRandomInt(4,10)
    this.drops[index].setSpeed(0, speedY, duration)
  }
}

export { DropKeeper }