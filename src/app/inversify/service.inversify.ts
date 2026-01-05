import { Container } from 'inversify';
import { JustifyTextService } from '../features/justify-text/types/justifyTextService';
import { TYPE } from './type.inversify';
import { JustifyTextConcreteService } from '../features/justify-text/justifyTextConcreteService';
import { AuthService } from '../features/auth/types/authService';
import { AuthConcreteService } from '../features/auth/authConcreteService';

export function setupServiceContainer(iocContainer: Container) {
  iocContainer
    .bind<JustifyTextService>(TYPE.JustifyTextService)
    .to(JustifyTextConcreteService)
    .inSingletonScope();
  iocContainer
    .bind<AuthService>(TYPE.AuthService)
    .to(AuthConcreteService)
    .inSingletonScope();
}
