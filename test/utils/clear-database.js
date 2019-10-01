
/**
 * Module dependencies.
 */

import modelFactory from './model-factory';

/**
 * Export `clearDatabase`.
 */

export default async function() {
  const TestModel = modelFactory();
  const CompoundTestModel = modelFactory();

  await TestModel.query().truncate();
  await CompoundTestModel.query().truncate();
};
