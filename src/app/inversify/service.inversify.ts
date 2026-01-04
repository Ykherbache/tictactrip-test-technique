import { Container } from 'inversify';
import { JustifyTextService } from '../features/ justify-text/types/justifyTextService';
import { TYPE } from './type.inversify';
import { JustifyTextConcreteService } from '../features/ justify-text/justifyTextConcreteService';

export function setupServiceContainer(iocContainer: Container) {
  iocContainer.bind<JustifyTextService>(TYPE.JustifyTextService).to(JustifyTextConcreteService).inSingletonScope();
}
