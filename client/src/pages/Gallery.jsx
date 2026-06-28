import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Play, Quote } from 'lucide-react';
import axiosInstance from '../api/axios.js';
import { API_ENDPOINTS } from '../api/endpoints.js';

const fallbackGalleryItems = [
  { id: 'f1', type: 'IMAGE', title: 'Activity Kit Workshop', url: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg' },
  { id: 'f2', type: 'VIDEO', title: 'Clinometer Demo', url: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-3.jpg' },
  { id: 'f3', type: 'TESTIMONIAL', title: 'Principal, DPS Noida', textContent: 'The geometry lab models have significantly improved student marks and interest levels.', author: 'Dr. S. Sharma' },
  { id: 'f4', type: 'IMAGE', title: 'Math Olympiad 2026', url: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-2.jpg' },
  { id: 'f5', type: 'VIDEO', title: 'Algebra Board Tutorial', url: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg' },
  { id: 'f6', type: 'TESTIMONIAL', title: 'Math Teacher, KV Sector 5', textContent: 'Hands-on geoboard sessions make explaining properties of triangles extremely simple.', author: 'Mrs. Ritu Sen' },
  { id: 'f7', type: 'IMAGE', title: 'Primary Lab Installation', url: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-3.jpg' },
  { id: 'f8', type: 'IMAGE', title: 'Student Kit Testing', url: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-2.jpg' },
  { id: 'f9', type: 'VIDEO', title: 'Olympiad Prize Ceremony', url: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg' },
  { id: 'f10', type: 'TESTIMONIAL', title: 'Parent, Grade 8 Student', textContent: 'My daughter used to dread algebra. The kits changed everything for her.', author: 'Mr. Alok Verma' },
];

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [visibleCount, setVisibleCount] = useState(6);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axiosInstance.get(`${API_ENDPOINTS.GALLERY}?limit=100`);
        if (res.data?.success && res.data.data.length > 0) {
          setGalleryItems(res.data.data);
        } else {
          setGalleryItems(fallbackGalleryItems);
        }
      } catch (err) {
        setGalleryItems(fallbackGalleryItems);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredItems = activeFilter === 'ALL'
    ? galleryItems
    : galleryItems.filter((item) => item.type === activeFilter);

  const displayedItems = filteredItems.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 max-w-7xl mx-auto font-body"
    >
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Media Gallery</h1>
        <p className="text-lg text-slate-600">Explore snapshots of school setups, workshop videos, and educator testimonials.</p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="bg-slate-100 p-1.5 rounded-xl flex space-x-1">
          {['ALL', 'IMAGE', 'VIDEO', 'TESTIMONIAL'].map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setVisibleCount(6);
              }}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                activeFilter === filter
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 mt-4 text-sm">Loading gallery...</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow p-2 flex flex-col"
            >
              {item.type === 'IMAGE' && (
                <div className="relative">
                  <img src={item.url} alt={item.title} className="w-full h-auto rounded-xl object-cover" />
                  <div className="absolute top-4 left-4 bg-primary/95 text-white p-2 rounded-lg backdrop-blur-sm">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                </div>
              )}

              {item.type === 'VIDEO' && (
                <div className="relative aspect-video bg-slate-900 flex items-center justify-center rounded-xl overflow-hidden group">
                  {/* YouTube link formatting support or fallback */}
                  {item.url.includes('youtube.com') || item.url.includes('youtu.be') ? (
                    <iframe
                      className="w-full h-full"
                      src={item.url.replace('watch?v=', 'embed/')}
                      title={item.title}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <>
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover opacity-60" />
                      <div className="absolute top-4 left-4 bg-primary/95 text-white p-2 rounded-lg backdrop-blur-sm">
                        <Play className="w-4 h-4" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-current" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {item.type === 'TESTIMONIAL' && (
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-150 relative text-left">
                  <Quote className="absolute top-4 right-4 text-slate-200 w-12 h-12 -z-0" />
                  <div className="relative z-10 space-y-4">
                    <p className="text-xs italic text-slate-600 leading-relaxed">
                      "{item.textContent || item.quote}"
                    </p>
                    <div className="flex items-center gap-3">
                      {item.url && (
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                      )}
                      <div>
                        <h5 className="font-bold text-slate-800 text-xs">{item.author || item.title.split('(')[0].trim()}</h5>
                        <p className="text-[10px] text-slate-500">
                          {item.title.includes('(') ? item.title.substring(item.title.indexOf('(') + 1, item.title.length - 1) : 'Educator'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {item.type !== 'TESTIMONIAL' && (
                <div className="p-4 text-left">
                  <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && filteredItems.length > displayedItems.length && (
        <div className="flex justify-center mt-16">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl transition duration-200 shadow-sm text-sm"
          >
            Load More Items
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Gallery;
