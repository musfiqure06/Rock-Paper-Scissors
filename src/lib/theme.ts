export const applyTheme = (theme: string) => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else if (theme === 'glass') {
    root.setAttribute('data-theme', 'glass');
  } else {
    root.removeAttribute('data-theme');
  }
};
