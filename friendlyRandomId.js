const friendlyWords = require('friendly-words');

// e.g. 'obtainable-neon-waiter'
const generate = () => {
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  return `${pick(friendlyWords.predicates)}-${pick(
    friendlyWords.objects
  )}-${pick(friendlyWords.objects)}`;
};

module.exports = generate;
