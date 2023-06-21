import { InvalidStateError } from "../../errors.js"
import { checkPaths } from "./makeJsonSchema.js"

const path = { path: "/securities/:id/search/:id2", method: "get" }

const equalPaths = [
  "/securities/:idt/search/:id2",
  "/securities/:id/search/:id2t",
  "/securities/:idt/search/:id2t"
]
  .map((path) => ({ path, method: "get" }))

const differentPaths: {
  path: string
  method: string
}[] = [
  "/securities/search/:id2",
  "/securities/:id/search/",
  "/securities/:id/search/:id2",
  "/securities/:id/:id2/search/:id3"
]
  .map((path) => ({ path, method: "get" }))
  .concat([
    "/securities/:idt/search/:id2"
  ]
    .map((path) => ({ path, method: "post" })))

test("works", async () => {
  expect(await (checkPaths(differentPaths)).runPromise).toStrictEqual(differentPaths)

  for (const p of equalPaths) {
    expect(await checkPaths([path, p]).runPromiseEither).toStrictEqual(
      Either.left(new InvalidStateError(`Duplicate method ${p.method} for path ${p.path}`))
    )
  }

  expect(await checkPaths(["a/:p1/c/:p2", "a/b"].map((path) => ({ path, method: "get" }))).runPromiseEither)
    .toStrictEqual(
      Either.left(new InvalidStateError(`Path /a/b/ is shadowed by /a/:p1/`))
    )

  expect(await checkPaths(["a/:p1/c/:p2", "a/:p111/c/d"].map((path) => ({ path, method: "get" }))).runPromiseEither)
    .toStrictEqual(
      Either.left(new InvalidStateError(`Path /a/:p1/c/d/ is shadowed by /a/:p1/c/:p2/`))
    )
})

test("log shadowing", async () => {
  const arr: string[] = []
  const paths = ["a/b", "a/:p"].map((path) => ({ path, method: "get" }))

  const CustomLogger = Logger.make<string, void>((_, __, message) => {
    arr.push(message)
  })

  await checkPaths(paths)
    .provideLayer(Logger.replace(Logger.defaultLogger, CustomLogger))
    .runPromise

  expect(arr).toStrictEqual([`Path /a/:p/ is partially shadowed by /a/b/`])
})
