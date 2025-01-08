const app = require('fastify')(
    {
        logger: true
    }
)

app.get('/', async (req, reply) => {
    reply.send({ hello: 'world' })
})

//Cloud run assigns port 8080 hence env is needed
const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
        app.log.info(`Server listening on ${address}`);
    });
}

module.exports = app;