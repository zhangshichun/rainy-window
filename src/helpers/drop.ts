import { Drop } from "../Drop";

const getDropDistance = (dropA: Drop, dropB: Drop) => {
  const dx = dropA.x - dropB.x
  const dy = dropA.y - dropB.y
  const distance = Math.sqrt( dx * dx + dy * dy )
  return distance;
}

export const intersects = (dropA: Drop, dropB: Drop) => {
  const distance = getDropDistance(dropA, dropB)
  return distance < dropA.r + dropB.r
}

export const getGravityCenter = (dropA: Drop, dropB: Drop) => {
  const gravityRatio = dropA.r * dropA.r / (dropA.r * dropA.r + dropB.r * dropB.r)
  const centerX = dropA.x + (dropB.x - dropA.x) * (1 - gravityRatio)
  const centerY = dropA.y + (dropB.y - dropA.y) * (1 - gravityRatio)
  return [centerX, centerY]
}

export const combineDrops = (dropA: Drop, dropB: Drop): Drop => {
  const r = Math.sqrt(dropA.r * dropA.r + dropB.r * dropB.r)
  const [x, y] = getGravityCenter(dropA, dropB)
  return new Drop(x, y , r)
}