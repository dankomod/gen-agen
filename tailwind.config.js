module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    backgroundColor: ({ after }) => after(["disabled"]),
    extend: {
      backgroundColor: ["checked"],
    },
  },
  plugins: [],
  // plugins: [require("@tailwindcss/forms")],
};
