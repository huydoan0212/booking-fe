/** @type {import('tailwindcss').Config} */

/** generates a map of sizes from min to max e.g. {'1px':'1px',..., '60px':'60px'} */
function genPxSizeMap(min, max) {
  const sizes = {};
  for (let size = min; size <= max; size++) {
    const sizeToAdd = `${size}px`;
    sizes[sizeToAdd] = sizeToAdd;
  }
  return sizes;
}

module.exports = {
  prefix: "tw-",
  important: true,
  darkMode: "class", // Sửa "selector" thành "class"
  content: ["./src/**/*.{html,ts,scss}"],
  theme: {
    container: {
      center: true,
      screens: {
        sm: "100%",
        md: "100%",
        lg: "100%",
        xl: "100%",
        "2xl": "100%",
      },
    },
    colors: {
      white: "#ffffff",
      black: "#000000",
      orange: "#f97316"
    },
    fontFamily: {
      "roboto-black": ["Roboto-Black", "sans-serif"],
      "roboto-bold": ["Roboto-Bold", "sans-serif"],
      "roboto-light": ["Roboto-Light", "sans-serif"],
      "roboto-medium": ["Roboto-Medium", "sans-serif"],
      "roboto-regular": ["Roboto-Regular", "sans-serif"],
      "roboto-thin": ["Roboto-Thin", "sans-serif"],
    },
    screens: {
      sm: "480px",
      md: "600px",
      lg: "1014px",
      xl: "1336px",
    },
    extend: {
      fontSize: genPxSizeMap(1, 150),
      spacing: genPxSizeMap(1, 300),
      borderRadius: genPxSizeMap(1, 150),
      transitionProperty: {
        'transform': 'transform', // Bật transition-transform
      },
    },
  },
  plugins: [],
};
