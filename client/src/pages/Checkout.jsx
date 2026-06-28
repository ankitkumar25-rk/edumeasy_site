import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ShoppingBag, CreditCard, Loader2 } from 'lucide-react';
import axiosInstance from '../api/axios.js';
import { API_ENDPOINTS } from '../api/endpoints.js';

const checkoutFormSchema = z.object({
  buyerName: z.string().min(2, 'Name must be at least 2 characters'),
  buyerEmail: z.string().email('Please enter a valid email address'),
  buyerPhone: z.string().min(10, 'Phone must be at least 10 characters'),
  schoolName: z.string().min(1, 'School Name is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
});

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const kitId = searchParams.get('kitId');
  const quantity = parseInt(searchParams.get('quantity') || '1', 10);

  const [kit, setKit] = useState(null);
  const [loadingKit, setLoadingKit] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const mockKits = [
    { id: 'kit_1', name: 'Fraction Kit 2D', price: 799, classLevel: '6', description: 'Explore fractional pieces, segment divisions, and percentages live.', photoUrls: ['https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg'] },
    { id: 'kit_2', name: 'Decimal Place Value Board', price: 950, classLevel: '6', description: 'Visual placement tool mapping fractions to decimal points.', photoUrls: ['https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-3.jpg'] },
    { id: 'kit_3', name: 'Integer Operations Slider', price: 499, classLevel: '7', description: 'Interactive slider rule for add/subtract operations on negative numbers.', photoUrls: ['https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-2.jpg'] },
    { id: 'kit_4', name: 'Properties of Parallel Lines Kit', price: 1100, classLevel: '8', description: 'Board with moving indicators to test corresponding and alternate angles.', photoUrls: ['https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg'] },
    { id: 'kit_5', name: '3D Polyhedron Construction Set', price: 1599, classLevel: '9', description: 'Plastic connectors and rods to construct vertices, edges, and faces of 3D shapes.', photoUrls: ['https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-3.jpg'] },
    { id: 'kit_6', name: 'Trigonometry Ratio Board', price: 1999, classLevel: '10', description: 'Rotatable wheel demonstrating sine, cosine, tangent values across unit circle quadrants.', photoUrls: ['https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-2.jpg'] },
  ];

  useEffect(() => {
    const fetchKitDetails = async () => {
      if (!kitId) {
        setLoadingKit(false);
        return;
      }
      try {
        const response = await axiosInstance.get(`${API_ENDPOINTS.MATHKITS}/${kitId}`);
        setKit(response.data.data || response.data);
      } catch (err) {
        const found = mockKits.find((k) => k.id === kitId);
        if (found) setKit(found);
      } finally {
        setLoadingKit(false);
      }
    };
    fetchKitDetails();
  }, [kitId]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutFormSchema),
  });

  const onSubmit = async (formValues) => {
    try {
      setErrorMessage(null);
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setErrorMessage('Failed to load Razorpay payment client. Check your internet connection.');
        return;
      }

      const orderPayload = {
        buyerName: formValues.buyerName,
        buyerEmail: formValues.buyerEmail,
        buyerPhone: formValues.buyerPhone,
        schoolName: formValues.schoolName,
        city: formValues.city,
        state: formValues.state,
        items: [
          {
            kitId: kitId,
            quantity: quantity,
          },
        ],
      };

      const orderResponse = await axiosInstance.post(API_ENDPOINTS.ORDERS.CREATE, orderPayload);
      const { razorpayOrderId, amount, currency, key } = orderResponse.data.data;

      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: 'EduMEasy',
        description: `Purchase of ${kit ? kit.name : 'Math Activity Kit'}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            const verifyResponse = await axiosInstance.post(API_ENDPOINTS.ORDERS.VERIFY, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResponse.data.success) {
              navigate(`/order-success/${response.razorpay_order_id}`);
            }
          } catch (err) {
            setErrorMessage('Payment verification failed on server. Please reach customer support.');
          }
        },
        prefill: {
          name: formValues.buyerName,
          email: formValues.buyerEmail,
          contact: formValues.buyerPhone,
        },
        theme: {
          color: '#4f46e5',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to place order. Try again.');
    }
  };

  if (loadingKit) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="animate-spin text-indigo-600 w-12 h-12" />
      </div>
    );
  }

  if (!kitId || !kit) {
    return (
      <div className="p-8 max-w-md mx-auto text-center space-y-4">
        <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Your Checkout is Empty</h2>
        <p className="text-slate-600">Select a math activity kit from the store to proceed.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 max-w-7xl mx-auto space-y-8"
    >
      <h1 className="text-3xl font-extrabold text-slate-900">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-900 border-b pb-2">Shipping & Buyer Details</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMessage && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{errorMessage}</div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Buyer Name *</label>
              <input
                type="text"
                {...register('buyerName')}
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.buyerName ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'
                } focus:outline-none focus:ring-2`}
                placeholder="Jane Doe"
              />
              {errors.buyerName && <p className="text-xs text-red-500 mt-1">{errors.buyerName.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  {...register('buyerEmail')}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.buyerEmail ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'
                  } focus:outline-none focus:ring-2`}
                  placeholder="jane@example.com"
                />
                {errors.buyerEmail && <p className="text-xs text-red-500 mt-1">{errors.buyerEmail.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  {...register('buyerPhone')}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.buyerPhone ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'
                  } focus:outline-none focus:ring-2`}
                  placeholder="9876543210"
                />
                {errors.buyerPhone && <p className="text-xs text-red-500 mt-1">{errors.buyerPhone.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">School Name *</label>
              <input
                type="text"
                {...register('schoolName')}
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.schoolName ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'
                } focus:outline-none focus:ring-2`}
                placeholder="Central Academy School"
              />
              {errors.schoolName && <p className="text-xs text-red-500 mt-1">{errors.schoolName.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  {...register('city')}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.city ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'
                  } focus:outline-none focus:ring-2`}
                  placeholder="Noida"
                />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">State *</label>
                <input
                  type="text"
                  {...register('state')}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.state ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'
                  } focus:outline-none focus:ring-2`}
                  placeholder="Uttar Pradesh"
                />
                {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-md hover:shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 mt-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" /> Initiating Gateway...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" /> Proceed to Payment
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-8 space-y-6 h-fit">
          <h3 className="text-xl font-bold text-slate-900 border-b pb-2">Order Summary</h3>

          <div className="flex gap-4">
            <img
              src={kit.photoUrls?.[0] || kit.photoUrl || 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample.jpg'}
              alt={kit.name}
              className="w-20 h-20 object-cover rounded-xl border border-slate-100 flex-shrink-0"
            />
            <div>
              <h4 className="font-bold text-slate-900 text-sm leading-snug">{kit.name}</h4>
              <p className="text-xs text-slate-500">Qty: {quantity}</p>
              <p className="text-xs text-indigo-600 font-semibold mt-1">Class {kit.classLevel || kit.class}</p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Items Total</span>
              <span>₹{(Number(kit.price) * quantity).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-slate-900 text-lg">
              <span>Total amount</span>
              <span>₹{(Number(kit.price) * quantity).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
