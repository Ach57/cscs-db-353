const cases = require('./test-cases');
const remaining = cases.filter((c) => c.actions.length === 0);
console.log(
  `${remaining.length} of ${cases.length} test cases still need actions filled in:\n`,
);
remaining.forEach((c) => console.log(`  ${c.id}  [${c.suite}]  ${c.title}`));
