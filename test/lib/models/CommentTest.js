'use strict';

const { assert, expect } = require('chai');
const Comment = require('../../../lib/models/Comment');

describe('[lib/models/Comment] Tests', () => {
  it('should be invalid if redditId is empty', (done) => {
    const c = new Comment();

    c.validate((err) => {
      expect(err.errors.redditId).to.exist;
      done();
    });
  });

  it('should automatically set date on creation', (done) => {
    const c = new Comment({ redditId: 1 });

    c.validate((err) => {
      expect(err).to.not.exist;
      expect(c.date).to.exist;
      done();
    });
  });

  describe('isNew', () => {
    it('Executes cb if reddit comment id is not in the db', () => {
      assert(false);
    });

    it('Does not execute cb and updates date if reddit id already exists in db', () => {
      assert(false);
    });
  });
});
