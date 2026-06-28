import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart, Loader2 } from 'lucide-react';
import axiosInstance from '../api/axios.js';
import { API_ENDPOINTS } from '../api/endpoints.js';

const MathKitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kit, setKit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const mockKits = [
    { id: 'kit_1', name: 'Fraction Kit 2D', price: 799, classLevel: '6', description: 'Explore fractional pieces, segment divisions, and percentages live.', photoUrls: ['https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg'] },
    { id: 'kit_2', name: 'Decimal Place Value Board', price: 950, classLevel: '6', description: 'Visual placement tool mapping fractions to decimal points.', photoUrls: ['https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-3.jpg'] },
    { id: 'kit_3', name: 'Integer Operations Slider', price: 499, classLevel: '7', description: 'Interactive slider rule for add/subtract operations on negative numbers.', photoUrls: ['https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-2.jpg'] },
    { id: 'kit_4', name: 'Properties of Parallel Lines Kit', price: 1100, classLevel: '8', description: 'Board with moving indicators to test corresponding and alternate angles.', photoUrls: ['https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg'] },
    { id: 'kit_5', name: '3D Polyhedron Construction Set', price: 1599, classLevel: '9', description: 'Plastic connectors and rods to construct vertices, edges, and faces of 3D shapes.', photoUrls: ['https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-3.jpg'] },
    { id: 'kit_6', name: 'Trigonometry Ratio Board', price: 1999, classLevel: '10', description: 'Rotatable wheel demonstrating sine, cosine, tangent values across unit circle quadrants.', photoUrls: ['https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-2.jpg'] },
  ];

  useEffect(() => {
    const fetchKit = async () => {
      try {
        const response = await axiosInstance.get(`${API_ENDPOINTS.MATHKITS}/${id}`);
        setKit(response.data.data || response.data);
      } catch (err) {
        const found = mockKits.find((k) => k.id === id);
        setKit(found || null);
      } finally {
        setLoading(false);
      }
    };
    fetchKit();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="animate-spin text-indigo-600 w-12 h-12" />
      </div>
    );
  }

  if (!kit) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Kit Not Found</h2>
        <p className="text-slate-600">The request resource is unavailable or has been deleted.</p>
      </div>
    );
  }

  const images = kit.photoUrls && kit.photoUrls.length > 0
    ? kit.photoUrls
    : [kit.photoUrl || 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample.jpg'];

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 max-w-6xl mx-auto my-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <div className="relative aspect-video sm:aspect-square bg-slate-50 rounded-2xl overflow-hidden group border border-slate-100">
          <img
            src={images[activeImageIndex]}
            alt={kit.name}
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-slate-800 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-slate-800 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        <div className="flex flex-col justify-between py-2">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="bg-indigo-50 text-indigo-600 text-xs font-extrabold px-3 py-1.5 rounded-full">
                Class {kit.classLevel || kit.class}
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{kit.name}</h1>
            </div>

            <div className="text-3xl font-black text-slate-900">
              ₹{Number(kit.price).toLocaleString('en-IN')}
            </div>

            <p className="text-slate-600 leading-relaxed text-sm">
              {kit.description || 'This handmade instructional kit contains high durability board interfaces, instructions, and worksheets configured specifically for standard curricula.'}
            </p>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <button
              onClick={() => navigate(`/checkout?kitId=${kit.id}&quantity=1`)}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <ShoppingCart className="w-5 h-5" /> Buy Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MathKitDetail;
