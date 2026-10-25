// В вебе браузер по умолчанию рисует текст «жирнее», чем Figma и iOS: на macOS
// буквы расплываются, особенно заметно на кириллице. Тонкое сглаживание
// делает текст аккуратным, как в макете. На нативе ничего не нужно.
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    body {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }
  `;
  document.head.appendChild(style);
}
