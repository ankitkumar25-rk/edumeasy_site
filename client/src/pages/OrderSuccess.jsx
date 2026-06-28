import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, ShoppingBag, ArrowRight } from 'lucide-react';
import axiosInstance from '../api/axios.js';
import { API_ENDPOINTS } from '../api/endpoints.js';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.GET_BY_ID(id));
        setOrder(response.data.data || response.data);
      } catch (err) {
        setError('Could not locate order transaction records. If your card was charged, contact support.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold">{error || 'Order not found'}</div>
        <Link to="/" className="text-indigo-600 font-bold hover:underline">Return to Home</Link>
      </div>
    );
  }

  const isPaid = order.status === 'PAID';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="p-8 max-w-2xl mx-auto my-12"
    >
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-8 text-center space-y-6">
        {isPaid ? (
          <>
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
            <h1 className="text-3xl font-extrabold text-slate-900">Payment Successful!</h1>
            <p className="text-slate-600 max-w-md mx-auto">
              Thank you for your purchase. We have received your order and are preparing shipment to your school.
            </p>
          </>
        ) : (
          <>
            <Clock className="w-20 h-20 text-amber-500 mx-auto" />
            <h1 className="text-3xl font-extrabold text-slate-900">Payment Processing</h1>
            <p className="text-slate-600 max-w-md mx-auto">
              Your transaction is currently pending or processing. We will update your order status once verification completes.
            </p>
          </>
        )}

        <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-4 border border-slate-100">
          <h3 className="font-bold text-slate-900 border-b pb-2">Receipt details</h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <span className="text-slate-500">Order Ref ID</span>
            <span className="font-semibold text-slate-900 text-right truncate">{order.id}</span>

            <span className="text-slate-500">Razorpay Order ID</span>
            <span className="font-semibold text-slate-900 text-right truncate">{order.razorpayOrderId || 'N/A'}</span>

            <span className="text-slate-500">Buyer Name</span>
            <span className="font-semibold text-slate-900 text-right">{order.buyerName}</span>

            <span className="text-slate-500">Buyer Email</span>
            <span className="font-semibold text-slate-900 text-right">{order.buyerEmail}</span>

            <span className="text-slate-500">Total amount</span>
            <span className="font-bold text-slate-900 text-right">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>

            <span className="text-slate-500">Status</span>
            <span className={`font-bold text-right ${isPaid ? 'text-green-600' : 'text-amber-600'}`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            to="/mathkits"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-indigo-500/10 transition flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" /> Continue Shopping
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            Home <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSuccess;
