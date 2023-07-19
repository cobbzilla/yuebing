import { DEFAULT_CLOCK, ClockType } from "~/utils/util";

type CachedConfig<T> = {
  name?: string;
  timeout?: number;
  clock?: ClockType;
  default?: T;
};

export class Cached<T> {
  private readonly fn: () => Promise<T>;
  private readonly timeout: number | undefined;
  private readonly clock: ClockType;
  private readonly name?: string;
  private cached?: T;
  private readonly default?: T;
  private loadTime: number;

  constructor(fn: () => Promise<T>, config?: CachedConfig<T>) {
    this.fn = fn;
    this.cached = undefined;
    if (config) {
      if (config.timeout) {
        this.timeout = config.timeout;
      }
      if (config.clock) {
        this.clock = config.clock;
      } else {
        this.clock = DEFAULT_CLOCK;
      }
      if (config.default) {
        this.default = config.default;
      }
      if (config.name) {
        this.name = config.name;
      }
    } else {
      this.clock = DEFAULT_CLOCK;
    }
    this.loadTime = 0;
  }

  async get(): Promise<T> {
    if (this.cached != undefined && (!this.timeout || this.clock.now() - this.loadTime < this.timeout)) {
      return this.cached;
    }
    const result: T | Error = await this.refresh();
    if (result instanceof Error) {
      if (this.cached) {
        logger.warn(`cached${this.name ? `[${this.name}]` : ""}.get: error refreshing, returning cached value`);
        return this.cached;
      } else if (this.default) {
        logger.warn(`cached${this.name ? `[${this.name}]` : ""}.get: error refreshing, returning default value`);
        return this.default;
      }
      throw result;
    }
    return result;
  }

  reset(): void {
    this.cached = undefined;
    this.loadTime = 0;
  }

  async refresh(): Promise<T | Error> {
    try {
      this.cached = await this.fn();
      this.loadTime = this.clock.now();
      return this.cached;
    } catch (e) {
      return new Error(`Cached.refresh error: ${e}`, { cause: e });
    }
  }
}
