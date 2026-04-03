/**
 * Marketly SEO Utility
 * Handles dynamic meta tags and JSON-LD schema generation
 */

export const generateProductSchema = (product: any) => {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": product.images,
    "description": product.description,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": product.sellerName
    },
    "offers": {
      "@type": "Offer",
      "url": `https://marketly.com/product/${product.id}`,
      "priceCurrency": "USD",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": product.sellerName
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || 4.5,
      "reviewCount": "45"
    }
  };
};

export const updateMetaTags = (title: string, description: string, image?: string) => {
  document.title = `${title} | Marketly`;
  
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute("content", description);
  } else {
    const meta = document.createElement('meta');
    meta.name = "description";
    meta.content = description;
    document.getElementsByTagName('head')[0].appendChild(meta);
  }

  // OG Tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute("content", description);

  if (image) {
    const ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg) ogImg.setAttribute("content", image);
  }
};