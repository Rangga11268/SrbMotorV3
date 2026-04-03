import reactPlugin from "eslint-plugin-react";

export default [
  {
    files: ["resources/js/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        document: "readonly",
        window: "readonly",
        console: "readonly",
        route: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        process: "readonly",
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        FormData: "readonly",
        app: "readonly",
        React: "readonly"
      }
    },
    plugins: {
      react: reactPlugin
    },
    rules: {
      "no-undef": "error",
      "react/jsx-no-undef": "error"
    }
  }
];
