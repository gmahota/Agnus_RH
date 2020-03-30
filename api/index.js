import * as Employee from './rh/employee'
export default {
  getEmployFromPhoneNumber:Employee.getEmployFromPhoneNumber,

  async function (fastify, opts, next) {
    fastify.get('/', (req, reply) => {
      reply.send({ hello: 'world' })
    })
  }
}
