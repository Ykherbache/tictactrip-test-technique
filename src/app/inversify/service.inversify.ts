import { Container } from 'inversify';
import { JustifyTextService } from '../features/justify-text/types/justifyTextService';
import { TYPE } from './type.inversify';
import { JustifyTextConcreteService } from '../features/justify-text/justifyTextConcreteService';
import { AuthService } from '../features/auth/types/authService';
import { AuthConcreteService } from '../features/auth/authConcreteService';
import { WordQuotaService } from '../features/justify-text/types/wordQuotaService';
import { WordQuotaConcreteService } from '../features/justify-text/wordQuotaConcreteService';

/**
 * Register application service bindings on the provided IoC container.
 *
 * Binds the JustifyTextService, AuthService, and WordQuotaService identifiers
 * to their concrete implementations in singleton scope.
 *
 * @param iocContainer - The Inversify container to configure with service bindings
 */
export function setupServiceContainer(iocContainer: Container) {
  iocContainer
    .bind<JustifyTextService>(TYPE.JustifyTextService)
    .to(JustifyTextConcreteService)
    .inSingletonScope();
  iocContainer
    .bind<AuthService>(TYPE.AuthService)
    .to(AuthConcreteService)
    .inSingletonScope();
  iocContainer
    .bind<WordQuotaService>(TYPE.WordQuotaService)
    .to(WordQuotaConcreteService)
    .inSingletonScope();
}