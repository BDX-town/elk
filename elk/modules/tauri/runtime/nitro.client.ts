import type { FetchResponse } from 'ofetch'
import {
  createApp,
  createRouter,
  defineLazyEventHandler,
  type EventHandler,
  toNodeListener,
} from 'h3'
import { fetchNodeRequestHandler } from 'node-mock-http'
import { createFetch } from 'ofetch'

const handlers: { route: string, handler: EventHandler }[] = [
]

// @ts-expect-error undeclared global window property
window.__NUXT__.config = {
  // @ts-expect-error undeclared global window property
  ...window.__NUXT__.config,
  storage: {},
}

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()

  const h3App = createApp({
    debug: import.meta.dev,
    // TODO: add global error handler
    // onError: (err, event) => {
    //  console.log({ err, event })
    // },
  })

  const router = createRouter()

  for (const h of handlers)
    router.use(h.route, h.handler)

  // @ts-expect-error TODO: fix
  h3App.use(config.app.baseURL, router)

  const nodeHandler = toNodeListener(h3App)
  const localFetch: typeof fetch = async (input, init) => {
    if (!input.toString().startsWith('/')) {
      return globalThis.fetch(input.toString(), init)
    }
    return await fetchNodeRequestHandler(nodeHandler, input.toString(), init)
  }

  // @ts-expect-error error types are subtly different here in a future nitro version
  globalThis.$fetch = createFetch({
    fetch: localFetch,
    Headers,
    defaults: { baseURL: config.app.baseURL },
  })

  const route = useRoute()
  if (route.path.startsWith('/api')) {
    const result = (await ($fetch.raw as any)(route.fullPath)) as FetchResponse<unknown>
    if (result.headers.get('location'))
      location.href = result.headers.get('location')!
  }
})
