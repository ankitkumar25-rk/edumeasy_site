import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import axiosInstance from '../api/axios.js';
import { API_ENDPOINTS } from '../api/endpoints.js';

const Clients = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.GALLERY || '/api/gallery');
        setGalleryItems(response.data.data || response.data);
      } catch (err) {
        // Fallback to static mock testimonials
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const testimonials = galleryItems.filter((item) => item.type === 'TESTIMONIAL');

  const mockTestimonials = [
    {
      id: '1',
      title: 'Dr. Chinmay Pandya Ji (Pro VC of Devsanskriti Vishvavidyalaya)',
      textContent: 'As a struggling math student, I was hesitant to seek help, but the math lab is a game-changer for me. The lab offers a variety of resources, including lab equipment, Manuals (in Hindi & English), and support, which have helped me grasp difficult concepts and improve my problem-solving skills.',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXNRve7kwrH-SeOeDjVerHx3WTYix_s7hwxaTJ4TnPJe8ie-2KPgko2wGD8hJh__5gRhlzS1_ZyVN5Bv6ZtSVoRS8buKXPyrmlJ3Isqsk_zpHzr5yyxfkVab8R9gUB9UGKKX9geCGv0fanQ_Gah4i6Gptbn0RIh9T3o3ekMyKAsf0gUC08XWlYIfCfBiPAnaynYDH8lsp7u8Ki0pWT9Pw6Xc23PHrjHyVjKmFa3qKxd7w6lg3bitea_Xwdbrrhe9oqqPOBWAU5V7A',
    },
    {
      id: '2',
      title: 'Manisha Lashkari (Principal, Career Point World School - Jodhpur)',
      textContent: 'Teaching and learning Math is made practically easy, teachers are empowered and children are getting rid of their Math phobia. The real \'learning-by-doing\' approach is helping students understand the complexities and abstractness of Mathematics. Moreover the concern and support of the team \'EduMeasy\' is worth appreciating.',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGWszzzbww9Z1869CiUez_drH_MyLURMb16fEt8nySbkuTUJaJzHYkbD5Vt2P-E1TTRJ50QPCQXNhifIFin-O_PX7qaK1utb8PL52Oc5O8AteiEGfNW0ht3189dVAbO3sQa-4CsxyDGeBV7U5WEIPiR6xba4i428Ee9jfb5SwptqvZ0cDHCh2OkgCwgB1-_vIy0jHnZwun7lsEK5RO3gdc-_sU1BclwTbELuPMSl5AGDZ3qSJEfdM8yQV1MrUHT2LpNAfH9H_okx8',
    },
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : mockTestimonials;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-background text-on-background font-body"
    >
      <section className="bg-primary text-on-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 math-grid-bg"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white">Our Clients</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Trusted by schools, principals, and educational leaders across India.
          </p>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl font-display font-bold text-primary mb-12 text-center">Institutional Testimonials</h2>

        {loading ? (
          <div className="text-center text-sm font-mono text-on-surface-variant py-12">LOADING TESTIMONIALS...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {displayTestimonials.map((t) => (
              <div key={t.id} className="bg-white p-10 rounded-xl border border-outline-variant flex flex-col justify-between relative shadow-sm text-left">
                <Quote className="absolute top-4 right-4 text-indigo-50 w-12 h-12 -z-0" />
                <p className="text-sm italic text-on-surface mb-8 relative z-10 leading-relaxed text-slate-600">
                  "{t.textContent}"
                </p>
                <div className="flex items-center gap-4">
                  {t.url && (
                    <img className="w-12 h-12 rounded-full object-cover border border-outline-variant/40" src={t.url} alt={t.title} />
                  )}
                  <div>
                    <div className="font-display font-bold text-primary text-base">{t.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="py-20 bg-white border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-8">
          <h3 className="text-2xl font-display font-bold text-primary">Partnering Institutions</h3>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all">
            <img className="h-10 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCN1dhQA5MLuTtzG40KvQFbKvI_cfc4Cg9kw8oplPHYQhQUZ6Et2FNoA39ZOiGnqoYBHRcfaFHLQGNBWJozKm3ed3EWzdn8tYuPArDqz0MmhXwNgLfO-eB0xaAFAKB14yn8CGD7rX0reaEfTUoxqGTgJHQzDJSd4tT1xoAFbboI98QpWXEqyTmR-5FM6xr7UOKjI0mWZp5il66sym7lStwEux6rUqoUOq2T2Zyzn_uEVEXLO21XzMY1kIqk4Qz8mSPMCHy0Sw2ZQJM" alt="DPS Logo" />
            <img className="h-10 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIyJ2QMFVrcRrEG6Pkwpe3J4sqf5lh3OPnCT5ykNnPxq5bkT3D9pFfeHQDcYMQsEBAkQjbuiuY7J1ZY_qkMiruBIhavg0gcG9BMNZjxbdHdJGRRPwI1JdzAvnyjBszvuaDrpNltMk8JVG_u2tv8rwh4bteHk8m6cr-oy7gpxf36BWau5PM4HCDx71l3peezYXnsXNd4OAmXmYb4K6Ftyg_vY-8r65ttynoW0itLeCmWtVJ5G-5xZ7Wu-PcLJn2IEf0fHeWETLexR4" alt="Maa Bharti Logo" />
            <img className="h-10 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2hCyrnMGrlhkWUG1H1i7lKqumOGsMh78LVLvEXcpz_60waFXDqM85Ds0izslgJLp7bLeCYSW1E6z492TGQ9a63S3e90NrxntVAQ_m-nSLpvqovrmHgD2oAZf31G7DOk2Ih1zLqouesZJC_fDQfFjJJ0ruje31Rf7UNUjrU6AgTl4aKHF_JFC_Y3V3KFUlIIDBn3foukZoGOCEWbqL2n6nct2zPhh5g8TeXp38V7eEHyTnuvRG27n4e-uSLWc_pDHslxkO20XVE1I" alt="DAV Logo" />
            <img className="h-10 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCO2foWNE0TsI6d7bO7RzigXNhhfGRgA5rbSdCGD3VpW_P0cIOZejRd6N3HUxQeImsFGz_dZJ873DRoRQi-GYGkhpXUWhoyPsoXIrj8WgkJQL_3h0SwOfg4orq50fyc7zK9CTrWfypI2eDKc58IYSez_Wmz-WwJmPtp8ZpeVgkMs2L-Ik5mgCBTYjItNy168OESEhPjJbsur3l5pAPnmQ5prI_LO-3rY8wV99PFTJ4q_VYibJE5pSbXhcbZvf9hEma14cR7Pfjf Aug" alt="Sanskar Logo" />
            <img className="h-10 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDn6zhM-ADof59gHsL4JmWBY_erWy3pOyHRZbTRDqmarhMUJROY73niG6vXIogybOTVI2uXWAD51T4MFAqfcAS5pgMMzN2nH0ACRWYBt96wNeRAQV8By6RhwwvqUimGbkZpyreuRudZuuEXfBrtaNRQl72tKNlQguf7Wea0Pi-IxKe1E8iqbch8JrXAwggw9Cnq5DK0w4nwKLArzHmqBZNaUwOXr8T3efVeRFUZemv_eJRbIV0BHAP2nFYYhQi25xYSgfJnWTkg9R8" alt="Jack and Jill Logo" />
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Clients;
