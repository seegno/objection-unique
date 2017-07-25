
/**
 * Module dependencies.
 */

import { ValidationError } from 'objection';
import clearDatabase from './utils/clear-database';
import modelFactory from './utils/model-factory';

/**
 * Test `FoobarController`.
 */

describe('FoobarController', () => {
  beforeEach(clearDatabase);

  describe('$beforeInsert', () => {
    it('should throw an error if there is no fields or identifiers options.', async () => {
      const TestModel = modelFactory();

      try {
        await TestModel.query().insert({});

        fail();
      } catch (e) {
        expect(e.message).toBe('Fields and identifiers options must be defined.');
      }
    });

    it('should throw a `ValidationError` with the unique fields that are already used.', async () => {
      const TestModel = modelFactory({
        fields: ['bar', 'foo']
      });

      await TestModel.query().insert({ bar: 'bar', foo: 'foo' });

      try {
        await TestModel.query().insert({ bar: 'bar', foo: 'foo' });

        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.data).toEqual({
          bar: [{
            keyword: 'unique',
            message: 'bar already in use.'
          }],
          foo: [{
            keyword: 'unique',
            message: 'foo already in use.'
          }]
        });
      }
    });

    it('should insert the given data ignoring null values validation.', async () => {
      const TestModel = modelFactory({
        fields: ['bar', 'foo']
      });

      await TestModel.query().insert({ bar: 'bar', biz: 'biz', foo: null });

      const { id } = await TestModel.query().insert({ bar: 'buz', foo: null });
      const result = await TestModel.query().findById(id);

      expect(result).toEqual({ bar: 'buz', biz: null, foo: null, id });
    });

    it('should insert the given data.', async () => {
      const TestModel = modelFactory({
        fields: ['bar', 'foo']
      });

      const { id } = await TestModel.query().insert({ bar: 'bar', biz: 'biz', foo: 'foo' });
      const result = await TestModel.query().findById(id);

      expect(result).toEqual({ bar: 'bar', biz: 'biz', foo: 'foo', id });
    });
  });

  describe('$beforeUpdate', () => {
    it('should throw an error if there is no fields or identifiers options.', async () => {
      const TestModel = modelFactory();

      try {
        await TestModel.query().update({});

        fail();
      } catch (e) {
        expect(e.message).toBe('Fields and identifiers options must be defined.');
      }
    });

    it('should throw an error if update is not a $query method.', async () => {
      const TestModel = modelFactory({
        fields: ['bar', 'foo']
      });

      try {
        await TestModel.query().update({});

        fail();
      } catch (e) {
        expect(e.message).toBe('Unique validation at update only works with queries started with $query.');
      }
    });

    it('should throw a `ValidationError` with the unique fields that are already used.', async () => {
      const TestModel = modelFactory({
        fields: ['bar', 'foo']
      });

      await TestModel.query().insert({ bar: 'bar', foo: 'foo' });

      const result = await TestModel.query().insertAndFetch({ bar: 'biz', foo: 'buz' });

      try {
        await result.$query().update({ bar: 'bar', foo: 'foo' });

        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.data).toEqual({
          bar: [{
            keyword: 'unique',
            message: 'bar already in use.'
          }],
          foo: [{
            keyword: 'unique',
            message: 'foo already in use.'
          }]
        });
      }
    });

    it('should update the entity ignoring the unique validation if the values are from the same entity that are begin updated.', async () => {
      const TestModel = modelFactory({
        fields: ['bar', 'foo']
      });

      let result = await TestModel.query().insertAndFetch({ bar: 'biz', foo: 'buz' });

      result = await result.$query().updateAndFetch({ bar: 'biz', biz: 'foo', foo: 'buz' });

      expect(result).toEqual({ ...result, biz: 'foo' });
    });

    it('should update the entity ignoring null values validation.`', async () => {
      const TestModel = modelFactory({
        fields: ['bar', 'foo']
      });

      let result = await TestModel.query().insert({ bar: 'bar', foo: null });

      result = await result.$query().updateAndFetch({ bar: 'biz', biz: 'waldo', foo: null });

      expect(result).toEqual({ bar: 'biz', biz: 'waldo', foo: null, id: result.id });
    });

    it('should update the entity.`', async () => {
      const TestModel = modelFactory({
        fields: ['bar', 'foo']
      });

      let result = await TestModel.query().insertAndFetch({ bar: 'bar', foo: 'foo' });

      result = await result.$query().patchAndFetch({ bar: 'biz' });

      expect(result.bar).toBe('biz');
    });
  });
});
