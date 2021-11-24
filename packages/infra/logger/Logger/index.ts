import * as T from "@effect-ts/core/Effect"
import * as Has from "@effect-ts/core/Has"

export interface Meta {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any
}

export type LogFn = (message: string, meta?: Meta) => T.UIO<void>

interface LoggerLevels {
  silly: LogFn
  debug: LogFn
  verbose: LogFn
  http: LogFn
  info: LogFn
  warn: LogFn
  error: LogFn
}
export interface Logger extends LoggerLevels {
  serviceId: typeof LoggerId
}

export type Level = keyof LoggerLevels

export const LoggerId = Symbol()
export const Logger = Has.tag<Logger>(LoggerId)

export const severity: Record<Level, number> = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
}

export const { debug, error, http, info, silly, verbose, warn } = T.deriveLifted(
  Logger
)(["debug", "error", "http", "info", "silly", "verbose", "warn"], [], [])
