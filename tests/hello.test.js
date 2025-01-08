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
});