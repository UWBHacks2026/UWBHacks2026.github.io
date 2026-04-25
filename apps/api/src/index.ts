import getApp from './app'

const app = getApp();

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
