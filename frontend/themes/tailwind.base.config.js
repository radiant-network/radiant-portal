/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  theme: {
    extend: {
      borderColor: ({ theme }) => ({
        ...theme('colors'),
        DEFAULT: theme('colors.border'),
        border: 'hsl(var(--base-border))',
      }),
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      maxWidth: {
        '8xl': '90rem', // 8xl -> 1440px
      },
      colors: ({ theme }) => ({
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--base-popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        amber: {
          DEFAULT: 'hsl(var(--amber))',
          foreground: 'hsl(var(--red-foreground))',
        },
        red: {
          DEFAULT: 'hsl(var(--red))',
          foreground: 'hsl(var(--red-foreground))',
        },
        orange: {
          DEFAULT: 'hsl(var(--orange))',
          foreground: 'hsl(var(--orange-foreground))',
        },
        yellow: {
          DEFAULT: 'hsl(var(--yellow))',
          foreground: 'hsl(var(--yellow-foreground))',
        },
        lime: {
          DEFAULT: 'hsl(var(--lime))',
          foreground: 'hsl(var(--lime-foreground))',
        },
        green: {
          DEFAULT: 'hsl(var(--green))',
          foreground: 'hsl(var(--green-foreground))',
        },
        cyan: {
          DEFAULT: 'hsl(var(--cyan))',
          foreground: 'hsl(var(--cyan-foreground))',
        },
        blue: {
          DEFAULT: 'hsl(var(--blue))',
          foreground: 'hsl(var(--blue-foreground))',
        },
        violet: {
          DEFAULT: 'hsl(var(--violet))',
          foreground: 'hsl(var(--violet-foreground))',
        },
        fuchsia: {
          DEFAULT: 'hsl(var(--fuchsia))',
          foreground: 'hsl(var(--fuchsia-foreground))',
        },
        slate: {
          DEFAULT: 'hsl(var(--slate))',
          foreground: 'hsl(var(--slate-foreground))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        sidebar: {
          background: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
        },
        'sidebar-primary': {
          DEFAULT: 'hsl(var(--sidebar-primary))',
          foreground: 'hsl(var(--sidebar-primary-foreground))',
        },
        'sidebar-accent': {
          DEFAULT: 'hsl(var(--sidebar-accent))',
          foreground: 'hsl(var(--sidebar-accent-foreground))',
        },
        'sidebar-border': 'hsl(var(--sidebar-border))',
        'sidebar-ring': 'hsl(var(--sidebar-ring))',
        bookmark: {
          amber: 'hsl(var(--bookmark-amber))',
          blue: 'hsl(var(--bookmark-blue))',
          green: 'hsl(var(--bookmark-green))',
          red: 'hsl(var(--bookmark-red))',
          off: 'hsl(var(--bookmark-off))',
        },
      }),
      cursor: {
        default: 'pointer',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
