/* eslint-disable @typescript-eslint/no-explicit-any */
import { tuple } from "@effect-app/core/Function"
import type * as HttpClient from "@effect/platform/Http/Client"
import { useQueryClient } from "@tanstack/vue-query"
import { Cause, Effect, Exit, Option } from "effect-app"
import type { ApiConfig, FetchResponse } from "effect-app/client"
import { dropUndefinedT } from "effect-app/utils"
import { InterruptedException } from "effect/Cause"
import * as Either from "effect/Either"
import type { ComputedRef, Ref } from "vue"
import { computed, ref, shallowRef } from "vue"
import { makeQueryKey, reportRuntimeError, run } from "./internal.js"

import * as Result from "@effect-rx/rx/Result"

export type WatchSource<T = any> = Ref<T> | ComputedRef<T> | (() => T)
export function make<A, E, R>(self: Effect<FetchResponse<A>, E, R>) {
  const result = shallowRef(Result.initial() as Result.Result<A, E>)

  const execute = Effect
    .sync(() => {
      result.value = Result.waiting(result.value)
    })
    .pipe(
      Effect.andThen(Effect.map(self, (_) => _.body)),
      Effect.exit,
      Effect.andThen(Result.fromExit),
      Effect.flatMap((r) => Effect.sync(() => result.value = r))
    )

  const latestSuccess = computed(() => Option.getOrUndefined(Result.value(result.value)))

  return tuple(result, latestSuccess, execute)
}

export interface MutationInitial {
  readonly _tag: "Initial"
}

export interface MutationLoading {
  readonly _tag: "Loading"
}

export interface MutationSuccess<A> {
  readonly _tag: "Success"
  readonly data: A
}

export interface MutationError<E> {
  readonly _tag: "Error"
  readonly error: E
}

export type MutationResult<A, E> = MutationInitial | MutationLoading | MutationSuccess<A> | MutationError<E>

/**
 * Pass a function that returns an Effect, e.g from a client action, or an Effect
 * Returns a tuple with state ref and execution function which reports errors as Toast.
 */
export const useSafeMutation: {
  <I, E, A>(self: { handler: (i: I) => Effect<A, E, ApiConfig | HttpClient.Client.Default>; name: string }): readonly [
    Readonly<Ref<MutationResult<A, E>>>,
    (
      i: I,
      signal?: AbortSignal
    ) => Promise<Either.Either<A, E>>
  ]
  <E, A>(self: { handler: Effect<A, E, ApiConfig | HttpClient.Client.Default>; name: string }): readonly [
    Readonly<Ref<MutationResult<A, E>>>,
    (
      signal?: AbortSignal
    ) => Promise<Either.Either<A, E>>
  ]
} = <I, E, A>(
  self: {
    handler:
      | ((i: I) => Effect<A, E, ApiConfig | HttpClient.Client.Default>)
      | Effect<A, E, ApiConfig | HttpClient.Client.Default>
    name: string
  }
) => {
  const queryClient = useQueryClient()
  const state: Ref<MutationResult<A, E>> = ref<MutationResult<A, E>>({ _tag: "Initial" }) as any

  function handleExit(exit: Exit.Exit<A, E>): Effect<Either.Either<A, E>, never, never> {
    return Effect.sync(() => {
      if (Exit.isSuccess(exit)) {
        state.value = { _tag: "Success", data: exit.value }
        return Either.right(exit.value)
      }

      const err = Cause.failureOption(exit.cause)
      if (Option.isSome(err)) {
        state.value = { _tag: "Error", error: err.value }
        return Either.left(err.value)
      }

      const died = Cause.dieOption(exit.cause)
      if (Option.isSome(died)) {
        throw died.value
      }
      const interrupted = Cause.interruptOption(exit.cause)
      if (Option.isSome(interrupted)) {
        throw new InterruptedException()
      }
      throw new Error("Invalid state")
    })
  }

  const exec = (fst?: I | AbortSignal, snd?: AbortSignal) => {
    let effect: Effect<A, E, ApiConfig | HttpClient.Client.Default>
    let signal: AbortSignal | undefined
    if (Effect.isEffect(self.handler)) {
      effect = self.handler as any
      signal = fst as AbortSignal | undefined
    } else {
      effect = self.handler(fst as I)
      signal = snd
    }

    return run.value(
      Effect
        .sync(() => {
          state.value = { _tag: "Loading" }
        })
        .pipe(
          Effect.andThen(effect),
          Effect.tap(() =>
            Effect.suspend(() => {
              const key = makeQueryKey(self.name)
              const ns = key.filter((_) => _.startsWith("$"))
              const nses: string[] = []
              for (let i = 0; i < ns.length; i++) {
                nses.push(ns.slice(0, i + 1).join("/"))
              }
              return Effect.promise(() => queryClient.invalidateQueries({ queryKey: [ns[0]] }))
              // TODO: more efficient invalidation, including args etc
              // return Effect.promise(() => queryClient.invalidateQueries({
              //   predicate: (_) => nses.includes(_.queryKey.filter((_) => _.startsWith("$")).join("/"))
              // }))
            })
          ),
          Effect.tapDefect(reportRuntimeError),
          Effect.exit,
          Effect.flatMap(handleExit)
        ),
      dropUndefinedT({ signal })
    )
  }

  return tuple(
    state,
    exec
  )
}
