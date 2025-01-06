const blogController = require('../controller/blogs');

//Validations
const getBlogValidation = {
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
            }
        },
        required: ['id']
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                title: { type: 'string' }
            }
        }
    }
}

const addBlogValidation = {
    body: {
        type: 'object',
        required: ['title'],
        properties: {
            title: { type: 'string' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                title: { type: 'string' }
            }
        }
    }
}

const updateBlogValidation = {
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
            },
        },
        required: ['id']
    },
    body: {
        type: 'object',
        required: ['title'],
        properties: {
            title: { type: 'string' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                title: { type: 'string' }
            }
        }
    }
}

const deleteBlogValidation = {
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
            },
        },
        required: ['id']
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                title: { type: 'string' }
            }
        }
    }
}

//Routes
const routes = [
    {
        method: 'GET',
        url: '/allBlogs',
        handler: blogController.getAllBlogs
    },
    {
        method: 'GET',
        url: '/allBlogs/:id',
        schema: getBlogValidation,
        handler: blogController.getBlogById
    },
    {
        method: 'POST',
        url: '/allBlogs',
        schema: addBlogValidation,
        handler: blogController.createBlog
    },
    {
        method: 'PUT',
        url: '/allBlogs/:id',
        schema: updateBlogValidation,
        handler: blogController.updateBlog
    },
    {
        method: 'DELETE',
        url: '/allBlogs/:id',
        schema: deleteBlogValidation,
        handler: blogController.deleteBlog
    }
]

module.exports = routes