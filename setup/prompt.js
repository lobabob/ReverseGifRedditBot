process.stdin.setEncoding('utf8');

var queue = [];

function Prompt(prompt, cb) {
    this.prompt = prompt;
    this.cb = cb;
}

process.stdin.on('readable', () => {
    var text = process.stdin.read();

    if (text !== null) {
        text = text.toString().trim();

        // Executes a callback for the prompt
        if (queue.length > 0) {
            queue[0].cb(null, text);
            queue.shift();
        }

        // Begins the next prompt if it exists
        if (queue.length > 0) {
            process.stdout.write(queue[0].prompt);
        }
    }
});

exports.ask = function ask(prompt, cb) {
    queue.push(new Prompt(prompt, cb));

    // Only executes if this is the first prompt being added
    if (queue.length == 1) {
        process.stdout.write(queue[0].prompt);
    }
};
