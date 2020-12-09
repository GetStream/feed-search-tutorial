module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ["get-off-my-lawn"],
  parser: "babel-eslint",
  rules: {
    'camelcase': 0,
    'consistent-return': 0,
    "eslint-comments/no-unused-disable": 0,
    "import/namespace": 0,
    "import/no-extraneous-dependencies": 0,
    "import/no-unresolved": 0,
    "no-empty-function": 0,
    "no-process-exit": 0,
    "no-warning-comments": 0,
    "node/no-extraneous-import": 0,
    "node/no-unpublished-import": 0,
    "spaced-comment": 0,
  },
};
