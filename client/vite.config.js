import checker from 'vite-plugin-checker';

//  Note that Vite only performs transpilation on .ts files and does NOT perform type checking
export default {
  plugins: [
    checker({
      typescript: true,
    }),
  ],
};
