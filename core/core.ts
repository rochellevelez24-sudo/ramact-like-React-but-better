// ramact/core.ts
export type Dispose = () => void;

export interface Addon {
  name: string;
  init(ctx: RamactContext): void | Dispose;
}

export interface RamactContext {
  root: HTMLElement;
  registry: Registry;
  events: EventBus;
  clock: Clock;
}

export class Registry {
  private map = new Map<string, any>();
  set<T>(key: string, value: T) { this.map.set(key, value); }
  get<T>(key: string): T | undefined { return this.map.get(key); }
}

export class EventBus {
  private listeners = new Map<string, Set<Function>>();
  on<T = any>(type: string, handler: (payload: T) => void): Dispose {
    const set = this.listeners.get(type) || new Set<Function>();
    set.add(handler);
    this.listeners.set(type, set);
    return () => set.delete(handler);
  }
  emit<T = any>(type: string, payload: T) {
    this.listeners.get(type)?.forEach(fn => fn(payload));
  }
}

export class Clock {
  private rafId = 0;
  private last = performance.now();
  private tickers = new Set<(dt: number, t: number) => void>();
  start() {
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - this.last) / 1000); // clamp dt
      this.last = t;
      this.tickers.forEach(fn => fn(dt, t / 1000));
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }
  stop() { cancelAnimationFrame(this.rafId); }
  onTick(fn: (dt: number, t: number) => void): Dispose {
    this.tickers.add(fn);
    return () => this.tickers.delete(fn);
  }
}

export class Ramact {
  readonly ctx: RamactContext;
  private disposers: Dispose[] = [];

  constructor(root: HTMLElement) {
    const registry = new Registry();
    const events = new EventBus();
    const clock = new Clock();
    this.ctx = { root, registry, events, clock };
    clock.start();
  }

  use(addon: Addon) {
    const res = addon.init(this.ctx);
    if (typeof res === 'function') this.disposers.push(res);
  }

  dispose() {
    this.disposers.forEach(d => d());
    this.ctx.clock.stop();
  }
}
import { Vector } from "./types"
export class WidgetUI extends HTMLElement{
    name: string
    widget: any
    widgetSize: Vector
    resizeable: boolean
    element: any;
    constructor(name: string, widgetSize: Vector){
      super();
      this.name = name,
      this.widgetSize = widgetSize
      this.resizeable = false
      this.widget = null
    }
    setResizeable(trueorfalse: boolean, type: any, _callback: any)  {
      if (trueorfalse === true){
          this.widget.style.resize = type
          this.widget.style.overflow = "auto"
          document.addEventListener("resize", _callback)
      }
       return false
    }
}
