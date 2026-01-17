import { setupRedisIntegration } from '../utils/redis-test-manager';
import { createTestApp } from '../utils/setup-test-app';

const testApp = createTestApp();
describe('Generate Token API Integration Tests', () => {
  beforeAll(async () => {});
  setupRedisIntegration();

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

    it('should replace existing token when regenerating for same email', async () => {
      const email = 'regenerate-test@example.com';

      const firstResponse = await testApp
        .post('/api/token')
        .send({ email })
        .expect(200);

      const firstToken = firstResponse.body.token;
      expect(firstToken).toBeDefined();

      const secondResponse = await testApp
        .post('/api/token')
        .send({ email })
        .expect(200);

      const secondToken = secondResponse.body.token;
      expect(secondToken).toBeDefined();
      expect(secondToken).not.toBe(firstToken);

      //First token should no longer be valid
      await testApp
        .post('/api/justify')
        .set('Authorization', `Bearer ${firstToken}`)
        .set('Content-Type', 'text/plain')
        .send('test')
        .expect(401);

      //Second token should be valid
      await testApp
        .post('/api/justify')
        .set('Authorization', `Bearer ${secondToken}`)
        .set('Content-Type', 'text/plain')
        .send('test')
        .expect(200);
    });
  });
});
