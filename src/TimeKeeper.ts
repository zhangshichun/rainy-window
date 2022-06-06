import { getRandomInt } from "./helpers/math";

export type TimeEvent = {
  timestamp: number;
  callback: Function
}

export class TimeKeeper {
  private events: TimeEvent[] = []
  private frameEvents: Function[] = []

  constructor() {
    this.handleEvents()
  }

  private handleEvents() {
    const now = Date.now()
    while(this.events[0] && this.events[0].timestamp <= now) {
      const event = this.events.shift()
      event.callback?.()
    }
    this.frameEvents.forEach((fn) => {
      fn()
    })
    requestAnimationFrame(() => {
      this.handleEvents()
    })
  }

  public addRandomEvent(min: number, max: number, callback: Function) {
    const now = Date.now()
    const delay = getRandomInt(min, max)
    const event: TimeEvent = {
      timestamp: now + delay,
      callback
    }
    this.addEvent(event)
  }

  public addRandomInterval(min: number, max: number, callback: Function) {
    const intervalCallback = () => {
      this.addRandomInterval(min, max, callback)
      callback()
    }
    this.addRandomEvent(min, max, intervalCallback)
  }

  public addEvent(event: TimeEvent) {
    if (this.events.length === 0) {
      this.events.push(event);
      return;
    }
    if (this.events[0].timestamp >= event.timestamp) {
      this.events.unshift(event)
      return
    }
    for(let i = 0; i < this.events.length; i ++) {
      const pre = this.events[i]
      const post = this.events[i + 1]
      if (pre.timestamp <= event.timestamp && (!post || post.timestamp > event.timestamp)) {
        this.events.splice(i + 1, 0, event)
        return;
      }
    }
    this.events.push(event)
  }

  public addFrameEvent(fn: Function) {
    this.frameEvents.push(fn)
  }
}