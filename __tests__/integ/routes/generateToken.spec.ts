import { createTestApp } from '../utils/setup-test-app';
import TestAgent from 'supertest/lib/agent';

describe('Generate Token API Integration Tests', () => {
  let testApp: TestAgent;

  beforeAll(() => {
    testApp = createTestApp();
  });

  describe('POST /api/token', () => {
    it('should successfully generate a token with valid email', async () => {
      const response = await testApp
        .post('/api/token')
        .send({ email: 'generate-token@test.com' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
      expect(response.body.token.length).toBeGreaterThan(0);
    });

    it('should return 400 when email is missing', async () => {
      const response = await testApp
        .post('/api/token')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Email is required');
    });

    it('should return 400 when email is not a string', async () => {
      const response = await testApp
        .post('/api/token')
        .send({ email: 12345 })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Email is required');
    });

    it('should return 400 when email format is invalid', async () => {
      const response = await testApp
        .post('/api/token')
        .send({ email: 'not-an-email' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid email format');
    });
  });
});
