import { AuthConcreteService } from '../../../src/app/features/auth/authConcreteService';
import { AuthInMemoryRepository } from '../../../src/app/features/auth/authInMemoryRepository';
import { IS_CONNECTED_ERROR } from '../../../src/app/features/auth/errors/isConnectedError';
import { isErr, isOk } from '@gum-tech/flow-ts';
import { Request } from 'express';

describe('AuthService', () => {
  let authService: AuthConcreteService;
  let authRepository: AuthInMemoryRepository;

  beforeEach(() => {
    // Inject the real In-Memory repo into the service
    authRepository = new AuthInMemoryRepository();
    authService = new AuthConcreteService(authRepository);
  });

  describe('authenticate', () => {
    it('should generate a token and save it to the repository', async () => {
      const email = 'user@example.com';

      const token = await authService.authenticate(email);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      // Verify the service actually persisted the token
      const savedEmail = await authRepository.getEmailByToken(token);
      expect(savedEmail).toBe(email);
    });
  });

  describe('isUserConnected', () => {
    it('should return Ok(true) when a valid Bearer token is provided', async () => {
      // 1. Arrange: Create a token in the system
      const token = await authService.authenticate('test@test.com');

      // 2. Mock Express Request
      const mockRequest = {
        headers: { authorization: `Bearer ${token}` },
      } as Request;

      // 3. Act
      const result = await authService.isUserConnected(mockRequest);

      // 4. Assert
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe(true);
      }
    });

    it('should return Err if the authorization header is missing', async () => {
      const mockRequest = { headers: {} } as Request;

      const result = await authService.isUserConnected(mockRequest);

      expect(isErr(result)).toBe(true);
      expect(result.unwrapErr()).toBe(
        IS_CONNECTED_ERROR.AUTHORIZATION_HEADER_MALFORMED,
      );
    });

    it('should return Err if the scheme is not Bearer', async () => {
      const mockRequest = {
        headers: { authorization: 'Basic some-hash' },
      } as Request;

      const result = await authService.isUserConnected(mockRequest);

      expect(isErr(result)).toBe(true);
      expect(result.unwrapErr()).toBe(
        IS_CONNECTED_ERROR.AUTHORIZATION_HEADER_MALFORMED,
      );
    });

    it('should return Err if the token does not exist in the repository', async () => {
      const mockRequest = {
        headers: { authorization: 'Bearer non-existent-uuid' },
      } as Request;

      const result = await authService.isUserConnected(mockRequest);

      expect(isErr(result)).toBe(true);
      // Note: Your service returns ERROR_DECODING_JWT_TOKEN when token isn't found
      expect(result.unwrapErr()).toBe(IS_CONNECTED_ERROR.ERROR_DECODING_TOKEN);
    });
  });
});
