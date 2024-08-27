declare module 'eslint-plugin-react-refresh' {
  import type {
    ClassicConfig,
    Linter,
  } from '@typescript-eslint/utils/ts-eslint';

  declare const exprt: {
    configs: {
      recommended: ClassicConfig.Config;
    };
    rules: NonNullable<Linter.Plugin['rules']>;
  };
  export = exprt;
}
