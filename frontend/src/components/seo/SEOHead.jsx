import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEOHead = ({ 
  title = "Nashik's Best Misal - Top Rated Misal Joints & Reviews",
  description = "Discover the best misal spots in Nashik! Explore authentic Chulhivarchi, Zanzanit spicy misal joints, read authentic customer reviews, and find top rated misal near you.",
  canonicalUrl = "https://nashikmisal.in/",
  ogImage = "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&h=630&q=80",
  keywords = "Nashik best misal, top misal in nashik, sadhana chulhivarchi misal, zanzanit misal nashik, misal pav nashik"
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="theme-color" content="#ea580c" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / WhatsApp / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Nashik's Best Misal" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEOHead;
