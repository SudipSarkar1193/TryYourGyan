/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        btnColor: "rgb(22, 15, 42)",
        btnTextColor: "rgb(165, 189, 241)",
        outlineColor1: "rgba(167, 139, 250)",
      },
      animation: {
        'spin-slow': 'spin 3s linear 0.7s',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark"], // Specify themes here
  },
};
