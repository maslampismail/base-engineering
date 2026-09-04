export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function scrollToSection(targetId) {
  if (typeof window === 'undefined' || !targetId) return;

  const performScroll = () => {
    const cleanId = targetId.replace(/^[#/]+/, '');

    if (cleanId === 'hero' || cleanId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      return;
    }

    const element = document.getElementById(cleanId);
    if (!element) return;

    const headerInner = document.querySelector('.header-inner') || document.querySelector('.header-wrapper');
    const headerHeight = headerInner ? headerInner.getBoundingClientRect().height : 76;
    const elementPosition = element.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0);
    const offsetPosition = Math.max(0, Math.round(elementPosition - headerHeight));

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });

    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(() => {
      setTimeout(performScroll, 10);
    });
  } else {
    performScroll();
  }
}

