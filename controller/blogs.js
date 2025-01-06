// Demo data with more blog entries
let blogs = [
    { id: 1, title: 'This is an experiment' },
    { id: 2, title: 'Fastify is pretty cool' },
    { id: 3, title: 'Just another blog, yea!' },
    { id: 4, title: 'Understanding JavaScript Closures' },
    { id: 5, title: 'How to Optimize Your API Performance' },
    { id: 6, title: 'Mastering Async/Await in Node.js' },
    { id: 7, title: 'Why TypeScript is a Game Changer' },
    { id: 8, title: 'Introduction to Microservices Architecture' },
    { id: 9, title: '10 Best Practices for RESTful APIs' },
    { id: 10, title: 'GraphQL vs REST: Which is Better?' },
    { id: 11, title: 'How to Secure Your Fastify API' },
    { id: 12, title: 'Deploying Node.js Applications to Production' },
    { id: 13, title: 'Understanding Event Loop in JavaScript' },
    { id: 14, title: 'Unit Testing Fastify APIs with Vitest' },
    { id: 15, title: 'Building Scalable Applications with Fastify' },
    { id: 16, title: 'Best Logging Strategies in Node.js' },
    { id: 17, title: 'Caching Strategies for High-Performance APIs' },
    { id: 18, title: 'How to Handle Errors in Fastify' },
    { id: 19, title: 'Exploring the Fastify Plugin System' },
    { id: 20, title: 'Rate Limiting in Fastify to Prevent Abuse' },
    { id: 21, title: 'WebSockets vs REST: When to Use Each' },
    { id: 22, title: 'The Power of Streams in Node.js' },
    { id: 23, title: 'Understanding Middleware in Fastify' },
    { id: 24, title: 'How to Connect Fastify with MongoDB' },
    { id: 25, title: 'A Guide to JWT Authentication in Fastify' },
    { id: 26, title: 'Optimizing Fastify for High Concurrency' },
    { id: 27, title: 'Using Fastify with PostgreSQL' },
    { id: 28, title: 'How to Implement Webhooks in Fastify' },
    { id: 29, title: 'Building a CRUD API with Fastify and MySQL' },
    { id: 30, title: 'Deploying Fastify Apps on AWS' }
];

//Paginated get all blogs
const getAllBlogs = (req, reply) => {
    let {page, limit} = req.query;
    page = Number(page);
    limit = Number(limit);

    if(page < 1 || limit < 1) {
        reply.code(400).send({ error: 'Bad Request', message: 'Page and limit must be positive numbers' })
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedBlogs = blogs.slice(startIndex, endIndex);

    return reply.code(200).send({
        page,
        limit,
        total: blogs.length,
        totalPages: Math.ceil(blogs.length / limit),
        data: paginatedBlogs
    });
}

const getBlogById = (req, reply) => {
    const id = Number(req.params.id);
    if(!id) {
        return reply.code(400).send({ error: 'Bad Request', message: 'ID is required' });
    }
    
    const blogIndex = blogs.findIndex(blog => blog.id === id)
    if (blogIndex === -1) {
        return reply.code(404).send({ message: 'Blog not found' })
    }
    return reply.code(200).send(blogs[blogIndex]);
}

const createBlog = (req, reply) => {
    const { title } = req.body;
    if (!title) {
        return reply.code(400).send({ error: 'Bad Request', message: 'Title is required' });
    }

    const id = blogs.length + 1;
    const newBlog = {
        id, title
    }
    blogs.push(newBlog)
    return reply.code(200).send(newBlog);
}

const updateBlog = (req, reply) => {
    const id = Number(req.params.id);
    if(!id) {
        return reply.code(400).send({ error: 'Bad Request', message: 'ID is required' });
    }

    const blogIndex = blogs.findIndex(blog => blog.id === id)
    if (blogIndex === -1) {
        return reply.code(404).send({ message: 'Blog not found' })
    }
    const updatedBlog = {
        id,
        title: req.body.title
    }
    blogs[blogIndex] = updatedBlog
    return reply.code(200).send(updatedBlog);
}

const deleteBlog = async (req, reply) => {
    const id = Number(req.params.id)
    if(!id) {
        return reply.code(400).send({ error: 'Bad Request', message: 'ID is required' });
    }
    const blogIndex = blogs.findIndex(blog => blog.id === id);

    if (blogIndex === -1) {
        return reply.code(404).send({ message: 'Blog not found' });
    }

    const [deletedBlog] = blogs.splice(blogIndex, 1);
    return reply.code(200).send(deletedBlog);
}

module.exports = {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
}