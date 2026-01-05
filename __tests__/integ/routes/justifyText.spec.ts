import { setupRedisIntegration } from '../utils/redis-test-manager';
import { createTestApp } from '../utils/setup-test-app';

const testApp = createTestApp();
describe('Justify API Integration Tests', () => {
  let testToken: string;

  setupRedisIntegration();
  beforeEach(async () => {
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
        .expect(401);
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

    it('should enforce daily word quota limit', async () => {
      const words = Array(80000).fill('word').join(' ');
      const response = await testApp
        .post('/api/justify')
        .set('Authorization', `Bearer ${testToken}`)
        .set('Content-Type', 'text/plain')
        .send(words)
        .expect(200);

      expect(response.text).toBeDefined();

      const response2 = await testApp
        .post('/api/justify')
        .set('Authorization', `Bearer ${testToken}`)
        .set('Content-Type', 'text/plain')
        .send('one more word')
        .expect(402);

      expect(response2.text).toContain('Quota dépassé');
      expect(response2.text).toContain('Quota restant: 0 mots');
      expect(response2.text).toContain('Limite quotidienne: 80000 mots');
    });

    it('should return 402 with remaining quota when quota is exceeded', async () => {
      const words = Array(79999).fill('word').join(' ');
      await testApp
        .post('/api/justify')
        .set('Authorization', `Bearer ${testToken}`)
        .set('Content-Type', 'text/plain')
        .send(words)
        .expect(200);

      const response = await testApp
        .post('/api/justify')
        .set('Authorization', `Bearer ${testToken}`)
        .set('Content-Type', 'text/plain')
        .send('one two three four five six seven eight nine ten')
        .expect(402);

      expect(response.text).toContain('Quota dépassé');
      expect(response.text).toContain('Quota restant: 1 mots');
      expect(response.text).toContain('Limite quotidienne: 80000 mots');
    });

    it('should count words correctly before justification', async () => {
      const text = 'word1 word2 word3';
      await testApp
        .post('/api/justify')
        .set('Authorization', `Bearer ${testToken}`)
        .set('Content-Type', 'text/plain')
        .send(text)
        .expect(200);

      const words = Array(79997).fill('word').join(' ');
      await testApp
        .post('/api/justify')
        .set('Authorization', `Bearer ${testToken}`)
        .set('Content-Type', 'text/plain')
        .send(words)
        .expect(200);

      const response = await testApp
        .post('/api/justify')
        .set('Authorization', `Bearer ${testToken}`)
        .set('Content-Type', 'text/plain')
        .send('final')
        .expect(402);

      expect(response.text).toContain('Quota restant: 0 mots');
    });
  });
});
