declare module 'objection-unique' {
  import { Model } from 'objection';

  export default function (options: {
    identifiers: Array<string | string[]>;
    fields: Array<string | string[]>;
  }): <T extends typeof Model>(model: T) => T
}
