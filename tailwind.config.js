/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
export default withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      darkgreen: "#162d2b",
      lightblueBG: "#7992bc",
      headingText: "#f4f9ff",
      lightpurple: "#ac207b",
      lightGreen: "#5a928d",
      homePageBg: "#abbfc7",
      lightblue: "#71BEE3",
    },
    screens: {
      Tablet: "425px",
    },
    extend: {
      backgroundImage: {
        "chatroom-background": "url('chat-background.png')",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".scroll-bar": {
          "&::-webkit-scrollbar": {
            width: "5px",
          },
          "&::-webkit-scrollbar-track": {
            background: "white",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#9ca3af",
          },
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
});
