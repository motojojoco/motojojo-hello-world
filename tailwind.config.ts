
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Motojojo custom colors
				violet: {
					DEFAULT: '#6A0DAD',
					50: '#F2E6FF',
					100: '#E5CCFF',
					200: '#CC99FF',
					300: '#B266FF',
					400: '#9933FF',
					500: '#8000FF',
					600: '#6A0DAD',
					700: '#5A079D',
					800: '#4A058D',
					900: '#3A037D'
				},
				red: {
					DEFAULT: '#FF1F4C',
					50: '#FFE6ED',
					100: '#FFCCDA',
					200: '#FF99B5',
					300: '#FF6690',
					400: '#FF336B',
					500: '#FF1F4C',
					600: '#E6003D',
					700: '#CC0036',
					800: '#B3002F',
					900: '#990028'
				},
				yellow: {
					DEFAULT: '#FFC300',
					50: '#FFF9E6',
					100: '#FFF3CC',
					200: '#FFE799',
					300: '#FFDB66',
					400: '#FFCF33',
					500: '#FFC300',
					600: '#E6B000',
					700: '#CC9C00',
					800: '#B38900',
					900: '#997300'
				}
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'2xl': '1rem',
				'3xl': '1.5rem',
				'4xl': '2rem',
			},
			boxShadow: {
				'soft': '0 4px 20px 0 rgba(0, 0, 0, 0.1)',
				'glow': '0 0 15px rgba(106, 13, 173, 0.5)',
				'glow-red': '0 0 15px rgba(255, 31, 76, 0.5)',
				'glow-yellow': '0 0 15px rgba(255, 195, 0, 0.5)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				'slide-up': {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				'slide-down': {
					'0%': { transform: 'translateY(-10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				'scale': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				'pulse-gentle': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-up': 'slide-up 0.3s ease-out',
				'slide-down': 'slide-down 0.3s ease-out',
				'scale': 'scale 0.3s ease-out',
				'pulse-gentle': 'pulse-gentle 2s infinite',
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
