/** @type {import("prettier").Config & { importOrder: string[], importOrderSeparation: boolean, importOrderSortSpecifiers: boolean }} */
const config = {
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    require.resolve("prettier-plugin-tailwindcss"),
  ],
  importOrder: ["^@/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  tabSize: 2,
  singleQuote: false,
  semi: false,
};

module.exports = config;
