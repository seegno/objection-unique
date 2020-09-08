declare module 'objection-unique' {
  import { Model } from 'objection';

  type Constructor<T = {}> = new (...args: any[]) => T;

  export default function (options?: {
    identifiers?: string[];
    fields?: string[];
  }): <T extends typeof Model>(model: T) => T & Constructor<T>
}
