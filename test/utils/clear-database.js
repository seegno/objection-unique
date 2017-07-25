
/**
 * Module dependencies.
 */

import modelFactory from './model-factory';

/**
 * Export `clearDatabase`.
 */

export default async function() {
  const TestModel = modelFactory();

  await TestModel.query().del();
};
