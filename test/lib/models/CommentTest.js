'use strict';

const chai = require('chai');

const assert = chai.assert;
const expect = chai.expect;

const Comment = require('lib/models/Comment');

describe('[lib/models/Comment] Tests', function () {
  it('should be invalid if redditId is empty', function (done) {
    const c = new Comment();

    c.validate(err => {
      expect(err.errors.redditId).to.exist;
      done();
    });
  });

  it('should automatically set date on creation', function (done) {
    const c = new Comment({ redditId: 1 });

    c.validate(err => {
      expect(err).to.not.exist;
      expect(c.date).to.exist;
      done();
    });
  });

  describe('isNew', function () {
    it('Executes cb if reddit comment id is not in the db', function () {
      assert(false);
    });

    it('Does not execute cb and updates date if reddit id already exists in db', function () {
      assert(false);
    });
  });
});
