'use strict';

const queue = [];

process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
  let text = process.stdin.read();

  if (text !== null) {
    text = text.toString().trim();

    // Executes a callback for the prompt
    if (queue.length > 0) {
      queue[0].cb(null, text);
      queue.shift();
    }

    // Begins the next prompt if it exists
    if (queue.length > 0) process.stdout.write(queue[0].prompt);
  }
});

function ask(prompt, cb) {
  queue.push({ prompt, cb });
  // Starts the flow of prompts to stdout. The rest are triggered above in the 'readable' event handler.
  if (queue.length === 1) process.stdout.write(queue[0].prompt);
};

module.exports = {
  ask,
};
