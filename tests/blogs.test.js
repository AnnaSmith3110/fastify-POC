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

    it('GET /allBlogs should return paginated results', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/allBlogs?page=1&limit=2'
        });

        expect(response.statusCode).toBe(200);

        const jsonResponse = response.json();
        expect(jsonResponse).toMatchObject({
            page: 1,
            limit: 2,
            total: expect.any(Number),
            totalPages: expect.any(Number),
            data: expect.any(Array)
        });

        expect(jsonResponse.data.length).toBeLessThanOrEqual(2); // Ensure it doesn't exceed the limit 2
    });

    it('GET /allBlogs should return search results', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/allBlogs?search=fastify'
        });

        expect(response.statusCode).toBe(200);

        const jsonResponse = response.json();
        expect(jsonResponse).toHaveProperty('data');
        expect(jsonResponse.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: expect.stringMatching(/fastify/i)
                })
            ])
        );
    });

    it('GET /allBlogs should return sorted results (asc)', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/allBlogs?sort=asc'
        });

        expect(response.statusCode).toBe(200);

        const jsonResponse = response.json();
        const titles = jsonResponse.data.map(blog => blog.title);
        //Check that titles are sorted in ascending order
        expect(titles).toEqual([...titles].sort());
    });

    it('GET /allBlogs should return sorted results (desc)', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/allBlogs?sort=desc'
        });

        expect(response.statusCode).toBe(200);

        const jsonResponse = response.json();
        const titles = jsonResponse.data.map(blog => blog.title);
        //Check that titles are sorted in descending order
        expect(titles).toEqual([...titles].sort().reverse());
    });

    it('GET /allBlogs should return filtered results by ID range', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/allBlogs?minId=5&maxId=15'
        });

        expect(response.statusCode).toBe(200);

        const jsonResponse = response.json();
        expect(jsonResponse.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number)
                })
            ])
        );

        expect(jsonResponse.data.every(blog => blog.id >= 5 && blog.id <= 15)).toBe(true);
    });

    it('GET /allBlogs should return paginated, sorted, and filtered search results', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/allBlogs?page=1&limit=3&search=fastify&sort=asc&minId=5&maxId=20'
        });

        expect(response.statusCode).toBe(200);

        const jsonResponse = response.json();

        // Ensure response contains correct structure
        expect(jsonResponse).toHaveProperty('page', 1);
        expect(jsonResponse).toHaveProperty('limit', 3);
        expect(jsonResponse).toHaveProperty('totalPages', expect.any(Number));
        expect(jsonResponse).toHaveProperty('data');

        // Validate returned blog posts
        expect(jsonResponse.data.length).toBeLessThanOrEqual(3); // Should not exceed limit

        jsonResponse.data.forEach(blog => {
            // Ensure search term is in the title
            expect(blog.title.toLowerCase()).toContain('fastify');

            // Ensure ID is within the min/max range
            expect(blog.id).toBeGreaterThanOrEqual(5);
            expect(blog.id).toBeLessThanOrEqual(20);
        });

        // Ensure sorting is correct (ascending order by title)
        const titles = jsonResponse.data.map(blog => blog.title);
        expect(titles).toEqual([...titles].sort());
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
            url: '/allBlogs?page=1&limit=2',
        });

        expect(getResponse.statusCode).toBe(200);
        const responseData = getResponse.json();
        expect(responseData).toHaveProperty('data');
        expect(responseData.data.length).toBeGreaterThan(0);

        const existingBlog = responseData.data[0];

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