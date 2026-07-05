import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * useSEO Hook
 * Dynamically updates document metadata for SEO, Open Graph, Twitter Cards,
 * Canonical URLs, Language Alternates, and JSON-LD structured schemas.
 *
 * @param {object} seoProps
 * @param {string} seoProps.title - Page title
 * @param {string} seoProps.description - Meta description
 * @param {string} seoProps.ogImage - Open Graph image URL
 * @param {string} seoProps.ogType - Open Graph type (e.g. article, website, book)
 * @param {string} seoProps.canonicalPath - Path for canonical URL (e.g. '/books')
 * @param {object} seoProps.schemaData - JSON-LD schema object
 */
export function useSEO({
  title,
  description,
  ogImage,
  ogType = 'website',
  canonicalPath,
  schemaData,
}) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  useEffect(() => {
    // 1. Title
    const baseTitle = 'Shukritrade | Smart Trading Platform';
    document.title = title ? `${title} | Shukritrade` : baseTitle;

    // Helper to set meta tags
    const setMetaTag = (propertyOrName, content, isProperty = false) => {
      if (!content) return;
      const selector = isProperty
        ? `meta[property="${propertyOrName}"]`
        : `meta[name="${propertyOrName}"]`;
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', propertyOrName);
        } else {
          element.setAttribute('name', propertyOrName);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta tags
    const defaultDesc = 'Master the Forex and Crypto markets with professional training, AI Trading Bot recommendations, and technical analysis indicators.';
    setMetaTag('description', description || defaultDesc);
    setMetaTag('robots', 'index, follow');

    // 3. Open Graph
    const siteUrl = 'https://shukritrade.com';
    const currentUrl = `${siteUrl}${canonicalPath || ''}`;
    const defaultImage = `${siteUrl}/shukritrade_logo.svg`;

    setMetaTag('og:title', title ? `${title} | Shukritrade` : baseTitle, true);
    setMetaTag('og:description', description || defaultDesc, true);
    setMetaTag('og:image', ogImage || defaultImage, true);
    setMetaTag('og:url', currentUrl, true);
    setMetaTag('og:type', ogType, true);
    setMetaTag('og:site_name', 'Shukritrade', true);

    // 4. Twitter Cards
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title ? `${title} | Shukritrade` : baseTitle);
    setMetaTag('twitter:description', description || defaultDesc);
    setMetaTag('twitter:image', ogImage || defaultImage);

    // 5. Canonical link tag
    let canonicalLink = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // 6. Alternate Languages link tags
    const languages = ['en', 'ar', 'fr'];
    languages.forEach((lang) => {
      let langLink = document.head.querySelector(`link[rel="alternate"][hreflang="${lang}"]`);
      if (!langLink) {
        langLink = document.createElement('link');
        langLink.setAttribute('rel', 'alternate');
        langLink.setAttribute('hreflang', lang);
        document.head.appendChild(langLink);
      }
      langLink.setAttribute('href', `${siteUrl}/#${canonicalPath || ''}?lng=${lang}`);
    });

    // 7. Structured Data (JSON-LD)
    let schemaScript = document.getElementById('json-ld-schema');
    if (schemaScript) {
      schemaScript.textContent = '';
    } else {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('type', 'application/ld+json');
      schemaScript.setAttribute('id', 'json-ld-schema');
      document.head.appendChild(schemaScript);
    }

    if (schemaData) {
      schemaScript.textContent = JSON.stringify(schemaData);
    } else {
      // Default Organization Schema
      const defaultOrgSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'Shukritrade',
        'url': siteUrl,
        'logo': defaultImage,
        'sameAs': [
          'https://t.me/shukritrade',
          'https://twitter.com/shukritrade'
        ],
        'description': defaultDesc
      };
      schemaScript.textContent = JSON.stringify(defaultOrgSchema);
    }

    // Cleanup on unmount
    return () => {
      // Keep general tags but we can clear schema
      if (schemaScript) {
        schemaScript.textContent = '';
      }
    };
  }, [title, description, ogImage, ogType, canonicalPath, schemaData, currentLang]);
}
export default useSEO;
