import { Effect, type Queue } from "effect-app"
import { TagMakeId } from "effect-app/service"
import * as Q from "effect/Queue"

const make = Effect
  .gen(function*($) {
    const store = yield* $(Effect.sync(() => new Map<string, Queue.Queue<string>>()))

    return {
      getOrCreateQueue: (k: string) =>
        Effect.gen(function*($) {
          const q = store.get(k)
          if (q) return q
          const newQ = yield* $(Q.unbounded<string>())
          store.set(k, newQ)
          return newQ
        })
    }
  })

/**
 * @tsplus type MemQueue
 * @tsplus companion MemQueue.Ops
 */
export class MemQueue extends TagMakeId("effect-app/MemQueue", make)<MemQueue>() {
  static readonly Live = this.toLayer()
}
