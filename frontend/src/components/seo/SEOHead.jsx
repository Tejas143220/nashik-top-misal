import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEOHead = ({ 
  title = "Nashik's Best Misal - Top Rated Misal Joints & Reviews",
  description = "Discover the best misal spots in Nashik! Explore authentic Chulhivarchi, Zanzanit spicy misal joints, read authentic customer reviews, and find top rated misal near you.",
  canonicalUrl = "https://nashikmisal.in/",
  ogImage = "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46",
  keywords = "Nashik best misal, top misal in nashik, sadhana chulhivarchi misal, zanzanit misal nashik, misal pav nashik"
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEOHead;
