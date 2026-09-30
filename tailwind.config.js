/**@type {import('tailwindcss').Config}*/
module.exports = { 
     content: [
	 './src/**/*.{js,ts,jsx,tsx,mdx}'],
	 
	 theme: {
		 extend: {
			 colors: {
				 rose: {
					 50: '#fdf2f6',
					 100: '#fbe6ee',
					 500: '#d6336c',
					 600: '#c2255c',
					 900: '#3b0d1c',
				 },
			 },
		 },
	 },
	 plugins: [],
}