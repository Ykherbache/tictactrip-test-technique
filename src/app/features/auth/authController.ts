import { MiddlewareFunction } from '../../types/middlewareFunction';
import { TYPE } from '../../inversify/type.inversify';
import { AuthService } from './types/authService';
import { inject, injectable } from 'inversify';
import { isValidEmail } from '../../utils/isValidEmail';
import { logger } from '../../utils/logger';

@injectable()
export class AuthController {
  constructor(
    @inject(TYPE.AuthService)
    private readonly authService: AuthService,
  ) {}
  public generateToken: MiddlewareFunction = async (req, res) => {
    try {
      const email = req.body?.email;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email is required' });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      const token = await this.authService.authenticate(email);

      return res.json({ token });
    } catch (err) {
      logger.error('Error generating token:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
