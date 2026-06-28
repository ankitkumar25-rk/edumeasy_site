import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit,
  LineChart,
  BookOpen,
  PhoneCall,
  ArrowRight,
  Play,
  Quote,
  CheckCircle,
  Users,
  Laptop,
  Trophy,
  Bell,
  MessageCircle,
  Mail,
  MapPin,
} from 'lucide-react';
import axiosInstance from '../api/axios.js';
import { API_ENDPOINTS } from '../api/endpoints.js';

// Custom font helper for premium sans-serif typography mapping
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=Inter:wght@400;500;600;700&display=swap');
    .font-display {
      font-family: 'Hanken Grotesk', system-ui, -apple-system, sans-serif;
    }
    .font-body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
  `}</style>
);

const quoteFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  schoolName: z.string().min(1, 'School name is required'),
  message: z.string().min(10, 'Question must be at least 10 characters'),
});

const fallbackTestimonials = [
  {
    id: 'f1',
    title: 'Dr. Chinmay Pandya Ji (Pro VC of Devsanskriti Vishvavidyalaya)',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXNRve7kwrH-SeOeDjVerHx3WTYix_s7hwxaTJ4TnPJe8ie-2KPgko2wGD8hJh__5gRhlzS1_ZyVN5Bv6ZtSVoRS8buKXPyrmlJ3Isqsk_zpHzr5yyxfkVab8R9gUB9UGKKX9geCGv0fanQ_Gah4i6Gptbn0RIh9T3o3ekMyKAsf0gUC08XWlYIfCfBiPAnaynYDH8lsp7u8Ki0pWT9Pw6Xc23PHrjHyVjKmFa3qKxd7w6lg3bitea_Xwdbrrhe9oqqPOBWAU5V7A',
    textContent: 'As a struggling math student, I was hesitant to seek help, but the math lab is a game-changer for me. The lab offers a variety of resources, including lab equipment, Manuals (in Hindi & English), and support, which have helped me grasp difficult concepts and improve my problem-solving skills.',
  },
  {
    id: 'f2',
    title: 'Manisha Lashkari (Principal, Career Point World School - Jodhpur)',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGWszzzbww9Z1869CiUez_drH_MyLURMb16fEt8nySbkuTUJaJzHYkbD5Vt2P-E1TTRJ50QPCQXNhifIFin-O_PX7qaK1utb8PL52Oc5O8AteiEGfNW0ht3189dVAbO3sQa-4CsxyDGeBV7U5WEIPiR6xba4i428Ee9jfb5SwptqvZ0cDHCh2OkgCwgB1-_vIy0jHnZwun7lsEK5RO3gdc-_sU1BclwTbELuPMSl5AGDZ3qSJEfdM8yQV1MrUHT2LpNAfH9H_okx8',
    textContent: "Teaching and learning Math is made practically easy, teachers are empowered and children are getting rid of their Math phobia. The real 'learning-by-doing' approach is helping students understand the complexities and abstractness of Mathematics. Moreover the concern and support of the team 'EduMeasy' is worth appreciating.",
  },
  {
    id: 'f3',
    title: 'Nitin Bhargav (HOD, Tagore International School)',
    url: 'https://edumeasy.com/wp-content/uploads/2023/02/Nitin-Bhargavv-EduMEasy-math-lab-for-school.png',
    textContent: 'Here is what he feels about the Math Lab - I am thrilled to see this type of equipment which is expected from IITians only and will help students to learn math in a better and joyful manner.',
  },
  {
    id: 'f4',
    title: 'Aurobindo (Centre of New Education)',
    url: 'https://edumeasy.com/wp-content/uploads/2023/03/Aurobindo-EduMEasy-math-lab-for-school.png',
    textContent: 'We strongly feel these equipment will bring revolution in the field of Mathematics from 6th -10 th class. It helps to visualise a concept of mathematics by understanding the concepts and also makes learning a very very fun field.',
  },
  {
    id: 'f5',
    title: 'Jagriti Arora (Faculty of Mathematics, Kudos International School - Bundi)',
    url: 'https://edumeasy.com/wp-content/uploads/2023/03/Jagriti-Arora-EduMEasy-math-lab-for-school.png',
    textContent: 'Here is what she expressed about the Math Lab - These equipments are going to make my job easy and more result Oriented and students are going to love these equipment so they will be able to understand math easily. Last but not the least the equipment is very useful and colourful too. Concepts and colours both matter.',
  },
  {
    id: 'f6',
    title: 'Tilkesh Bhatiya (Director, SSIS International School - Nathdwara)',
    url: 'https://edumeasy.com/wp-content/uploads/2023/02/Tilkesh-Bhatiya-EduMEasy-math-lab-for-school.png',
    textContent: 'Almost 50% of students are afraid of maths. Math is the most scoring subject in competitive exam like JEE. But better score can only be secured with the help of best faculty which is practically not possible in most of the cases. These 7 equipment will act as a faculty for math to help students score better and understand deep concepts in easy manner.',
  },
];

const videoReviews = [
  {
    name: 'Dr. Kirankumar R. Hiremath',
    role: 'Associate Professor - IIT Jodhpur',
    embedUrl: 'https://www.youtube.com/embed/ReTjUm6EE34',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    quote: "EduMEasy's hands-on math lab tools have fundamentally transformed how students grasp abstract algebraic and geometric concepts. It provides a visual intuition that textbooks alone cannot achieve.",
    impact: [
      "Bridged theoretical understanding with practical application.",
      "Boosted spatial skills and structural reasoning.",
      "Aligned teaching methods with modern research standardizations."
    ],
    about: "Dr. Kirankumar R. Hiremath shares his academic perspective on the role of tactile lab kits in simplifying complex high-school mathematics and geometric proofs."
  },
  {
    name: 'Mrs. Arpita Singh',
    role: 'Sunbeam School, Ballia, Uttar Pradesh',
    embedUrl: 'https://www.youtube.com/embed/sjue8L8CVic',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    quote: "Our students are excited for math lab sessions. The kits make learning geometry and trigonometry intuitive. It's a wonderful addition to the curriculum.",
    impact: [
      "Achieved high student classroom participation.",
      "Improved performance in term exams for abstract topics.",
      "Provided teachers with highly effective, ready-to-use props."
    ],
    about: "Mrs. Arpita Singh discusses how integrating a math lab at Sunbeam School created an interactive learning environment that students look forward to."
  },
  {
    name: 'Nitin Bhargav Ji',
    role: 'HOD, Tagore International School',
    embedUrl: 'https://www.youtube.com/embed/M_mwjA80t4Q',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    quote: "The quality of the equipment and the structured lab manual are top-notch. It makes teaching easy and keeps the classroom highly interactive.",
    impact: [
      "Promoted active peer-to-peer learning.",
      "Standardized lab setups matching national curricula.",
      "Reduced lesson preparation time for mathematics teachers."
    ],
    about: "Nitin Bhargav Ji explains the organizational benefits of setting up a structured mathematics lab to align with active learning school boards."
  },
  {
    name: 'Dr. Pradeep Kumawat Ji',
    role: 'Udaipur',
    embedUrl: 'https://www.youtube.com/embed/PAiKj45sSc8',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    quote: "A math lab is essential for every progressive school. EduMEasy has designed perfect modular tools that cater to students across all grade levels.",
    impact: [
      "Enhanced school ranking and institutional prestige.",
      "Cultivated critical thinking and analytical frameworks.",
      "Broke mathematical anxiety in early stage learners."
    ],
    about: "Dr. Pradeep Kumawat Ji emphasizes the societal and psychological benefits of making math lab models standard practice in schools."
  },
  {
    name: 'Mr. Tilkesh Bhatiya',
    role: 'Director, SSIS International School',
    embedUrl: 'https://www.youtube.com/embed/oMjuo24OMqM',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    quote: "The response from parents and students has been overwhelming. The concrete models make abstract calculations clear and understandable.",
    impact: [
      "Strengthened institutional parent-teacher trust.",
      "Cemented arithmetic fundamentals at the middle school tier.",
      "Sparked curiosity through mechanical-mathematical links."
    ],
    about: "Mr. Tilkesh Bhatiya highlights the parent community's appreciation of tactile kits, reinforcing mathematical concepts outside the text page."
  },
];

const clientLogos = [
  'https://edumeasy.com/wp-content/uploads/2023/02/edumeasy-math-lab-school-logo-1.png',
  'https://edumeasy.com/wp-content/uploads/2023/02/edumeasy-math-lab-school-logo-2.png',
  'https://edumeasy.com/wp-content/uploads/2023/02/edumeasy-math-lab-school-logo-3.png',
  'https://edumeasy.com/wp-content/uploads/2023/02/edumeasy-math-lab-school-logo-4.png',
  'https://edumeasy.com/wp-content/uploads/2023/02/edumeasy-math-lab-school-logo-5.png',
  'https://edumeasy.com/wp-content/uploads/2023/02/edumeasy-math-lab-school-logo-6.png',
  'https://edumeasy.com/wp-content/uploads/2023/02/edumeasy-math-lab-school-logo-7.png',
  'https://edumeasy.com/wp-content/uploads/2023/02/edumeasy-math-lab-school-logo-8.png',
  'https://edumeasy.com/wp-content/uploads/2023/02/edumeasy-math-lab-school-logo-9.png',
];

const FloatingSymbols = () => {
  const symbols = [
    { char: 'π', top: '15%', left: '10%', delay: 0, size: 'text-3xl' },
    { char: '√', top: '25%', left: '80%', delay: 1, size: 'text-4xl' },
    { char: '∑', top: '70%', left: '15%', delay: 2, size: 'text-3xl' },
    { char: '∫', top: '65%', left: '75%', delay: 1.5, size: 'text-5xl' },
    { char: 'x²', top: '45%', left: '90%', delay: 0.5, size: 'text-2xl' },
    { char: '∞', top: '80%', left: '50%', delay: 2.5, size: 'text-4xl' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-25 opacity-20">
      {symbols.map((sym, idx) => (
        <motion.div
          key={idx}
          className={`absolute text-white font-mono font-bold select-none ${sym.size}`}
          style={{ top: sym.top, left: sym.left }}
          animate={{
            y: [0, -25, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0.15, 0.45, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: sym.delay,
            ease: "easeInOut"
          }}
        >
          {sym.char}
        </motion.div>
      ))}
    </div>
  );
};

const CounterCard = ({ value, label }) => {
  const [count, setCount] = useState("0");
  const [hasStarted, setHasStarted] = useState(false);

  const startCounter = () => {
    if (hasStarted) return;
    setHasStarted(true);

    const numericMatch = value.toString().match(/(\d+)/);
    if (!numericMatch) {
      setCount(value);
      return;
    }
    const target = parseInt(numericMatch[1], 10);
    const suffix = value.toString().replace(/\d+/g, '');

    let current = 0;
    const steps = 40;
    const stepVal = Math.max(Math.ceil(target / steps), 1);
    const timer = setInterval(() => {
      current += stepVal;
      if (current >= target) {
        clearInterval(timer);
        setCount(target + suffix);
      } else {
        setCount(current + suffix);
      }
    }, 25);
  };

  return (
    <motion.div
      onViewportEnter={startCounter}
      viewport={{ once: true, amount: 0.3 }}
      className="p-5 bg-white/5 border border-white/10 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:border-white/30"
    >
      <div className="text-3xl font-display font-extrabold text-white">{count}</div>
      <div className="text-[11px] font-semibold opacity-50 uppercase tracking-wider mt-1">{label}</div>
    </motion.div>
  );
};

const RevealText = ({ text }) => {
  const words = text.split(" ");
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 * i },
    }),
  };
  
  const childVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 120,
      },
    },
    hidden: {
      opacity: 0,
      y: 15,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 120,
      },
    },
  };

  return (
    <motion.h1
      className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-tight tracking-tight text-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => {
        if (word === "mathAI" || word === "2026") {
          return (
            <motion.span
              key={index}
              variants={childVariants}
              className="inline-block text-secondary mr-3"
            >
              {word}
            </motion.span>
          );
        }
        return (
          <motion.span
            key={index}
            variants={childVariants}
            className="inline-block mr-3"
          >
            {word}
          </motion.span>
        );
      })}
    </motion.h1>
  );
};

const DecryptedText = ({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  animateOn = 'hover',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

  const triggerAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    let iterations = 0;
    const textArray = text.split('');
    const len = textArray.length;

    const interval = setInterval(() => {
      iterations++;
      
      const nextText = textArray.map((char, index) => {
        if (char === ' ') return ' ';
        
        const threshold = sequential
          ? Math.floor((iterations / maxIterations) * len)
          : maxIterations;

        const isDecrypted = sequential
          ? index < threshold
          : iterations >= maxIterations;

        if (isDecrypted) {
          return char;
        }

        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');

      setDisplayText(nextText);

      if (iterations >= maxIterations * (sequential ? 1.5 : 1)) {
        clearInterval(interval);
        setDisplayText(text);
        setIsAnimating(false);
      }
    }, speed);
  };

  useEffect(() => {
    if (animateOn === 'auto' || animateOn === 'view') {
      triggerAnimation();
    }
  }, []);

  return (
    <span
      className={parentClassName}
      onMouseEnter={animateOn === 'hover' ? triggerAnimation : undefined}
    >
      {displayText.split('').map((char, index) => {
        const isOriginal = char === text[index];
        return (
          <span
            key={index}
            className={isOriginal ? className : encryptedClassName || 'text-secondary font-mono font-bold'}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};

const LabDetailModal = ({ isOpen, onClose, labType }) => {
  const primaryLabTools = [
    { name: "Abacus Kit", desc: "For foundational understanding of numbers and place values." },
    { name: "Fraction Blocks", desc: "Tactile fraction wheels to make division and sharing easy." },
    { name: "Geoboard", desc: "Explore perimeter, area, and coordinates using elastic bands." },
    { name: "3D Mensuration Solids", desc: "Prisms, pyramids, and cylinders to grasp volume relationships." },
    { name: "Number Line Track", desc: "Interactive physical scale for integer operations." },
  ];

  const advancedLabTools = [
    { name: "Coordinate Geometry Board", desc: "Trace linear equations and quadratic functions dynamically." },
    { name: "Trigonometric Circle", desc: "Visual unit circle showing sine, cosine, and tangent relationships." },
    { name: "Algebraic Identity Kit", desc: "Proof of identities like (a+b)² and (a+b)³ using wooden cubes." },
    { name: "Clinometer", desc: "Handheld instrument for measuring heights and distances visually." },
    { name: "Probability Spinners", desc: "Simulate random probability trials and relative frequency." },
  ];

  const tools = labType === 'primary' ? primaryLabTools : advancedLabTools;
  const title = labType === 'primary' ? "Primary Math Lab Equipment" : "Advanced Math Lab Equipment";
  const desc = labType === 'primary' ? "Interactive activity kits designed for classes 1-6 to transition from abstract calculations to tactile logic." : "Rigorous experiments designed for classes 7-10 covering advanced equations, coordinate systems, and AI modules.";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative z-10 border border-slate-100"
          >
            <div className="p-8 text-left space-y-6">
              <div>
                <span className="text-[10px] tracking-widest font-bold uppercase bg-secondary px-2.5 py-1 rounded text-white mb-2 inline-block">
                  {labType === 'primary' ? "Classes 1-6" : "Classes 7-10"}
                </span>
                <h3 className="text-2xl font-display font-extrabold text-primary">{title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{desc}</p>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                {tools.map((tool, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-primary">{tool.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{tool.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 text-xs font-bold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                >
                  Close Window
                </button>
                <Link
                  to="/contact"
                  className="flex-1 py-3 text-xs font-bold text-white bg-primary rounded-xl text-center hover:opacity-90 transition"
                >
                  Request Quote
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Home = () => {
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [testimonials, setTestimonials] = useState([]);

  // Sourced legacy images with actual schools showing practical activities
  const heroSlides = [
    'https://edumeasy.com/wp-content/uploads/2023/04/hero-slide-1.jpg',
    'https://edumeasy.com/wp-content/uploads/2023/04/hero-slide-2.jpg',
    'https://edumeasy.com/wp-content/uploads/2023/04/hero-slide-3.jpg',
    'https://edumeasy.com/wp-content/uploads/2023/04/hero-slide-4.jpg',
    'https://edumeasy.com/wp-content/uploads/2023/04/hero-slide-5.jpg',
  ];

  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLabType, setSelectedLabType] = useState('primary');
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [activeVideoTab, setActiveVideoTab] = useState('overview');

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axiosInstance.get(`${API_ENDPOINTS.GALLERY}?category=TESTIMONIAL&limit=20`);
        if (res.data?.success && res.data.data.length > 0) {
          setTestimonials(res.data.data);
        } else {
          setTestimonials(fallbackTestimonials);
        }
      } catch (err) {
        setTestimonials(fallbackTestimonials);
      }
    };
    fetchTestimonials();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      schoolName: '',
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
      setErrorMsg(err.response?.data?.message || 'Failed to submit request. Please try again.');
    }
  };

  const equipments = [
    {
      title: 'ALGEBRA ANNOTATOR',
      desc: 'The biggest challenge in learning algebra is understanding the operations such as addition & subtraction.',
      isDark: true,
    },
    {
      title: 'NUMBER SYSTEM',
      desc: 'A positive or a negative outcome is always a problem in using operations between numbers is Number Operator.',
      isDark: false,
    },
    {
      title: 'FRACTIONS TESTER',
      desc: 'How is whole divided into fractions? How different fractions are combined to get whole?',
      isDark: true,
    },
    {
      title: 'EQUATION SOLVER',
      desc: 'Are two linear equations always solvable? If they are, is the solution unique? This will solve by Equation Solver.',
      isDark: false,
    },
    {
      title: 'MULTIPLICATOR',
      desc: 'An innovative tool that simplifies multiplication and introduces positive and negative numbers through hands-on, learning experiences.',
      isDark: true,
    },
    {
      title: 'SHAPE DISCRIMINATOR',
      desc: 'A hands-on tool to explore geometric figures, fractions, and their operations, making them interactive and engaging.',
      isDark: false,
    },
    {
      title: 'TIME AND ANGLE TRACKER',
      desc: 'A versatile tool that simplifies time, angles, and their properties through hands-on exploration and visual learning aids.',
      isDark: true,
    },
    {
      title: 'DECIMAL OPERATOR',
      desc: 'An interactive toolkit to master decimal place values, solve problems, and perform measurements',
      isDark: false,
    },
    {
      title: 'PATTERN FINDER',
      desc: 'A fun tool to explore patterns, solve matching problems, and boost critical thinking, making math exciting and creativity-driven for young learners.',
      isDark: true,
    },
    {
      title: 'MENSURATOR',
      desc: 'A versatile tool for exploring perimeter, area, inequalities, division, multiplication, factors, HCF, and LCM, enhancing problem-solving skills.',
      isDark: false,
    },
    {
      title: 'NUMBER INTERACTOR',
      desc: 'An interactive tool for mastering addition, subtraction, and inequalities, making foundational arithmetic fun and hands-on.',
      isDark: true,
    },
    {
      title: 'NUMBER TWISTOR',
      desc: 'An interactive tool to explore even, odd, prime numbers, and divisors, making fundamental number concepts engaging and easy to understand.',
      isDark: false,
    },
  ];

  const manuals = [
    {
      classNumber: '7',
      language: 'हिंदी माध्यम',
      img: '/labs/Math-Manual-for-Class-7-in-Hindi_11zon.webp',
      theme: 'border-orange-500 bg-orange-50/10',
    },
    {
      classNumber: '8',
      language: 'English Medium',
      img: '/labs/Math-Manual-for-Class-8-in-English_11zon.webp',
      theme: 'border-blue-500 bg-blue-50/10',
    },
    {
      classNumber: '8',
      language: 'हिंदी माध्यम',
      img: '/labs/Math-Manual-for-Class-8-in-Hindi_11zon.webp',
      theme: 'border-indigo-600 bg-indigo-50/10',
    },
    {
      classNumber: '9',
      language: 'English Medium',
      img: '/labs/6classmanual.webp',
      theme: 'border-rose-500 bg-rose-50/10',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#f8fafc] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] text-slate-800 font-body relative overflow-x-hidden min-h-screen"
    >
      <FontStyles />

      {/* Background Gradient Blobs */}
      <div className="absolute top-[10%] left-[-25%] w-[700px] h-[700px] bg-primary/5 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="absolute top-[40%] right-[-25%] w-[750px] h-[750px] bg-secondary/5 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="absolute top-[70%] left-[-25%] w-[700px] h-[700px] bg-primary/5 rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* Floating Action Buttons - Placed on Right to Prevent Text & Stat Overlap */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <button
          onClick={() => setShowNotification(!showNotification)}
          className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all relative"
        >
          <Bell className="w-5 h-5 animate-pulse" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-secondary border-2 border-primary rounded-full"></span>
        </button>

        <a
          href="https://wa.me/918824661216"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-600 hover:scale-110 active:scale-95 transition-all"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
        </a>

        {showNotification && (
          <div className="absolute right-16 bottom-16 bg-white border border-primary/12 p-5 rounded-2xl shadow-xl w-72 text-left animate-in fade-in slide-in-from-bottom-4 duration-300 z-50">
            <h4 className="text-xs font-semibold text-primary mb-1 tracking-wider uppercase">mathAI 2026 Olympiad</h4>
            <p className="text-xs text-slate-600 mb-3">National Level Registrations are currently open for all classes 6-10.</p>
            <Link
              to="/mathai"
              onClick={() => setShowNotification(false)}
              className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1"
            >
              Register Now <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>

      {/* Hero Banner Section (Full Viewport Crossfade Slider) */}
      <section className="relative overflow-hidden w-full h-[650px] lg:h-[750px] bg-primary-container group/slider">
        {/* Background Slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeHeroSlide}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1.03 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${heroSlides[activeHeroSlide]}')` }}
          />
        </AnimatePresence>

        {/* strict design token gradient overlay */}
        <div
          className="absolute inset-0 z-20"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 21, 43, 0.90), rgba(10, 37, 64, 0.75), rgba(6, 21, 43, 0.85))',
          }}
        ></div>

        {/* Floating animated math symbols */}
        <FloatingSymbols />

        {/* Centered Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 lg:px-8 z-30">
          <div className="max-w-4xl space-y-6">
            {/* Glowing pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-semibold text-white tracking-wider uppercase mb-2 animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></span>
              <DecryptedText text="10,000+ Active Registrations" animateOn="view" speed={40} maxIterations={12} className="text-white" />
            </div>

            <RevealText text="Master the Future of Math at mathAI 2026" />

            <p className="text-sm sm:text-lg lg:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed text-slate-200">
              Join India's premier national online math competition. Designed for Classes 6–10 to test logic, mathematical aptitude, and AI-driven problem-solving.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                to="/mathai"
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-9 py-4 rounded-xl font-body text-sm font-bold shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Apply Now <ArrowRight className="w-4 h-4 text-white" />
              </Link>
              <a
                href="#demo-section"
                className="inline-flex items-center gap-2 border border-white/40 hover:border-white text-white px-9 py-4 rounded-xl font-body text-sm font-bold hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Watch Demo
              </a>
            </div>
          </div>
        </div>

        {/* Edge-to-Edge Navigation Arrows */}
        <button
          onClick={() => setActiveHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 hover:bg-secondary hover:scale-110 active:scale-95 transition-all text-xl"
        >
          &#10094;
        </button>
        <button
          onClick={() => setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 hover:bg-secondary hover:scale-110 active:scale-95 transition-all text-xl"
        >
          &#10095;
        </button>

        {/* Navigation Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-2.5">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveHeroSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === activeHeroSlide ? 'bg-secondary w-7' : 'bg-white/40 hover:bg-white/85'
              }`}
            ></button>
          ))}
        </div>
      </section>

      {/* Explore Our Math Labs Section */}
      <section className="py-24 bg-background">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/12 text-[12px] font-bold tracking-wider text-primary mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            MATH LABS
          </div>
          <h2 className="text-4xl font-display font-extrabold text-primary mb-4">Explore Our Learning Labs</h2>
          <p className="text-base sm:text-lg text-[#64748b] max-w-3xl mx-auto leading-relaxed">
            Explore how our Math Labs transform learning with hands-on tools, engaging both foundational and advanced learners intuitively and effectively.
          </p>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-8 mb-16">
          {/* Primary Lab Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="group bg-white/80 backdrop-blur-md rounded-[20px] border border-primary/12 hover:border-blue-300 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Card Header Gradient */}
            <div className="bg-gradient-to-br from-primary to-primary/80 p-8 text-left text-white relative overflow-hidden">
              <div className="absolute right-6 top-6 opacity-10">
                <Laptop className="w-20 h-20 stroke-white" />
              </div>
              <span className="text-[10px] tracking-widest font-bold uppercase bg-secondary px-2.5 py-1 rounded text-white mb-3 inline-block">
                PRIMARY LEVEL
              </span>
              <h3 className="text-2xl font-display font-bold">Primary Math Lab</h3>
              <p className="text-xs opacity-75 mt-1">Classes 1–6</p>
            </div>
            {/* Features below header */}
            <div className="p-8 space-y-6 bg-white/90 backdrop-blur-sm flex-grow flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex gap-4 items-start text-left">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <Users className="stroke-primary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-primary">Thought Provoking Experiments</h4>
                    <p className="text-xs text-[#64748b] mt-0.5">Hands-on activities replace rote memorization with conceptual understanding.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start text-left">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <Laptop className="stroke-primary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-primary">Concept in Real-Time</h4>
                    <p className="text-xs text-[#64748b] mt-0.5">Encourages critical thinking and interactive problem-solving in class.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start text-left">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <Trophy className="stroke-primary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-primary">Abstract to Concrete</h4>
                    <p className="text-xs text-[#64748b] mt-0.5">Structured manuals translate complex calculations into tactile models.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => {
                    setSelectedLabType('primary');
                    setIsModalOpen(true);
                  }}
                  className="w-full inline-block bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-body font-bold text-center hover:shadow-lg active:scale-95 transition-all text-xs tracking-wider cursor-pointer"
                >
                  EXPLORE PRIMARY LAB
                </button>
              </div>
            </div>
          </motion.div>

          {/* Advanced Lab Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group bg-white/80 backdrop-blur-md rounded-[20px] border border-primary/12 hover:border-blue-300 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Card Header Gradient */}
            <div className="bg-gradient-to-br from-primary to-primary-container p-8 text-left text-white relative overflow-hidden">
              <div className="absolute right-6 top-6 opacity-10">
                <BrainCircuit className="w-20 h-20 stroke-white" />
              </div>
              <span className="text-[10px] tracking-widest font-bold uppercase bg-secondary px-2.5 py-1 rounded text-white mb-3 inline-block">
                ADVANCED LEVEL
              </span>
              <h3 className="text-2xl font-display font-bold">Advanced Math Lab</h3>
              <p className="text-xs opacity-75 mt-1">Classes 7–10</p>
            </div>
            {/* Features below header */}
            <div className="p-8 space-y-6 bg-white/90 backdrop-blur-sm flex-grow flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex gap-4 items-start text-left">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <BrainCircuit className="stroke-secondary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-primary">Algebra & Geometry Tools</h4>
                    <p className="text-xs text-[#64748b] mt-0.5">Explore algebraic models, coordinate geometry, and trigonometry visually.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start text-left">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <LineChart className="stroke-secondary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-primary">Data & Statistics Kits</h4>
                    <p className="text-xs text-[#64748b] mt-0.5">Collect real statistics and trace coordinate layouts dynamically.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start text-left">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <Laptop className="stroke-secondary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-primary">AI-Enhanced Practice</h4>
                    <p className="text-xs text-[#64748b] mt-0.5">Leverage advanced logic simulators to master logical formulations.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => {
                    setSelectedLabType('advanced');
                    setIsModalOpen(true);
                  }}
                  className="w-full inline-block bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-body font-bold text-center hover:shadow-lg active:scale-95 transition-all text-xs tracking-wider cursor-pointer"
                >
                  EXPLORE ADVANCED LAB
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Equipments Section */}
      <section className="py-24 bg-[#ffffff]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/12 text-[12px] font-bold tracking-wider text-primary mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            MODULAR LAB EQUIPMENT
          </div>
          <h2 className="text-4xl font-display font-extrabold text-primary mb-4">Modular Lab Equipment & Class Manuals</h2>
          <p className="text-base sm:text-lg text-[#64748b] max-w-3xl mx-auto leading-relaxed">
            Not just geometry or mensuration—now we've created math lab equipment for algebra, number systems, trigonometry, and every school-level math topic.
          </p>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {equipments.map((eq, index) => {
            const isDark = eq.isDark;
            return (
              <div
                key={index}
                className={`p-8 rounded-[20px] shadow-sm flex flex-col justify-between border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  isDark
                    ? 'bg-gradient-to-br from-primary to-primary-container text-white border-transparent'
                    : 'bg-white/80 backdrop-blur-md text-slate-800 border-primary/12 hover:border-blue-200'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-primary/10'}`}>
                      <BrainCircuit className={`w-5 h-5 ${isDark ? 'stroke-secondary' : 'stroke-primary'}`} />
                    </div>
                    <span className={`text-[10px] font-semibold tracking-widest uppercase ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                      EQUIPMENT
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg mb-3 tracking-wide">{eq.title}</h3>
                  <p className={`text-xs leading-relaxed mb-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {eq.desc}
                  </p>
                </div>
                <Link
                  to="/mathlabs"
                  className={`py-2.5 px-4 rounded-xl text-center font-body text-[11px] font-bold tracking-widest border transition-all duration-300 ${
                    isDark
                      ? 'border-white/30 text-white hover:bg-white hover:text-primary hover:border-white'
                      : 'border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary'
                  }`}
                >
                  READ MORE
                </Link>
              </div>
            );
          })}
        </div>

        {/* Lab Manuals Subsection */}
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 border-t border-slate-100 pt-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/12 text-[12px] font-bold tracking-wider text-primary mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              CLASS MANUALS
            </div>
            <h3 className="text-3xl font-display font-extrabold text-primary">Class Math Manuals</h3>
            <p className="text-sm text-[#64748b] max-w-xl mx-auto mt-2">
              Complete Guides for Teachers & Students about Math Lab Activities, Chapter wise as per CBSE syllabus.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {manuals.map((manual, idx) => (
              <div
                key={idx}
                className="group flex flex-col items-center cursor-pointer p-6 rounded-2xl bg-white border border-primary/8 hover:bg-primary hover:border-transparent transition-all duration-500 hover:-translate-y-2.5 hover:shadow-2xl"
              >
                <div className={`relative rounded-xl border p-2 ${manual.theme} shadow-sm group-hover:border-white/20 transition-all duration-300 aspect-[3/4] flex items-center justify-center overflow-hidden w-full max-w-[180px]`}>
                  <img
                     className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-500"
                     src={manual.img}
                     alt={`Math Manual Class ${manual.classNumber}`}
                  />
                </div>
                <div className="mt-4 text-center">
                  <span className="text-[10px] font-semibold text-slate-500 group-hover:text-white/60 uppercase tracking-widest">
                    Class {manual.classNumber}
                  </span>
                  <h4 className="text-sm font-display font-extrabold text-primary group-hover:text-white transition-colors mt-0.5">
                    {manual.language}
                  </h4>
                  <div className="mt-2 inline-block px-3 py-1 bg-slate-50 group-hover:bg-white/10 text-primary group-hover:text-white text-[10px] font-semibold rounded-full border border-slate-100 group-hover:border-transparent transition-all">
                    Manual Kit
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Section (Rajasthan Full-Width Dark Banner) */}
      <section className="py-24 bg-primary-container text-white relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#3b82f6_0%,_transparent_70%)]"></div>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[12px] font-bold tracking-wider text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Case Study · Rajasthan
            </div>
            <h2 className="text-4xl font-display font-extrabold leading-tight text-white">
              Transforming <span className="text-secondary">Government Schools</span> Across Rajasthan
            </h2>
            <p className="text-sm sm:text-base opacity-70 leading-relaxed text-slate-300">
              By establishing modern maths labs in government schools, we aim to make learning more interactive, practical, and engaging for students. Our initiative is focused on creating a better learning environment that encourages curiosity, confidence, and a stronger foundation in mathematics for every student across the nation.
            </p>
            {/* 2x2 stats grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <CounterCard value="500+" label="Schools Transformed" />
              <CounterCard value="2L+" label="Students Impacted" />
              <CounterCard value="33" label="Districts Reached" />
              <CounterCard value="40%" label="Score Improvement" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative z-10 aspect-video rounded-[20px] overflow-hidden shadow-2xl border border-white/10">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/M_mwjA80t4Q"
                title="Transforming Government School Education Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* IIT Jodhpur incubated badge card */}
            <div className="flex items-center gap-4 p-5 bg-primary/50 border border-white/10 rounded-2xl backdrop-blur-sm text-left">
              <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary font-bold text-xl">
                IIT
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-white">IIT Jodhpur Incubated</h4>
                <p className="text-xs text-slate-400">Supporting innovative educational developments since inception.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials + Client Badges Section */}
      <section className="py-24 bg-background">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/12 text-[12px] font-bold tracking-wider text-primary mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            TESTIMONIALS
          </div>
          <h2 className="text-4xl font-display font-extrabold text-primary mb-4">Trusted by Educators Across India</h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-white/85 backdrop-blur-md p-8 rounded-2xl border border-primary/8 flex flex-col justify-between relative shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left"
            >
              <span className="absolute top-4 right-4 text-6xl text-secondary/20 font-display select-none">“</span>
              <p className="text-xs italic text-[#64748b] mb-8 relative z-10 leading-relaxed">
                "{test.textContent}"
              </p>
              <div className="flex items-center gap-4 relative z-10 mt-auto">
                <img
                  className="w-12 h-12 rounded-full object-cover border border-slate-100"
                  src={test.url}
                  alt={test.title}
                />
                <div>
                  <div className="font-display font-bold text-primary text-xs leading-tight">{test.title.split('(')[0].trim()}</div>
                  <div className="text-[10px] text-[#64748b] leading-tight mt-1">
                    {test.title.includes('(') ? test.title.substring(test.title.indexOf('(') + 1, test.title.length - 1) : 'Educator'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Reviews Subsection */}
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 mb-24 border-t border-slate-200/50 pt-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/12 text-[12px] font-bold tracking-wider text-primary mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              VIDEO REVIEWS
            </div>
            <h3 className="text-3xl font-display font-extrabold text-primary">Educator Video Reviews</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-2xl mx-auto">
              Hear directly from academic leaders, school directors, and HODs about how EduMEasy is reshaping practical mathematics education.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white rounded-3xl border border-primary/12 overflow-hidden shadow-xl p-6 sm:p-8 relative">
            
            {/* Left/Middle Video Player (lg:col-span-2) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-primary/10 bg-black relative">
                <iframe
                  className="w-full h-full absolute inset-0"
                  src={videoReviews[activeVideoIdx].embedUrl}
                  title={videoReviews[activeVideoIdx].name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Course-dashboard Style Meta Tabs */}
              <div className="border-b border-slate-100 flex gap-6 pb-2">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'impact', label: 'Key Impact' },
                  { id: 'about', label: 'About Educator' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveVideoTab(tab.id)}
                    className={`font-display text-sm font-bold pb-2 transition-all relative ${
                      activeVideoTab === tab.id
                        ? 'text-primary'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab.label}
                    {activeVideoTab === tab.id && (
                      <motion.span
                        layoutId="activeVideoTabLine"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Dynamic Tab Contents */}
              <div className="bg-slate-50/50 rounded-2xl p-6 text-left border border-slate-100 min-h-[140px] flex flex-col justify-center">
                {activeVideoTab === 'overview' && (
                  <div>
                    <h4 className="font-display font-extrabold text-primary text-base mb-2">Testimonial Overview</h4>
                    <p className="text-sm italic text-slate-600 leading-relaxed font-body">
                      "{videoReviews[activeVideoIdx].quote}"
                    </p>
                  </div>
                )}

                {activeVideoTab === 'impact' && (
                  <div>
                    <h4 className="font-display font-extrabold text-primary text-base mb-2">Observed Lab Impact</h4>
                    <ul className="space-y-2">
                      {videoReviews[activeVideoIdx].impact.map((imp, idx) => (
                        <li key={idx} className="flex gap-2 items-start text-sm text-slate-600 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0"></span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeVideoTab === 'about' && (
                  <div>
                    <h4 className="font-display font-extrabold text-primary text-base mb-2">Educator Profile</h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-body">
                      {videoReviews[activeVideoIdx].about}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Playlist Sidebar (lg:col-span-1) */}
            <div className="space-y-4 text-left">
              <h4 className="font-display font-extrabold text-primary text-sm tracking-wider uppercase mb-2 px-1">
                Playlist ({videoReviews.length} Reviews)
              </h4>
              
              <div className="space-y-3 lg:max-h-[460px] overflow-y-auto pr-1">
                {videoReviews.map((video, idx) => {
                  const isActive = idx === activeVideoIdx;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveVideoIdx(idx);
                        setActiveVideoTab('overview');
                      }}
                      className={`w-full flex items-center gap-4 p-3 rounded-2xl border text-left transition-all duration-300 ${
                        isActive
                          ? 'border-primary/20 bg-primary/5 shadow-sm'
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <img
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-100 flex-shrink-0"
                        src={video.avatar}
                        alt={video.name}
                      />
                      <div className="min-w-0 flex-grow">
                        <div className={`font-display font-bold text-xs truncate ${isActive ? 'text-primary' : 'text-slate-800'}`}>
                          {video.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">
                          {video.role}
                        </div>
                      </div>
                      
                      {/* Active Indicator or Play Icon */}
                      <div className="flex-shrink-0">
                        {isActive ? (
                          <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
                          </span>
                        ) : (
                          <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Edumeasy Clients Subsection */}
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 border-t border-slate-200/50 pt-16">
          <div className="text-center mb-10">
            <h3 className="text-xs font-mono font-extrabold text-primary tracking-widest uppercase">
              EDUMEASY CLIENTS
            </h3>
            <div className="w-16 h-0.5 bg-primary mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-stretch justify-items-center">
            {clientLogos.map((logo, idx) => (
              <div
                key={idx}
                className="bg-white border border-primary/12 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1.5 hover:border-primary transition-all duration-300 flex items-center justify-center h-28 w-full"
              >
                <img
                  className="max-h-20 max-w-full object-contain"
                  src={logo}
                  alt={`Client School Logo ${idx + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote & Live Demo Request Form Section */}
      <section id="demo-section" className="py-24 bg-surface">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-start">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/12 text-[12px] font-bold tracking-wider text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              LIVE DEMO & DETAILS
            </div>
            <h2 className="text-4xl font-display font-extrabold text-primary leading-snug">
              Schedule a Live Demo for Your School
            </h2>
            <p className="text-sm text-[#64748b] leading-relaxed">
              As we all know that everyone knows about only physics, chemistry, and biological lab, but EduMEasy has developed the Math Lab for students. In this, students will teach math with practical. EduMEasy Math Lab for School has a delightful workshop or activity for every student who faces difficulty in Math.
            </p>
            <p className="text-sm text-[#64748b] leading-relaxed">
              This equipment is going to make math easy and more results Oriented and students are going to love this equipment so they will be able to understand math easily. This Math Lab developed by IITians will bring revolution to the field of Math. Available from 6th to 10th class.
            </p>

            <div className="grid gap-4 pt-4">
              <div className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 hover:border-blue-100 bg-background backdrop-blur-sm transition-all duration-300">
                <div className="w-11 h-11 bg-primary text-white rounded-lg flex items-center justify-center shadow-md">
                  <MapPin className="w-5 h-5 stroke-white" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Head Office</span>
                  <p className="text-xs font-semibold text-primary">IIT Jodhpur Campus, Karwar, Rajasthan 342037</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 hover:border-blue-100 bg-background backdrop-blur-sm transition-all duration-300">
                <div className="w-11 h-11 bg-primary text-white rounded-lg flex items-center justify-center shadow-md">
                  <PhoneCall className="w-5 h-5 stroke-white" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Phone Call</span>
                  <p className="text-xs font-semibold text-primary">+91-8824661216</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 hover:border-blue-100 bg-background backdrop-blur-sm transition-all duration-300">
                <div className="w-11 h-11 bg-primary text-white rounded-lg flex items-center justify-center shadow-md">
                  <Mail className="w-5 h-5 stroke-white" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Email Us</span>
                  <p className="text-xs font-semibold text-primary">contactus@edumeasy.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dark Demo Booking Form Card - Modernized with clean border, smooth inputs & CTA gradients */}
          <div className="bg-gradient-to-br from-primary to-primary-container p-10 rounded-[20px] shadow-2xl relative overflow-hidden text-left w-full border border-white/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 opacity-10 rounded-full translate-x-16 -translate-y-16"></div>
            {success ? (
              <div className="bg-white/10 text-white p-8 rounded-xl text-center space-y-4 relative z-10">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold">Request Submitted Successfully!</h4>
                <p className="text-xs opacity-80">Our engineering representatives will verify custom details and connect back.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-4 py-2 bg-secondary text-white rounded text-xs font-bold hover:bg-secondary/90 transition"
                >
                  Request Another Quote
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
                <h3 className="text-xl font-display font-bold text-white mb-1">Book a Free Demo</h3>
                <p className="text-xs text-white/60 mb-6">Schedule custom laboratory trials and consult our IIT experts.</p>

                {errorMsg && (
                  <div className="bg-red-50/10 text-red-200 p-3 rounded text-xs">{errorMsg}</div>
                )}

                <div>
                  <label className="text-xs font-semibold text-white opacity-80 mb-1.5 block">Full Name *</label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-white/30 text-sm"
                    placeholder="e.g. John Doe"
                  />
                  {errors.name && <p className="text-xs text-red-300 mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-white opacity-80 mb-1.5 block">Email Address *</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-white/30 text-sm"
                    placeholder="e.g. contact@school.com"
                  />
                  {errors.email && <p className="text-xs text-red-300 mt-1">{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-white opacity-80 mb-1.5 block">Phone *</label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-white/30 text-sm"
                      placeholder="+91 ..."
                    />
                    {errors.phone && <p className="text-xs text-red-300 mt-1">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white opacity-80 mb-1.5 block">School Name *</label>
                    <input
                      type="text"
                      {...register('schoolName')}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-white/30 text-sm"
                      placeholder="Institution Name"
                    />
                    {errors.schoolName && <p className="text-xs text-red-300 mt-1">{errors.schoolName.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white opacity-80 mb-1.5 block">Your Question *</label>
                  <textarea
                    rows="3"
                    {...register('message')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-white/30 text-sm"
                    placeholder="Describe your requirement..."
                  ></textarea>
                  {errors.message && <p className="text-xs text-red-300 mt-1">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-white py-4 rounded-xl font-body font-bold hover:shadow-lg hover:shadow-secondary/20 active:scale-[0.98] transition-all duration-300"
                >
                  {isSubmitting ? 'SUBMITTING...' : 'Request Demo →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <LabDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        labType={selectedLabType}
      />
    </motion.div>
  );
};

export default Home;
