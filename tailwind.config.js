/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Map Material system colors to Tailwind utility classes
        primary: 'var(--mat-sys-primary)',
        'on-primary': 'var(--mat-sys-on-primary)',
        'primary-container': 'var(--mat-sys-primary-container)',
        'on-primary-container': 'var(--mat-sys-on-primary-container)',
        secondary: 'var(--mat-sys-secondary)',
        'on-secondary': 'var(--mat-sys-on-secondary)',
        'secondary-container': 'var(--mat-sys-secondary-container)',
        'on-secondary-container': 'var(--mat-sys-on-secondary-container)',
        tertiary: 'var(--mat-sys-tertiary)',
        'on-tertiary': 'var(--mat-sys-on-tertiary)',
        'tertiary-container': 'var(--mat-sys-tertiary-container)',
        'on-tertiary-container': 'var(--mat-sys-on-tertiary-container)',
        error: 'var(--mat-sys-error)',
        'on-error': 'var(--mat-sys-on-error)',
        'error-container': 'var(--mat-sys-error-container)',
        'on-error-container': 'var(--mat-sys-on-error-container)',
        background: 'var(--mat-sys-background)',
        'on-background': 'var(--mat-sys-on-background)',
        surface: 'var(--mat-sys-surface)',
        'on-surface': 'var(--mat-sys-on-surface)',
        'surface-variant': 'var(--mat-sys-surface-variant)',
        'on-surface-variant': 'var(--mat-sys-on-surface-variant)',
        outline: 'var(--mat-sys-outline)',
      },
    },
  },
  plugins: [],
};