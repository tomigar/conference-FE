import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'
export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        
      }
    },
     typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-bullets': theme('colors.pink.500'),
            li: {
              p: {
                margin: 0,
              },
            },
          },
        },
      }),
  },
  plugins: [
   typography,
  ],
}
