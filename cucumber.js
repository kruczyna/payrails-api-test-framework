module.exports = {
  default: [
    '--require-module ts-node/register',
    '--require features/step-definitions/**/*.ts',
    'features/**/*.feature'
  ].join(' ')
};
