const blogController = require('../controller/blogs');

//Validations
const getAllBlogsValidation = {
    queryString: {
        type: 'object',
        properties: {
            page: { type: 'integer', minimum: 1 },
            limit: { type: 'integer', minimum: 1 },
        }
    },
    response: {
        200: {
            type: 'object',
            properties: { //pagination properties
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' },
                data: { //array of blogs
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer' },
                            title: { type: 'string' }
                        },
                        required: ['id', 'title']
                    }
                }
            }
        }
    }
}

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
        schema: getAllBlogsValidation,
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