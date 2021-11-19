import undici from 'undici'

const { Agent, setGlobalDispatcher, fetch } = undici

const testAgent = new Agent({
  keepAliveTimeout: 10,
  keepAliveMaxTimeout: 10
})

setGlobalDispatcher(testAgent)

export { undici, fetch }
