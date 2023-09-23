import { Subject } from './Subject';

export interface Observer {
  id: number;
  // Receive update from subject.
  update(subject: Subject): void;
}

export class ScreenObserver implements Observer {
  id: number;

  constructor({ id }) {
    this.id = id;
  }

  public update(subject: Subject): void {
    // if (subject instanceof ConcreteSubject && subject.state < 3) {
    //     console.log('ConcreteObserverA: Reacted to the event.');
    // }

    console.log('Screen Notificated');
  }
}
