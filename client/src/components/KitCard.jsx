import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';

const KitCard = ({ kit }) => {
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = kit.photoUrls && kit.photoUrls.length > 0
    ? kit.photoUrls
    : [kit.photoUrl || 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample.jpg'];

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleBuyNow = () => {
    navigate(`/checkout?kitId=${kit.id}&quantity=1`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden group">
        <img
          src={images[activeImageIndex]}
          alt={kit.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white text-slate-800 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white text-slate-800 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    idx === activeImageIndex ? 'bg-indigo-600' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{kit.name}</h3>
          <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-full">
            Class {kit.classLevel || kit.class}
          </span>
        </div>
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-grow">{kit.description || kit.details}</p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <div className="text-xl font-extrabold text-slate-900">
            ₹{Number(kit.price).toLocaleString('en-IN')}
          </div>
          <button
            onClick={handleBuyNow}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default KitCard;
