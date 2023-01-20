// Temporary workaround for missing .Aspects variations in current fp-ts and effect

import * as Array$_ from "./Array.js"

/**
 * @tsplus type fp-ts/data/Chunk.Aspects
 */
export interface ChunkAspects {}

/**
 * @tsplus static fp-ts/data/Chunk.Ops $
 */
export const Chunk: ChunkAspects = {}

/**
 * @tsplus type fp-ts/data/Equal.Aspects
 */
export interface EqualAspects {}

/**
 * @tsplus static fp-ts/data/Equal.Ops $
 */
export const Equal: EqualAspects = {}

/**
 * @tsplus type fp-ts/data/Equivalence.Aspects
 */
export interface EquivalenceAspects {}

/**
 * @tsplus static fp-ts/data/Equivalence.Ops $
 */
export const Equivalence: EquivalenceAspects = {}

/**
 * @tsplus type fp-ts/data/HashMap.Aspects
 */
export interface HashMapAspects {}

/**
 * @tsplus static fp-ts/data/HashMap.Ops $
 */
export const HashMap: HashMapAspects = {}

/**
 * @tsplus type fp-ts/data/HashSet.Aspects
 */
export interface HashSetAspects {}

/**
 * @tsplus static fp-ts/data/HashSet.Ops $
 */
export const HashSet: HashSetAspects = {}

/**
 * @tsplus type fp-ts/data/MutableHashMap.Aspects
 */
export interface MutableHashMapAspects {}

/**
 * @tsplus static fp-ts/data/MutableHashMap.Ops $
 */
export const MutableHashMap: MutableHashMapAspects = {}

/**
 * @tsplus type fp-ts/data/MutableHashSet.Aspects
 */
export interface MutableHashSetAspects {}

/**
 * @tsplus static fp-ts/data/MutableHashSet.Ops $
 */
export const MutableHashSet: MutableHashSetAspects = {}

/**
 * @tsplus type fp-ts/data/Either.Aspects
 */
export interface EitherAspects {}

/**
 * @tsplus static fp-ts/data/Either.Ops $
 */
export const Either: EitherAspects = {}

/**
 * @tsplus type fp-ts/data/Option.Aspects
 */
export interface OptionAspects {}

/**
 * @tsplus static fp-ts/data/Option.Ops $
 */
export const Option: OptionAspects = {}

/**
 * @tsplus type effect/io/Config.Aspects
 */
export interface ConfigAspects {}

/**
 * @tsplus static effect/io/Config.Ops $
 */
export const Config: ConfigAspects = {}

/**
 * @tsplus type effect/io/Effect.Aspects
 */
export interface EffectAspects {}

/**
 * @tsplus static effect/io/Effect.Ops $
 */
export const Effect: EffectAspects = {}

/**
 * @tsplus type effect/io/Layer.Aspects
 */
export interface LayerAspects {}

/**
 * @tsplus static effect/io/Layer.Ops $
 */
export const Layer: LayerAspects = {}

/**
 * @tsplus type effect/io/Exit.Aspects
 */
export interface ExitAspects {}

/**
 * @tsplus static effect/io/Exit.Ops $
 */
export const Exit: ExitAspects = {}

/**
 * @tsplus type effect/io/Cause.Aspects
 */
export interface CauseAspects {}

/**
 * @tsplus static effect/io/Cause.Ops $
 */
export const Cause: CauseAspects = {}

/**
 * @tsplus type effect/stream/Stream.Aspects
 */
export interface StreamAspects {}

/**
 * @tsplus static effect/stream/Stream.Ops $
 */
export const Stream: StreamAspects = {}

/**
 * @tsplus type effect/stream/Channel.Aspects
 */
export interface ChannelAspects {}

/**
 * @tsplus static effect/stream/Channel.Ops $
 */
export const Channel: ChannelAspects = {}

/**
 * @tsplus type effect/stream/Sink.Aspects
 */
export interface SinkAspects {}

/**
 * @tsplus static effect/stream/Sink.Ops $
 */
export const Sink: SinkAspects = {}

/**
 * @tsplus type effect/stream/SubscriptionRef.Aspects
 */
export interface SubscriptionRefAspects {}

/**
 * @tsplus static effect/stream/SubscriptionRef.Ops $
 */
export const SubscriptionRef: SubscriptionRefAspects = {}

// TODO

/**
 * @tsplus static ReadonlyArray.Ops $
 * @tsplus static Array.Ops $
 */
export const Array$ = Array$_

// /**
//  * @tsplus type fp-ts/data/ReadonlyArray.Aspects
//  */
// export interface ReadonlyArrayAspects {}

// /**
//  * @tsplus static fp-ts/data/ReadonlyArray.Ops $
//  */
// export const ReadonlyArray: ReadonlyArrayAspects = {}
