import { createTestApp } from '../utils/setup-test-app';
import TestAgent from 'supertest/lib/agent';

describe('Justify API Integration Tests', () => {
  let testToken: string;
  let testApp: TestAgent;

  beforeAll(async () => {
    testApp = createTestApp();
    const response = await testApp
      .post('/api/token')
      .send({ email: 'justify-test@example.com' });
    testToken = response.body.token;
  });

  describe('POST /api/justify', () => {
    it('should justify text with valid token', async () => {
      const text =
        'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod';

      const response = await testApp
        .post('/api/justify')
        .set('Authorization', `Bearer ${testToken}`)
        .set('Content-Type', 'text/plain')
        .send(text)
        .expect('Content-Type', /text\/plain/)
        .expect(200);

      expect(response.text).toBeDefined();

      const lines = response.text.split('\n');
      for (let i = 0; i < lines.length - 1; i++) {
        expect(lines[i].length).toBe(80);
      }
    });

    it('should return 401 without token', async () => {
      await testApp
        .post('/api/justify')
        .set('Content-Type', 'text/plain')
        .send('Some text')
        .expect('Content-Type', /html/)
        .expect(401);
    });

    it('should return 401 with invalid token', async () => {
      await testApp
        .post('/api/justify')
        .set('Authorization', 'Bearer invalid-token')
        .set('Content-Type', 'text/plain')
        .send('Some text')
        .expect('Content-Type', /html/)
        .expect(403);
    });

    it('should return 400 for empty text', async () => {
      await testApp
        .post('/api/justify')
        .set('Authorization', `Bearer ${testToken}`)
        .set('Content-Type', 'text/plain')
        .send('')
        .expect('Content-Type', /html/)
        .expect(400);
    });

    it('should return 400 for non-text content type', async () => {
      await testApp
        .post('/api/justify')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ text: 'not plain text' })
        .expect('Content-Type', /html/)
        .expect(400);
    });
  });
});
