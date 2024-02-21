require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    extends: "@chainsafe" ,
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
    },
    "overrides": [
      {
        // enable the rule specifically for TypeScript files
        "files": ["*.ts"],
        "rules": {
          "@typescript-eslint/explicit-function-return-type": "error",
        },
      },
    ],
}