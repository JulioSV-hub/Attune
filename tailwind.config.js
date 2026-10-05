// Configuração do Tailwind. Classes usadas em strings de JS também são encontradas,
// desde que escritas por extenso (ex.: 'bg-teal-100 text-teal-700' em js/defaults.js).
module.exports = {
  content: ['./index.html', './*.js', './js/*.js', './admin/*.{html,js}', './ebooks/*.html', './atividades/*.{html,js}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
};
