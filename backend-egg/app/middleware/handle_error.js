'use strict'

module.exports = options => async (ctx, next) => {
  await next().catch(error => {
    console.log(error)
    ctx.status = error.status || 500
    ctx.body = {
      message: error.message,
      errors: error.errors,
    }
  })
}
