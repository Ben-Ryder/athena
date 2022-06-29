module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@ben-ryder/jigsaw/**/*.js" // <-- add to ensure styles are included at build time
  ],
  theme: {
    extend: {},
  },
  plugins: [
    ...(require("@ben-ryder/jigsaw").plugins) // <-- add the plugins to use custom colours etc
  ],
}