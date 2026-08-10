import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOHead from '../components/seo/SEOHead';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import { fetchShopBySlug } from '../services/api';
import ShopHeader from '../components/detail/ShopHeader';
import ShopOverview from '../components/detail/ShopOverview';
import VideoReelsPlayer from '../components/detail/VideoReelsPlayer';
import ReviewSection from '../components/detail/ReviewSection';
import MapWidget from '../components/detail/MapWidget';
import ReviewFormModal from '../components/detail/ReviewFormModal';
import QueueCheckinModal from '../components/detail/QueueCheckinModal';
import AdSlot from '../components/common/AdSlot';
import BoilingCurryLoader from '../components/animations/BoilingCurryLoader';
import { ChevronRight } from 'lucide-react';

export const ShopDetailPage = () => {
  const { slug } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchShopBySlug(slug);
      setShop(data);
    } catch (_err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const schemaData = shop ? {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": shop.name,
    "image": shop.main_image_url,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": shop.address,
      "addressLocality": "Nashik",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": shop.latitude,
      "longitude": shop.longitude
    },
    "url": `https://nashikmisal.in/misal/${shop.slug}`,
    "telephone": shop.phone,
    "servesCuisine": ["Misal Pav", "Maharashtrian"],
    "priceRange": "₹₹",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": shop.avg_rating,
      "reviewCount": shop.total_reviews
    }
  } : null;

  if (loading) {
    return <BoilingCurryLoader message="Loading misal shop details & ratings..." />;
  }

  if (error || !shop) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Misal Shop Not Found</h2>
        <p className="text-xs text-slate-500">The shop you are looking for might have been moved or updated.</p>
        <Link to="/directory" className="bg-brand-600 text-white text-xs font-bold px-4 py-2 rounded-xl">
          Back to Misal Directory
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={shop.meta_title || `${shop.name} Nashik - Menu, Timings & Reviews`}
        description={shop.meta_description || `${shop.name} in ${shop.area}, Nashik. Check menu pricing, spicy level, wood stove details, and reviews.`}
        canonicalUrl={`https://nashikmisal.in/misal/${shop.slug}`}
        ogImage={shop.main_image_url}
      />
      
      {schemaData && <SchemaMarkup schemaData={schemaData} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
          <Link to="/" className="hover:text-brand-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/directory" className="hover:text-brand-600">Directory</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-bold truncate max-w-xs">{shop.name}</span>
        </nav>

        {/* Shop Header */}
        <ShopHeader
          shop={shop}
          onOpenReviewModal={() => setIsReviewModalOpen(true)}
          onOpenQueueModal={() => setIsQueueModalOpen(true)}
        />

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {shop.video_url && (
              <VideoReelsPlayer
                videoUrl={shop.video_url}
                thumbnailUrl={shop.video_thumbnail_url || shop.main_image_url}
                title={shop.name}
              />
            )}
            <ShopOverview shop={shop} />
            <ReviewSection
              reviews={shop.reviews}
              avgRating={shop.avg_rating}
              totalReviews={shop.total_reviews}
              onOpenReviewModal={() => setIsReviewModalOpen(true)}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <MapWidget shop={shop} />
            <AdSlot slotName="directory_sidebar" />
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewFormModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        shop={shop}
        onReviewSubmitted={loadData}
      />

      {/* Queue Check-in Modal */}
      <QueueCheckinModal
        isOpen={isQueueModalOpen}
        onClose={() => setIsQueueModalOpen(false)}
        shop={shop}
        onCheckinSuccess={loadData}
      />
    </>
  );
};

export default ShopDetailPage;
