import { useEffect } from 'react';

/**
 * Hook para manejar meta tags SEO dinámicos por página
 * @param {Object} options - Opciones de SEO
 * @param {string} options.title - Título de la página
 * @param {string} options.description - Descripción de la página
 * @param {string} options.keywords - Keywords adicionales
 * @param {string} options.image - URL de la imagen para compartir
 * @param {string} options.url - URL canónica de la página
 */
export function useSEO({ title, description, keywords, image, url }) {
  useEffect(() => {
    // Título
    if (title) {
      document.title = `${title} | Rosaline Bakery`;
    }

    // Meta description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      } else {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        metaDesc.setAttribute('content', description);
        document.head.appendChild(metaDesc);
      }
    }

    // Meta keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      } else {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        metaKeywords.setAttribute('content', keywords);
        document.head.appendChild(metaKeywords);
      }
    }

    // Open Graph
    if (title) {
      updateMetaTag('property', 'og:title', title);
    }
    if (description) {
      updateMetaTag('property', 'og:description', description);
    }
    if (image) {
      updateMetaTag('property', 'og:image', image);
    }
    if (url) {
      updateMetaTag('property', 'og:url', url);
    }

    // Twitter Card
    if (title) {
      updateMetaTag('name', 'twitter:title', title);
    }
    if (description) {
      updateMetaTag('name', 'twitter:description', description);
    }
    if (image) {
      updateMetaTag('name', 'twitter:image', image);
    }

    // Canonical URL
    if (url) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', url);
      } else {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        canonical.setAttribute('href', url);
        document.head.appendChild(canonical);
      }
    }

    // Cleanup function
    return () => {
      // Restaurar título por defecto si es necesario
    };
  }, [title, description, keywords, image, url]);
}

/**
 * Función auxiliar para actualizar o crear meta tags
 */
function updateMetaTag(attribute, selector, content) {
  let meta = document.querySelector(`meta[${attribute}="${selector}"]`);
  if (meta) {
    meta.setAttribute('content', content);
  } else {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, selector);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  }
}

