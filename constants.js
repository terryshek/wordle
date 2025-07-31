const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const config = {
    wordList: [
        "hello",
        "world",
        "quite",
        "fancy",
        "fresh",
        "panic",
        "crazy",
        "buggy",
        "scare",
    ],
    maxRounds: 6,
};
const answer =
  config.wordList[
    Math.floor(Math.random() * config.wordList.length)
  ].toLowerCase();

module.exports = {
    config,
    answer,
    rl
};