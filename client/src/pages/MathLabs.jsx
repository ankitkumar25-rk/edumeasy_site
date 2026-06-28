import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  CheckCircle,
  ArrowRight,
  ShoppingCart,
  Calendar,
  Play,
  ChevronRight
} from 'lucide-react';

// Custom font helper for premium typography
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

const FloatingSymbols = () => {
  const symbols = ['+', '−', '×', '÷', '√', 'π', '∑', 'θ', 'Δ', 'α', 'β'];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
      {symbols.map((sym, idx) => (
        <motion.div
          key={idx}
          className="absolute text-primary text-6xl font-display font-black"
          initial={{
            x: Math.random() * 1000,
            y: Math.random() * 600,
            rotate: Math.random() * 360,
            scale: 0.5 + Math.random() * 0.8
          }}
          animate={{
            y: [null, Math.random() * -100 - 50],
            rotate: [null, Math.random() * 180 - 90]
          }}
          transition={{
            duration: 15 + Math.random() * 15,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            left: `${(idx * 9) % 100}%`,
            top: `${(idx * 13) % 100}%`
          }}
        >
          {sym}
        </motion.div>
      ))}
    </div>
  );
};

const EquipmentCard = ({ lab }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group h-full select-none text-left">
      <div className="h-80 bg-white relative overflow-hidden flex items-center justify-center shrink-0 p-4 border-b border-slate-100">
        {!imgError ? (
          <img
            src={lab.imageUrl}
            alt={lab.name}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            draggable="false"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/30 flex flex-col items-center justify-center p-6 text-center">
            <span className="text-5xl font-display font-black text-primary/15 mb-2 select-none font-display">
              {lab.name.split(' ').map(w => w[0]).join('')}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
              EduMEasy Rig
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-display font-extrabold text-primary mb-2.5 group-hover:text-secondary transition-colors duration-300 font-display">
            {lab.name}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-body line-clamp-3">
            {lab.description}
          </p>
        </div>
      </div>
    </div>
  );
};

const EquipmentSlider = ({ equipments }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setCardsToShow(2);
      } else {
        setCardsToShow(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, equipments.length - cardsToShow);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [cardsToShow, maxIndex, currentIndex]);

  const handlePrev = () => {
    if (currentIndex === 0) {
      setCurrentIndex(maxIndex);
    } else {
      setCurrentIndex(prev => Math.max(0, prev - 1));
    }
  };

  const handleNext = () => {
    if (currentIndex === maxIndex) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
    }
  };

  return (
    <div className="relative w-full">
      {/* Slider Viewport */}
      <div className="overflow-hidden py-4 -mx-2 px-2">
        <div
          className="flex transition-transform duration-500 ease-out gap-6"
          style={{
            transform: `translateX(calc(-${currentIndex} * (100% + 24px) / ${cardsToShow}))`
          }}
        >
          {equipments.map((lab) => (
            <div
              key={lab.id}
              className="shrink-0 transition-all duration-300"
              style={{
                width: `calc(${100 / cardsToShow}% - ${(cardsToShow - 1) * 24 / cardsToShow}px)`
              }}
            >
              <EquipmentCard lab={lab} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {maxIndex > 0 && (
        <div className="absolute top-1/2 -translate-y-1/2 left-[-28px] right-[-28px] flex justify-between pointer-events-none z-10">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full flex items-center justify-center border pointer-events-auto transition-all bg-white border-slate-200 text-primary hover:bg-slate-50 shadow-md active:scale-95"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full flex items-center justify-center border pointer-events-auto transition-all bg-white border-slate-200 text-primary hover:bg-slate-50 shadow-md active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Slide Indicators */}
      {maxIndex > 0 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-6 bg-secondary' : 'w-1.5 bg-slate-300'
                }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const BookDemoForm = ({ level, setLevel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    schoolName: '',
    schoolAddress: '',
    question: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-emerald-500/20 p-8 sm:p-12 rounded-3xl text-center max-w-xl mx-auto shadow-lg"
      >
        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-display font-extrabold text-primary mb-3">Demo Requested Successfully!</h3>
        <p className="text-xs text-slate-500 leading-relaxed font-body">
          Thank you for showing interest in EduMEasy Math Labs. An IIT Jodhpur researcher from our team will contact your school administration shortly to schedule the visual & physical demo.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200/60 p-6 sm:p-10 rounded-3xl shadow-xl max-w-2xl mx-auto text-left space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-secondary focus:border-secondary outline-none transition-all font-body text-slate-700"
            placeholder="Write full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Email ID *
          </label>
          <input
            type="email"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-secondary focus:border-secondary outline-none transition-all font-body text-slate-700"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Contact Number *
          </label>
          <input
            type="tel"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-secondary focus:border-secondary outline-none transition-all font-body text-slate-700"
            placeholder="Active mobile number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            School Name *
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-secondary focus:border-secondary outline-none transition-all font-body text-slate-700"
            placeholder="Full school name"
            value={formData.schoolName}
            onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            School Address *
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-secondary focus:border-secondary outline-none transition-all font-body text-slate-700"
            placeholder="Complete address"
            value={formData.schoolAddress}
            onChange={(e) => setFormData({ ...formData, schoolAddress: e.target.value })}
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Target Lab Level
          </label>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-secondary focus:border-secondary outline-none transition-all font-body text-slate-700 bg-white"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="PRIMARY">Primary Math Lab (Grades 1-5)</option>
            <option value="ADVANCED">Advanced Math Lab (Grades 6-10)</option>
            <option value="BOTH">Both Primary & Advanced Labs</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
          Any Specific Message or Question
        </label>
        <textarea
          rows="3"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-secondary focus:border-secondary outline-none transition-all resize-none font-body text-slate-700"
          placeholder="How can our math lab experts help you?"
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-display text-xs font-bold uppercase tracking-wider active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-secondary/15"
      >
        {submitting ? 'Submitting Details...' : 'Book Free Math Lab Demo'}
      </button>
    </form>
  );
};

const MathLabs = () => {
  const [formLevel, setFormLevel] = useState('PRIMARY');

  const scrollToDemo = (levelSelected) => {
    setFormLevel(levelSelected);
    const el = document.getElementById('book-demo');
    if (el) {
      const offset = 100;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const primaryEquipments = [
    {
      id: 'p1',
      name: 'Multiplicator',
      description: 'The Multiplicator Instrument is an innovative and interactive tool designed to help students understand the fundamentals of multiplication, including the logic of positive and negative numbers. This instrument bridges abstract numerical calculations with physical, tactile representations.',
      imageUrl: 'https://edumeasy.com/wp-content/uploads/2025/01/multiplicator-final-678d1a7b7c9bf-300x300.webp',
      classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
      accessories: ['Grid panel board', 'Magnetic number plates', 'Multiplication beads', 'Activity guides']
    },
    {
      id: 'p2',
      name: 'Shape Discriminator',
      description: 'The Shape Discriminator Instrument is an engaging educational tool designed to help students explore geometric figures, spatial properties, and basic fraction divisions. It makes fractions tangible by dividing colorful polygons into equal slices.',
      imageUrl: 'https://edumeasy.com/wp-content/uploads/2025/01/whatsapp-image-2025-01-19-at-90211-pm-678d1b158d6f0.webp',
      classes: ['Class 2', 'Class 3', 'Class 4', 'Class 5'],
      accessories: ['Geometric fraction plates', 'Magnetic layout board', 'Shape discriminator guide']
    },
    {
      id: 'p3',
      name: 'Time and Angle Tracker',
      description: 'A dual-purpose tracking setup designed to help young minds connect clock movements with geometric angles. It simplifies complex concepts of minutes, hours, degrees, and acute/obtuse angle boundaries.',
      imageUrl: 'https://edumeasy.com/wp-content/uploads/2025/01/time-and-angle-tracker-final-678d1a5d13e22.webp',
      classes: ['Class 3', 'Class 4', 'Class 5'],
      accessories: ['Rotatable clock faces', 'Degree protractor scale', 'Magnetic hands', 'Angle pegs']
    },
    {
      id: 'p4',
      name: 'Decimal Operator',
      description: 'The Decimal Operator helps primary students master place values, decimal additions, and unit fractions. It provides an intuitive slider system that makes the decimal point shift easily understandable.',
      imageUrl: 'https://edumeasy.com/wp-content/uploads/2025/01/decimal-operator-final-678d1a8f11812.webp',
      classes: ['Class 4', 'Class 5'],
      accessories: ['Decimal placement sliders', 'Visual fraction blocks', 'Unit measurements ruler']
    },
    {
      id: 'p5',
      name: 'Pattern Finder',
      description: 'Designed to boost critical thinking and logical matching. The Pattern Finder challenges students to solve series, match mirror images, and recognize mathematical symmetries through visual peg board arrangements.',
      imageUrl: 'https://edumeasy.com/wp-content/uploads/2025/01/general-calculator-final-678d1a8928a6d.webp',
      classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
      accessories: ['Sequence pattern tiles', 'Symmetry mirror tools', 'Peg boards with pegs']
    },
    {
      id: 'p6',
      name: 'Mensurator (Primary)',
      description: 'A versatile tool that introduces basic concepts of perimeter and area. Using this grid and elastic bands, students construct 2D shapes, visualize boundaries, and learn multiplication through coordinate grids.',
      imageUrl: 'https://edumeasy.com/wp-content/uploads/2025/01/area-parimeater-finder-final-678d1a5804b41.webp',
      classes: ['Class 3', 'Class 4', 'Class 5'],
      accessories: ['Peg layout boards', 'Perimeter color bands', 'Tile-based unit markers']
    },
    {
      id: 'p7',
      name: 'Number Interactor',
      description: 'Simplifies arithmetic logic, number lines, and mathematical inequalities (<, >, =). Students slide markers along the board to balance equations and verify arithmetic sums physically.',
      imageUrl: 'https://edumeasy.com/wp-content/uploads/2025/01/22222-678d1a56661fd.webp',
      classes: ['Class 1', 'Class 2', 'Class 3'],
      accessories: ['Double-sided number slider', 'Inequality pivots', 'Active count tokens']
    },
    {
      id: 'p8',
      name: 'Number Twistor',
      description: 'An interactive rotational rig that makes prime, composite, even, and odd numbers visually filterable. By twisting the dials, children quickly find multiples and prime divisors.',
      imageUrl: 'https://edumeasy.com/wp-content/uploads/elementor/thumbs/number-expositor-final-678d1a78df05a-scaled-r08rgobc6go6rpwxp63wfron5nyqbkwlirs3ut9qmm.webp',
      classes: ['Class 3', 'Class 4', 'Class 5'],
      accessories: ['Twistor dial system', 'Divisor overlays', 'Multiples grid card']
    }
  ];

  const advancedEquipments = [
    {
      id: 'a1',
      name: 'Algebra Annotator',
      description: 'Understanding algebraic expressions, polynomials, simple equations, and factorization is often a major obstacle. The Algebra Annotator uses physical square and rectangular plates to visualize operations like multiplication and division.',
      imageUrl: 'https://edumeasy.com/wp-content/uploads/2023/05/ALGEBRA-ANNOTATOR-Math-Lab-Equipment-for-schools.jpg',
      classes: [
        'Class 6: Basic Algebra',
        'Class 7: Equations, Expressions, Powers',
        'Class 8: Linear Equations in 1 Var, Factorisation',
        'Class 9: Polynomials, Real Roots'
      ],
      accessories: [
        'Rig Size: 3 ft x 3 ft (Durable iron build)',
        'Square plates Qty – 68 nos.',
        'Rectangular Qty – 08 nos.',
        'Balance (Traju) Qty – 01 nos.',
        'Allen key Qty – 01 nos.',
        'Tripod Stand & Tray support'
      ]
    },
    {
      id: 'a2',
      name: 'Number System',
      description: 'Handles signs and operations on integers. Helps Middle and Secondary school students learn Whole numbers, positive/negative integers, ordering properties, and closure properties through magnetic experiments.',
      imageUrl: 'https://edumeasy.com/wp-content/uploads/2023/05/NUMBER-SYSTEM-OPERATOR-Math-Lab-Equipment-for-schools-300x300.jpg',
      classes: [
        'Class 6: Whole Numbers, Integers',
        'Class 7: Integers'
      ],
      accessories: [
        'Rig Size: 3 ft x 3 ft (Square shape)',
        'Smiley magnets Qty – 20 nos.',
        'Whiteboard for instrument(N) – 01 nos.',
        'Heavy-duty Tripod Stand'
      ]
    },
    {
      id: 'a3',
      name: 'Geometry Expositor',
      description: 'The ultimate visual proof bank for geometry theorems. Covers angles between lines, parallel line behaviors, congruent/similar triangles, properties of quadrilaterals, and elementary trigonometry.',
      imageUrl: 'https://edumeasy.com/wp-content/uploads/2023/05/GEOMETRY-EXPOSITOR-Math-Lab-Equipment-for-schools-300x297.jpg',
      classes: [
        'Class 6 & 7: Elementary Shapes, Lines, Symmetry',
        'Class 8: Quadrilaterals, Parallelisms',
        'Class 9: Euclid Geometry, Congruency Proofs',
        'Class 10: Similarity of Triangles, Trigonometry Basics'
      ],
      accessories: [
        'Rig Size: 4 ft x 4 ft (Large display)',
        'Red color sticks with magnet Qty – 39 nos.',
        'Silver color sticks with magnet Qty – 04 nos.',
        'Laser Scale for precise linear angle shots',
        'Tripod Stand & Stick Tray'
      ]
    },
    {
      id: 'a4',
      name: 'Co-ordinate System Demonstrator',
      description: 'Enables interactive plotting of coordinate points, quadrants, and linear equations in a 2D plane. Explains roots of polynomials and systems of equations visually.',
      imageUrl: 'https://edumeasy.com/wp-content/uploads/2023/05/CO-ORDINATE-SYSTEM-DEMONSTRATOR-Math-Lab-Equipment-for-schools-300x295.jpg',
      classes: [
        'Class 6 & 7: Prime/Composite Numbers, Decimals, Ratios',
        'Class 8: Squares, Cubes, Direct/Inverse Proportions',
        'Class 9: Number Systems, 2-Variable Linear Graphs',
        'Class 10: Real Numbers, AP, Coordinates, Statistics'
      ],
      accessories: [
        'Rig Size: 3 ft x 3 ft (Steel frame)',
        'Yellow magnetic sticks Qty – 20 nos.',
        'Spring Wire sleeve covered Qty – 09 nos.',
        'Button magnet Qty – 25 nos.',
        'Heavy Magnet Qty – 04 nos.',
        'Tripod Stand & Accessories Tray'
      ]
    },
    {
      id: 'a5',
      name: 'Circle Descriptor',
      description: 'Simplifies circle properties, chords, tangents, segments, and angle theorems. Also exceptionally useful in visualizing fractions and calculating spinner probability.',
      imageUrl: 'https://edumeasy.com/wp-content/uploads/2023/05/CIRCLE-DESCRIPTOR-Math-Lab-Equipment-for-schools-300x288.jpg',
      classes: [
        'Class 6 & 7: Fractions, Ratios, Comparing Quantities',
        'Class 8: Area and Circumference',
        'Class 9: Chords, Subtended Angles',
        'Class 10: Circle Tangents, Sector Areas, Probability'
      ],
      accessories: [
        'Rig Size: 3 ft x 3 ft (Iron structure)',
        'Orange magnetic sticks Qty – 22 nos.',
        'Silver magnetic sticks Qty – 04 nos.',
        'Colored triangular plates Qty – 10 nos.',
        'Tripod Stand & Tray support'
      ]
    },
    {
      id: 'a6',
      name: 'Mensuration Evaluator',
      description: 'Designed to help students transition from abstract area and volume formulas to physical proofs. Covers Heron\'s formula, parallelogram spaces, datasets, and statistics.',
      imageUrl: 'https://edumeasy.com/wp-content/uploads/2023/05/MENSURATION-EVALUATOR-Math-Lab-Equipment-for-schools-300x296.jpg',
      classes: [
        'Class 6: Playing with numbers, Data handling',
        'Class 7: Perimeter and Area equations',
        'Class 8: Graphical representation, Mensuration basics',
        'Class 9: Heron\'s Formula proofs, Trigonometric areas'
      ],
      accessories: [
        'Rig Size: 3 ft x 3 ft (Steel sheet layout)',
        'Green magnetic sticks Qty – 39 nos.',
        'Heavy-duty Tripod Stand',
        'Stick Holder Tray'
      ]
    }
  ];

  return (
    <div className="bg-[#f8fafc] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] text-slate-800 font-body relative overflow-x-hidden min-h-screen">
      <FontStyles />

      {/* Hero Header Section */}
      <section className="relative bg-gradient-to-b from-[#0a2540] to-[#0d2e50] text-white py-20 overflow-hidden border-b border-slate-800">
        <FloatingSymbols />
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/15 border border-secondary/30 text-[11px] font-bold tracking-widest text-secondary uppercase mb-5 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
            IIT Jodhpur Incubated Project
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Mathematics <span className="text-secondary">Lab Setup</span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Providing a complete mathematics laboratory setup for schools—from primary foundational classes to advanced secondary classes. 100% syllabus-mapped hardware rigs.
          </p>
        </div>
      </section>

      {/* Main Content Layout - Centered single column */}
      <div className="max-w-[1000px] mx-auto px-6 lg:px-8 py-16 relative">
        {/* Background Gradient Blobs */}
        <div className="absolute top-[10%] left-[-20%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none z-0"></div>
        <div className="absolute top-[40%] right-[-20%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl pointer-events-none z-0"></div>
        <div className="absolute top-[70%] left-[-20%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none z-0"></div>

        <main className="w-full space-y-20 text-left relative z-10">

          {/* 1. PRIMARY EQUIPMENT DETAILS */}
          <section id="primary-equipments" className="space-y-8">
            <div className="border-b border-slate-200 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[9px] font-bold tracking-widest text-primary uppercase mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Grades 1 to 5
              </div>
              <h2 className="text-3xl font-display font-extrabold text-primary font-display">
                Primary Lab Equipments
              </h2>
              <p className="text-xs text-slate-500 max-w-xl mt-2 leading-relaxed font-body">
                Designed specifically for early learning needs. These instruments bridge young children's cognitive play with physical proofs, introducing fractions, multiplications, patterns, and angles visually.
              </p>
            </div>
            <EquipmentSlider equipments={primaryEquipments} />
          </section>

          {/* GENERAL MATH KITS STORE BANNER (In between both lab sliders) */}
          <section className="bg-gradient-to-br from-primary to-[#0d2e50] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-bl-full"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-3">
                <span className="text-[9px] font-bold uppercase tracking-widest text-secondary bg-secondary/15 px-3 py-1 rounded-full border border-secondary/30">
                  EduMEasy Math Kits
                </span>
                <h4 className="text-2xl font-display font-black">Syllabus-Mapped Math Kits & Models</h4>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed font-light">
                  Bring hands-on mathematics learning into your classrooms. Order standard teacher demo kits, student math activity kits, and individual lab experiment boards with lifetime warranty.
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
                <Link
                  to="/store"
                  className="px-6 py-3 bg-secondary text-white hover:bg-secondary/90 transition-all font-display text-xs font-bold rounded-xl text-center shadow-lg shadow-secondary/15 flex items-center justify-center gap-2"
                >
                  Visit Store Page <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => scrollToDemo('BOTH')}
                  className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white transition-all font-display text-xs font-bold rounded-xl text-center border border-white/20"
                >
                  Request Custom Quote
                </button>
              </div>
            </div>
          </section>

          {/* 3. PRIMARY DEMO VIDEO */}
          <section id="primary-video" className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-xl font-display font-extrabold text-primary flex items-center gap-2 font-display">
                <Play className="w-5 h-5 text-secondary shrink-0" />
                Primary Lab Demo Video
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Watch the live class implementation and interactive walkthrough of primary kits.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl bg-slate-900 border border-slate-200/20 aspect-video relative group">
              <iframe
                className="w-full h-full absolute inset-0"
                src="https://www.youtube.com/embed/c5y9BX_tTfk"
                title="Primary Math Lab Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </section>


          {/* 2. ADVANCED EQUIPMENT DETAILS */}
          <section id="advanced-equipments" className="space-y-8">
            <div className="border-b border-slate-200 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[9px] font-bold tracking-widest text-primary uppercase mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> Grades 6 to 10
              </div>
              <h2 className="text-3xl font-display font-extrabold text-primary font-display">
                Advanced Lab Equipments
              </h2>
              <p className="text-xs text-slate-500 max-w-xl mt-2 leading-relaxed font-body">
                Designed for middle & high schools mapped to CBSE/NCERT norms. Large-scale sturdy iron structures to resolve theorems, algebraic expansions, coordinate projections, and mensuration calculations physically.
              </p>
            </div>
            <EquipmentSlider equipments={advancedEquipments} />
          </section>

          {/* 4. ADVANCED DEMO VIDEO */}
          <section id="advanced-video" className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-xl font-display font-extrabold text-primary flex items-center gap-2 font-display">
                <Play className="w-5 h-5 text-secondary shrink-0" />
                Advanced Lab Tour
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Watch the detailed breakdown of Algebra Annotator, circle, coordinate systems, and triangle rigs.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl bg-slate-900 border border-slate-200/20 aspect-video relative group">
              <iframe
                className="w-full h-full absolute inset-0"
                src="https://www.youtube.com/embed/tQ7BhJ_3Npk"
                title="Advanced Math Lab Tour"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </section>

          {/* 5. UNIFIED BOOK A DEMO FORM */}
          <section id="book-demo" className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-xl font-display font-extrabold text-primary flex items-center gap-2">
                <Calendar className="w-5 h-5 text-secondary shrink-0" />
                Book a Mathematics Lab Demo
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Schedule a free physical or virtual session where our academic coordinators demonstrate the hardware models.
              </p>
            </div>
            <BookDemoForm level={formLevel} setLevel={setFormLevel} />
          </section>

        </main>
      </div>
    </div>
  );
};

export default MathLabs;
