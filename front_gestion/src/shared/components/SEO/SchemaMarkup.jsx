import React from 'react';

/**
 * Componente para agregar Schema.org JSON-LD markup
 * Mejora el SEO proporcionando información estructurada a los motores de búsqueda
 */
export function SchemaMarkup() {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "name": "Rosaline Bakery",
    "description": "Pastelería y galletaría artesanal en Neiva especializada en productos saludables y caseros. Postres y galletas elaborados con amor e ingredientes frescos.",
    "url": "https://tu-dominio.com",
    "logo": "https://tu-dominio.com/img/logo.png",
    "image": "https://tu-dominio.com/img/logo.png",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Neiva",
      "addressRegion": "Huila",
      "addressCountry": "CO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "2.9986",
      "longitude": "-75.3022"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "08:00",
        "closes": "20:00"
      }
    ],
    "servesCuisine": "Repostería Artesanal",
    "menu": "https://tu-dominio.com/productos",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "50"
    },
    "sameAs": [
      "https://www.facebook.com/rosalinebakery",
      "https://www.instagram.com/rosalinebakery"
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Rosaline Bakery",
    "url": "https://tu-dominio.com",
    "logo": "https://tu-dominio.com/img/logo.png",
    "description": "Pastelería y galletaría artesanal en Neiva",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Neiva",
      "addressRegion": "Huila",
      "addressCountry": "CO"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "areaServed": "CO",
      "availableLanguage": "Spanish"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Rosaline Bakery",
    "url": "https://tu-dominio.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://tu-dominio.com/productos?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://tu-dominio.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Productos",
        "item": "https://tu-dominio.com/productos"
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(businessSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </>
  );
}

export default SchemaMarkup;

