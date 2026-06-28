import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import axiosInstance from '../api/axios.js';
import { API_ENDPOINTS } from '../api/endpoints.js';

const enquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  schoolName: z.string().optional(),
  city: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const Contact = () => {
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      schoolName: '',
      city: '',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setErrorMsg(null);
      await axiosInstance.post(API_ENDPOINTS.ENQUIRIES, data);
      setSuccess(true);
      reset();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 max-w-7xl mx-auto space-y-16"
    >
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Contact Us</h1>
        <p className="text-lg text-slate-600">Get in touch with our support team or request a laboratory quote.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-100 p-8 space-y-6 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900">Get in Touch</h3>
            <div className="flex items-center gap-4 text-slate-700">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Phone</p>
                <p className="font-semibold">+91-8824661216</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-700">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Email</p>
                <p className="font-semibold">contactus@edumeasy.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-700">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Office</p>
                <p className="font-semibold text-sm">IIT Jodhpur Campus, NH 62, Karwar, Jodhpur, Rajasthan 342037</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-200 rounded-2xl overflow-hidden shadow-sm h-64 border border-slate-100">
            <iframe
              className="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.4363297126135!2d77.36224161508249!3d28.61668878242417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce566275d3f27%3A0xe7a505bcfcae340e!2sSector%2062%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1672531193345!5m2!1sen!2sin"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
              title="Google Map Location"
            ></iframe>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Send an Enquiry</h3>

          {success ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h4 className="text-xl font-bold text-slate-900">Enquiry Submitted!</h4>
              <p className="text-slate-600 max-w-sm mx-auto">We have received your request. Our support desk will reach out to you shortly.</p>
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
              >
                Submit Another Enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{errorMsg}</div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  {...register('name')}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.name ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'
                  } focus:outline-none focus:ring-2`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    {...register('email')}
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      errors.email ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'
                    } focus:outline-none focus:ring-2`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'
                    } focus:outline-none focus:ring-2`}
                    placeholder="9876543210"
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">School Name (Optional)</label>
                  <input
                    type="text"
                    {...register('schoolName')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Delhi Public School"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">City (Optional)</label>
                  <input
                    type="text"
                    {...register('city')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Noida"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Message *</label>
                <textarea
                  rows="4"
                  {...register('message')}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.message ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'
                  } focus:outline-none focus:ring-2`}
                  placeholder="How can we help your school math curriculum?"
                ></textarea>
                {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-md hover:shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    <Send className="w-4 h-4" /> Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
