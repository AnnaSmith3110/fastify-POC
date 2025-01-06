const app = require('fastify')(
    {
        logger: true
    }
)

app.get('/', async (req, reply) => {
    reply.send({ hello: 'world' })
})

const blogRoutes = require('./routes/blogs');
blogRoutes.forEach((route, index) => app.route(route));

if (require.main === module) {
    app.listen({ port: 3000 }, (err, address) => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
        app.log.info(`Server listening on ${address}`);
    });
}

module.exports = app;