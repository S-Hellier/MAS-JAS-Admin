/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          DEFAULT: '#7C9070', // Warm Sage
          dark: '#5A6B4F', // Deep Forest Green
          light: '#9AAA8E', // Light Sage
        },
        // Accent Colors
        accent: {
          DEFAULT: '#E8B862', // Golden Wheat
          secondary: '#D4896D', // Terra Cotta
        },
        // Background Colors
        background: {
          DEFAULT: '#F9F7F3', // Warm Off-White
          surface: '#FFFFFF', // Pure White
        },
        // Text Colors
        text: {
          primary: '#2D3A28', // Deep Forest Green
          secondary: '#5F6B5A', // Medium Gray-Green
          tertiary: '#8B9A82', // Light Gray-Green
          inverse: '#FFFFFF', // White
        },
        // Status Colors
        status: {
          success: '#7C9070', // Sage Green
          warning: '#E8B862', // Golden Wheat
          urgent: '#D4896D', // Terra Cotta
          error: '#C97064', // Warm Terracotta Red
          info: '#9AAA8E', // Light Sage
        },
        // Border Colors
        border: {
          DEFAULT: '#E5E1D8', // Warm light border
          dark: '#D4CFBF', // Warm medium border
          focus: '#7C9070', // Primary color
        },
        // UI State Colors
        disabled: '#E5E1D8',
        placeholder: '#A09688',
        divider: '#E5E1D8',
      },
      boxShadow: {
        light: '0 1px 3px 0 rgba(45, 58, 40, 0.1)',
        medium: '0 4px 6px -1px rgba(45, 58, 40, 0.15)',
        heavy: '0 10px 15px -3px rgba(45, 58, 40, 0.25)',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '12px',
        xl: '16px',
        pill: '20px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        base: '16px',
        lg: '20px',
        xl: '24px',
        xxl: '32px',
        xxxl: '40px',
      },
      fontSize: {
        display: '32px',
        h1: '28px',
        h2: '24px',
        h3: '20px',
        h4: '18px',
        body: '16px',
        'body-small': '14px',
        label: '14px',
        caption: '13px',
        small: '12px',
        button: '16px',
      },
      lineHeight: {
        tight: '1.2',
        normal: '1.5',
        relaxed: '1.75',
      },
    },
  },
  plugins: [],
}


