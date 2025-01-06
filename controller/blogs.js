// Demo data
let blogs = [
    {
        id: 1,
        title: 'This is an experiment'
    },
    {
        id: 2,
        title: 'Fastify is pretty cool'
    },
    {
        id: 3,
        title: 'Just another blog, yea!'
    }
]

const getAllBlogs = (req, reply) => {
    return reply.code(200).send(blogs);
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