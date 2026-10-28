import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

export default [{
  files: ["**/*.{js,ts,tsx}"],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    }
  },
  plugins: {
    react: reactPlugin,
    "react-hooks": reactHooksPlugin,
    "@typescript-eslint": tsPlugin,
    "jsx-a11y": jsxA11yPlugin
  },
  
  settings: {
    react: {
      version: "detect"
    }
  },

}];
