const mongoose = require('mongoose');

/**
 * Document that keeps track of reddit comment ids and when they were last seen by the scraper
 * Needed to make sure that comments aren't repeatedly replied to
 */
const CommentSchema = mongoose.Schema({
  redditId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

/**
 * Executes callback if reddit comment id is not in the database. Updates date of existing reddit ids.
 * @param  {String} id Reddit comment id
 */
CommentSchema.statics.isNew = function (id, cb) {
  return this.findOne({ redditId: id }, (err, comment) => {
    if (err) throw err;

    if (!comment) {
      this.create({ redditId: id });
      cb();
    } else {
      comment.date = Date.now();
      comment.save();
    }
  });
};

module.exports = mongoose.model('Comment', CommentSchema);
