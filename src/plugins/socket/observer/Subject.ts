import { Sector } from 'src/entities/sector.entity';
import { Observer } from './Observer';

export interface Subject {
  attach(observer: Observer): void;

  detach(id: number): void;

  contains(id: number): boolean;

  notify(topic: string, data: any): void;
}

export class SectorSubject implements Subject {
  public state: number;
  public data: Sector;
  private observers: Observer[] = [];

  constructor({ data }) {
    this.data = data;
  }

  public attach(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log('Subject: Observer has been attached already.');
    }

    console.log('Subject: Succesfuly subscription.');
    this.observers.push(observer);
  }

  public detach(id: number): void {
    const observerIndex = this.observers.findIndex(
      (observer) => observer.id === id,
    );
    if (observerIndex === -1) {
      return console.log('Subject: Nonexistent observer.');
    }

    this.observers.splice(observerIndex, 1);
    console.log('Subject: subscription deleted.');
  }

  public contains(id: number): boolean {
    return !!this.observers.find((observer) => observer.id === id);
  }

  public notify(topic: string, data: any): void {
    console.log('Subject: Notifying observers...');
    for (const observer of this.observers) {
      observer.update(topic, data);
    }
  }
}
