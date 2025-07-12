/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode based on the 'dark' class
  theme: {
    extend: {
      colors: {
        // Light Mode Colors (Default)
        primary: '#9E7FFF', // Primary color can be consistent or have light/dark variants
        secondary: '#38bdf8',
        accent: '#f472b6',
        background: '#F3F4F6',   // Light background
        surface: '#FFFFFF',     // Light surface for cards/elements
        text: '#1F2937',        // Dark text for light mode
        textSecondary: '#6B7280', // Lighter grey for secondary text
        border: '#E5E7EB',      // Light border
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',

        // Dark Mode Overrides (used with 'dark:' prefix in components)
        'dark-background': '#171717', // Dark background
        'dark-surface': '#262626',   // Dark surface for cards/elements
        'dark-text': '#FFFFFF',      // Light text for dark mode
        'dark-textSecondary': '#A3A3A3', // Darker grey for secondary text
        'dark-border': '#2F2F2F',    // Dark border
      },
      borderRadius: {
        'xl': '16px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        // Adjust shadows for light mode (less harsh)
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.075)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
