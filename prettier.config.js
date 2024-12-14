module.exports = {
  semi: false,
  trailingComma: 'all',
  singleQuote: true,
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    // Must come last! see url below
    'prettier-plugin-tailwindcss',
  ],
  importOrder: [
    'react', // React
    '^react-.*$', // React-related imports
    '^next', // Next-related imports
    '^next-.*$', // Next-related imports
    '^next/.*$', // Next-related imports
    '^.*/stores/.*$', // Stores
    '^.*/supabase/.*$', // Supabase
    '^.*/lib/.*$', // Lib
    '^.*/utils/.*$', // Utils
    '^.*/types/.*$', // Types
    '^.*/app/.*$', // App
    '^.*/components/.*$', // Components
    '^[./]', // Other imports
    '.*', // Any uncaught imports
  ],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
}
