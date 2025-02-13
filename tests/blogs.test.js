import { describe, it, expect, beforeEach } from 'vitest';
import app from '../index.js'; // Import Fastify instance

describe('Fastify API Tests', () => {

    it('GET / should return { hello: "world" }', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/',
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({ hello: 'world' });
    });

    it('GET /allBlogs should return an array', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/allBlogs',
        });

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.json())).toBe(true);
    });

    it('GET /allBlogs/:id should return a single blog', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/allBlogs/1',
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toMatchObject({
            id: expect.any(Number),
            title: expect.any(String),
        });
    });

    it('GET /allBlogs/:id should return 404 for non-existent blog', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/allBlogs/9999',
        });

        expect(response.statusCode).toBe(404);
        expect(response.json()).toEqual({ message: 'Blog not found' });
    });

    it('POST /allBlogs should create a new blog', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/allBlogs',
            payload: { title: 'New Blog Post' }
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toMatchObject({
            id: expect.any(Number),
            title: 'New Blog Post',
        });
    });

    it('POST /allBlogs should return 400 for missing title', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/allBlogs',
            payload: {}
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toMatchObject({
            error: 'Bad Request',
        });
    });

    it('PUT /allBlogs/:id should update an existing blog', async () => {
        const response = await app.inject({
            method: 'PUT',
            url: '/allBlogs/1',
            payload: { title: 'Updated Blog Title' }
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toMatchObject({
            id: 1,
            title: 'Updated Blog Title',
        });
    });

    it('PUT /allBlogs/:id should return 400 for missing title', async () => {
        const response = await app.inject({
            method: 'PUT',
            url: '/allBlogs/1',
            payload: {}
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toMatchObject({
            error: 'Bad Request',
        });
    });

    it('DELETE /allBlogs/:id should delete an existing blog', async () => {
        // Fetch all existing blogs
        const getResponse = await app.inject({
            method: 'GET',
            url: '/allBlogs',
        });

        expect(getResponse.statusCode).toBe(200);
        const blogs = getResponse.json();

        expect(blogs.length).toBeGreaterThan(0); // Ensure at least one blog exists

        const existingBlog = blogs[0];

        // Delete that blog
        const deleteResponse = await app.inject({
            method: 'DELETE',
            url: `/allBlogs/${existingBlog.id}`,
        });

        expect(deleteResponse.statusCode).toBe(200);
        expect(deleteResponse.json()).toMatchObject({
            id: existingBlog.id,
            title: existingBlog.title,
        });

        // Ensure the blog is actually deleted by fetching again
        const afterDeleteResponse = await app.inject({
            method: 'GET',
            url: `/allBlogs/${existingBlog.id}`,
        });

        expect(afterDeleteResponse.statusCode).toBe(404); // Should be gone
    });

    it('DELETE /allBlogs/:id should return 404 for non-existent blog', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: '/allBlogs/9999',
        });

        expect(response.statusCode).toBe(404);
        expect(response.json()).toEqual({ message: 'Blog not found' });
    });

});