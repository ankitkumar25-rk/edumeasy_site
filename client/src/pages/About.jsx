import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Award,
  GraduationCap,
  Building,
  PhoneCall,
  CheckCircle,
  Sparkles,
  ArrowRight
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
      <div className="text-[11px] font-semibold opacity-60 uppercase tracking-wider mt-1 text-slate-200">{label}</div>
    </motion.div>
  );
};

const MemberAvatar = ({ name, photoUrl }) => {
  const isPlaceholder = !photoUrl || photoUrl.includes('cloudinary.com/demo') || photoUrl.includes('cld-sample') || photoUrl.includes('placeholder');
  
  if (isPlaceholder) {
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    return (
      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center border border-primary/10 shadow-inner group-hover:scale-105 transition-all duration-300">
        <span className="text-xl font-display font-extrabold text-primary">{initials}</span>
      </div>
    );
  }

  return (
    <img
      className="w-24 h-24 rounded-2xl object-cover border border-primary/10 shadow-sm group-hover:scale-105 transition-all duration-300"
      src={photoUrl}
      alt={name}
      onError={(e) => {
        e.target.onerror = null;
        // SVG representation fallback
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
      }}
    />
  );
};

const About = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackTeam = [
    {
      id: 'f1',
      name: 'Vivek Sahu',
      qualification: 'Postgraduate in Mathematics (IIT Jodhpur)',
      role: 'CEO & Founder',
      type: 'TEAM',
      bio: "Vivek Kumar Sahu is the visionary CEO and Founder of Edumeasy, dedicated to revolutionizing the way students learn mathematics. A postgraduate in Mathematics from IIT Jodhpur, he combines his academic excellence with a passion for innovation to create engaging, hands-on learning tools. His leadership drives Edumeasy's mission to make mathematics accessible, interactive, and enjoyable for learners of all ages.",
      photoUrl: 'https://edumeasy.com/wp-content/uploads/2025/01/1691921129587.jpeg'
    },
    {
      id: 'f2',
      name: 'Sunil Kumar',
      qualification: 'B.Tech in Computer Science (NIT Uttarakhand)',
      role: 'Chief Operating Officer',
      type: 'TEAM',
      bio: "Sunil Kumar is the Chief Operating Officer of Edumeasy, responsible for overseeing daily operations and optimizing business processes. With extensive experience in operations management, he drives efficiency and ensures smooth execution of strategies. Sunil’s leadership contributes to the company’s growth and operational success.",
      photoUrl: 'https://edumeasy.com/wp-content/uploads/2024/06/3.png'
    },
    {
      id: 'f3',
      name: 'Parth Vijay',
      qualification: 'B.Tech in Computer Science (IIT Kanpur)',
      role: 'Research & Development Head',
      type: 'TEAM',
      bio: "Parth Vijay leads the research and development of curriculum-mapped interactive products. With a strong pedigree from IIT Kanpur, he builds visual mathematical proofs and tactile models that help students transition from abstract equations to physical intuition.",
      photoUrl: ''
    },
    {
      id: 'f4',
      name: 'Chinmay Sharma',
      qualification: 'B.Tech in Electronics (JIET)',
      role: 'Design & Technology Engineer',
      type: 'TEAM',
      bio: "Chinmay Sharma manages the technical product engineering and hardware designing for our mathematics laboratory rigs, optimizing physical builds for long-lasting educational activities.",
      photoUrl: ''
    },
    {
      id: 'f5',
      name: 'Yash Asawa',
      qualification: 'MBA in Operations',
      role: 'Operations & Marketing Manager',
      type: 'TEAM',
      bio: "Yash Asawa steers the logistics, school partnerships, and public relations at Edumeasy, driving institutional expansions and pilot implementations across Indian districts.",
      photoUrl: ''
    },
    {
      id: 'f6',
      name: 'Dr. Vivek Vijay',
      qualification: 'Ph.D in Applied Math (IIT Roorkee), Associate Professor (IIT Jodhpur)',
      role: 'Mentor & Director',
      type: 'MENTOR',
      bio: "Vivek Vijay is a passionate educator and Associate Professor of Mathematics at IIT Jodhpur. As the Director and Mentor of Edumeasy, he combines his academic expertise and leadership to make education engaging and accessible for students worldwide. His vision drives the creation of innovative tools and resources, transforming how students learn and interact with mathematics.",
      photoUrl: 'https://edumeasy.com/wp-content/uploads/2025/01/images.jpeg'
    },
    {
      id: 'f7',
      name: 'Dr. Sandeep Yadav',
      qualification: 'Associate Professor of Electrical Engineering (IIT Jodhpur)',
      role: 'Mentor & Director',
      type: 'MENTOR',
      bio: "Sandeep Kumar Yadav is an Associate Professor at the Indian Institute of Technology, Jodhpur, with a distinguished academic and research background. His expertise spans Signal Processing (Acoustic and Vibration), Condition Monitoring, Artificial Neural Networks, Blind Source Separation, Image Processing, and Machine Learning. As a Mentor and Director at Edumeasy, he leverages his rich experience and innovative approach to develop transformative educational tools that empower students to excel in mathematics and beyond.",
      photoUrl: 'https://edumeasy.com/wp-content/uploads/2025/01/images-1.jpeg'
    },
    {
      id: 'f8',
      name: 'Prof. P. K. Kalra',
      qualification: 'Founder Director (IIT Jodhpur)',
      role: 'Academic Advisor',
      type: 'ADVISOR',
      bio: "Prof P K Kalra is the Founder Director of IIT Jodhpur and a pioneer in computer science and advanced engineering education. He guides Edumeasy's institutional strategy and research scaling.",
      photoUrl: ''
    },
    {
      id: 'f9',
      name: 'Prof. I. K. Rana',
      qualification: 'Ex-Professor of Mathematics (IIT Bombay)',
      role: 'Senior Pedagogy Advisor',
      type: 'ADVISOR',
      bio: "Prof I K Rana is an esteemed mathematics professor, author, and researcher formerly at IIT Bombay. He provides mathematical sanity checks, curriculum alignment, and conceptual design verification.",
      photoUrl: ''
    },
    {
      id: 'f10',
      name: 'Shri Sunil Bajaj',
      qualification: 'Jt. Director (SCERT Haryana)',
      role: 'Government Projects Advisor',
      type: 'ADVISOR',
      bio: "Shri Sunil Bajaj is the Joint Director of SCERT Haryana, helping shape government school deployments, teacher training modules, and public sector integration of hands-on math labs.",
      photoUrl: ''
    }
  ];

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.TEAM || '/team');
        const data = response.data.data || response.data;
        if (Array.isArray(data) && data.length > 0) {
          setMembers(data);
        } else {
          setMembers(fallbackTeam);
        }
      } catch (err) {
        setMembers(fallbackTeam);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const displayMembers = members.length > 0 ? members : fallbackTeam;
  
  // Filtering based on type/role to cover both DB schemas & fallbacks
  const teamMembers = displayMembers.filter((m) => (m.type || m.role || '').toUpperCase() === 'TEAM');
  const mentors = displayMembers.filter((m) => (m.type || m.role || '').toUpperCase() === 'MENTOR');
  const advisors = displayMembers.filter((m) => (m.type || m.role || '').toUpperCase() === 'ADVISOR');

  const labFeatures = [
    {
      num: "01.",
      title: "Complete NCERT Coverage",
      desc: "7 Big-sized modular equipments covering NCERT math chapters from classes 6th to 10th."
    },
    {
      num: "02.",
      title: "Step-by-step Teacher Manuals",
      desc: "Comprehensive manuals in Hindi & English containing practical guide to all school lab activities."
    },
    {
      num: "03.",
      title: "100% Eco-Friendly Rig",
      desc: "Completely green educational apparatus requiring zero electricity and minimal maintenance."
    },
    {
      num: "04.",
      title: "All Accessories Included",
      desc: "Comes pre-packaged with all required indicators, slides, magnets, and measurement accessories."
    },
    {
      num: "05.",
      title: "Full 1-Day Teacher Training",
      desc: "Hands-on implementation workshop to train school teachers on conducting all lab experiments."
    },
    {
      num: "06.",
      title: "Hassle-Free Online Support",
      desc: "Instant support from IIT researchers for syllabus mapping, debugging, and lab assistance."
    },
    {
      num: "07.",
      title: "Partner School Certification",
      desc: "Official recognition certificate for the institution as an EduMEasy Certified Math Lab Partner."
    },
    {
      num: "08.",
      title: "Big Sized Demonstration Props",
      desc: "Large scale equipment designed specifically for better classroom visibility and student participation."
    }
  ];

  const milestones = [
    { year: "Incubation", title: "Incubated at IIT Jodhpur", desc: "Formally registered with i-Start Rajasthan and incubated by IIT Jodhpur to develop hands-on academic systems." },
    { year: "2021", title: "8th Rajasthan Science Congress Summit", desc: "Presented the prototype of mathematical equipments at IIS University, gaining early researcher endorsement." },
    { year: "2022", title: "State Pilot MoU Signed", desc: "MoU signed between RScSE (Dept. of School Education, Rajasthan) and EduMEasy on 23rd August 2022 for pilot in 11 schools of Jodhpur." },
    { year: "2023", title: "CM & Minister Presentations", desc: "Presented tactile math lab models to Hon. Shri Ashok Gehlot (CM of Rajasthan) and Dr. B.D. Kalla (Education Minister)." },
    { year: "Scaling", title: "Kendriya Vidyalaya & NGO Installs", desc: "Established fully functional lab setups at Kendriya Vidyalaya IIT Jodhpur and Shantikunj Haridwar (inaugurated by Dr. Chinmay Pandya)." },
    { year: "Impact", title: "Corporate & State Support", desc: "Collaborated with Indeed Foundation, JSW, Surya Urja, and Eklavya Foundation to implement labs across Phalodi, Jodhpur, and Maharashtra." }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-background text-slate-800 font-body relative overflow-x-hidden"
    >
      <FontStyles />

      {/* Hero Section */}
      <section className="relative overflow-hidden w-full py-28 bg-primary-container text-white text-center">
        <div
          className="absolute inset-0 z-20"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 21, 43, 0.95), rgba(10, 37, 64, 0.85), rgba(6, 21, 43, 0.90))',
          }}
        ></div>
        
        {/* Math Grid background helper */}
        <div className="absolute inset-0 opacity-10 math-grid-bg"></div>

        {/* Floating animated math symbols */}
        <FloatingSymbols />

        <div className="max-w-4xl mx-auto px-6 relative z-30 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-semibold text-white tracking-wider uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            WHO WE ARE
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-tight text-white">
            About <span className="text-secondary">EduMEasy</span>
          </h1>
          
          <p className="text-base sm:text-lg opacity-80 max-w-2xl mx-auto leading-relaxed text-slate-200">
            Making mathematics simple, intuitive, and practical for school students nationwide through visual proofs and tactile learning equipment.
          </p>
        </div>
      </section>

      {/* Video & Introduction Section */}
      <section className="py-24 max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[12px] font-bold tracking-wider text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              COMPREHENSIVE MATH LAB
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-primary leading-tight">
              Making Math Engaging, Interactive & Real
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              EduMEasy has developed a comprehensive Math-Lab for Schools to visualize and understand mathematical concepts through experiments. Our aim is to provide a one-stop solution for students to understand and apply math concepts in real time — combining theory, applications, and experiments.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              EduMEasy Math Lab for Schools has a delightful workshop for every student who faces difficulty in Math. It adds surplus to the studies and will have a remarkable impact on the learning experience — helping to visualize every concept of mathematics and making learning easy.
            </p>
            
            <div className="quote-box bg-slate-50 border-l-4 border-secondary p-5 rounded-r-2xl italic text-xs text-slate-500 leading-relaxed space-y-2">
              <p>"— A picture is worth 1000 words, if one is aware of its scope."</p>
              <p>"— A picture is worth 1000 words, if one is able to use it flexibly."</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200/60 bg-black relative">
              <iframe
                className="w-full h-full absolute inset-0"
                src="https://www.youtube.com/embed/c5y9BX_tTfk?controls=1&rel=0&playsinline=1&modestbranding=1"
                title="Math Lab Introduction Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider text-center">
              ▶ WATCH MATH LAB INTRODUCTION DEMO
            </p>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto bg-gradient-to-br from-primary to-primary-container p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_#3b82f6_0%,_transparent_70%)]"></div>
          <CounterCard value="50%" label="Students afraid of maths" />
          <CounterCard value="100%" label="NCERT Syllabus Covered" />
          <CounterCard value="IIT" label="Jodhpur Faculty & Alumni" />
        </div>
      </section>

      {/* Math Lab Concept Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative order-last md:order-first">
            <img
              className="rounded-2xl border border-slate-200 shadow-lg w-full h-[340px] object-cover"
              src="https://edumeasy.com/wp-content/uploads/2023/04/about-section-1.jpg"
              alt="IIT Jodhpur incubation lab development"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=600";
              }}
            />
            <div className="absolute -bottom-4 -right-4 bg-white border border-slate-100 p-4 rounded-xl shadow-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Origin</p>
                <p className="text-xs font-extrabold text-primary">IIT Jodhpur Incubation</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/15 text-[12px] font-bold tracking-wider text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              THE CONCEPT
            </div>
            <h2 className="text-3xl font-display font-extrabold text-primary leading-tight">
              Tactile Pedagogy & Visualization
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Researchers observed that understanding patterns and visualization helps a student learn even complex mathematics and apply them to new problems. The team from <strong>IIT Jodhpur</strong> (faculty members & alumni) who conceived and developed this Math Lab are convinced that this lab provides a platform for teachers to teach the theoretical and abstract concepts of mathematics through experiments and visualizations — accompanied by study material for reflective thinking.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Almost <strong>50% of school-going children</strong> suffer from mathematical anxiety. Through visual proofs and structured physical equipment, students interact with concepts directly, transforming abstract formulas into physical intuition.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-24 max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[12px] font-bold tracking-wider text-primary mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            FEATURES & CAPABILITIES
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-primary mb-4">
            Features of Math Lab for School
          </h2>
          <p className="text-sm text-slate-500">
            A state-of-the-art laboratory setup engineered to align with national educational frameworks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {labFeatures.map((f, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left group"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-xs font-mono font-extrabold text-secondary tracking-widest">{f.num}</span>
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-primary/5 transition-all">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <h3 className="font-display font-extrabold text-base text-primary mb-2 group-hover:text-secondary transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements & Recognition */}
      <section className="py-24 bg-primary-container text-white relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#3b82f6_0%,_transparent_70%)]"></div>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[12px] font-bold tracking-wider text-white mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              RECOGNITIONS & ACCREDITATIONS
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
              Our Achievements & Recognition
            </h2>
            <p className="text-sm opacity-70 mt-2">
              Recognized by leading Indian institutes and government ministries for impact in experiential mathematics education.
            </p>
          </div>

          {/* Core Achievement Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16 text-center">
            <CounterCard value="120+" label="Govt. Schools Installed" />
            <CounterCard value="₹65L+" label="Grants & Funds Secured" />
            <CounterCard value="Top 75" label="Social Impact Technologies (IIT Delhi)" />
          </div>

          {/* Accolades List Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {[
              {
                title: "iHub Drishti Foundation, IIT Jodhpur",
                detail: "Received ₹50 Lakhs funding to scale curriculum-aligned Math Lab solutions nationwide."
              },
              {
                title: "Kotak BizLabs & IIMA Ventures",
                detail: "Secured ₹15 Lakhs Grant from Kotak BizLabs under the prestigious IIMA Ventures program."
              },
              {
                title: "Statewide school implementation",
                detail: "Successfully established Math Labs in 120 government schools across Rajsamand."
              },
              {
                title: "Tech4Seva (IIT Jodhpur)",
                detail: "Awarded 2nd Rank in Tech4Seva under Aatma Nirbhar Bharat at IIT Jodhpur."
              },
              {
                title: "CM of Rajasthan Presentation",
                detail: "MoU signed with the Rajasthan School Education Department for implementation."
              },
              {
                title: "Maharashtra school installations",
                detail: "Installed labs in Phalodi, Nagaur, and Nagpur tribal area schools with JSW & Surya Urja."
              }
            ].map((ac, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm flex flex-col justify-between hover:bg-white/10 hover:border-white/30 transition-all duration-300"
              >
                <div>
                  <div className="flex gap-2 items-center text-secondary mb-3">
                    <Award className="w-5 h-5 shrink-0" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Accolade</h4>
                  </div>
                  <h3 className="font-display font-bold text-sm text-white mb-2">{ac.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{ac.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-background">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[12px] font-bold tracking-wider text-primary mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            JOURNEY MILESTONES
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-primary">
            Key Milestones & Participations
          </h2>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative border-l-2 border-primary/20 text-left space-y-12">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative pl-8 group">
              {/* Timeline marker */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-primary group-hover:bg-secondary group-hover:border-secondary transition-all duration-300"></div>
              
              <div>
                <span className="text-xs font-mono font-bold text-secondary uppercase tracking-widest bg-secondary/10 px-2.5 py-1 rounded-full">
                  {m.year}
                </span>
                <h3 className="font-display font-extrabold text-lg text-primary mt-3 mb-1">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team / Mentors / Advisors Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[12px] font-bold tracking-wider text-primary mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              PEOPLE BEHIND EDUMEASY
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-primary mb-4">
              Meet Our Visionary Board
            </h2>
            <p className="text-sm text-slate-500">
              Incubated by research graduates, senior engineering mentors, and educators working towards removing math anxiety.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary"></div>
            </div>
          ) : (
            <div className="space-y-24">
              {/* Core Innovators (TEAM) */}
              {teamMembers.length > 0 && (
                <div className="space-y-10 text-left">
                  <div className="border-b border-slate-200 pb-4 flex items-center gap-3">
                    <Users className="w-6 h-6 text-secondary" />
                    <h3 className="text-2xl font-display font-extrabold text-primary">Core Innovators</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((m) => (
                      <div
                        key={m.id}
                        className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group text-left"
                      >
                        <div className="space-y-6">
                          <div className="flex gap-4 items-center">
                            <MemberAvatar name={m.name} photoUrl={m.photoUrl || m.image} />
                            <div>
                              <h4 className="font-display font-bold text-base text-primary group-hover:text-secondary transition-colors">
                                {m.name}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                {m.role}
                              </p>
                              <p className="text-xs text-slate-500 font-medium mt-1 leading-snug">
                                {m.qualification}
                              </p>
                            </div>
                          </div>
                          {m.bio && (
                            <p className="text-xs text-slate-500 leading-relaxed font-body">
                              {m.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mentors & Directors */}
              {mentors.length > 0 && (
                <div className="space-y-10 text-left">
                  <div className="border-b border-slate-200 pb-4 flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-secondary" />
                    <h3 className="text-2xl font-display font-extrabold text-primary">Mentors & Directors</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {mentors.map((m) => (
                      <div
                        key={m.id}
                        className="bg-white border border-slate-200/60 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group text-left"
                      >
                        <div className="space-y-6">
                          <div className="flex gap-5 items-center">
                            <MemberAvatar name={m.name} photoUrl={m.photoUrl || m.image} />
                            <div>
                              <h4 className="font-display font-bold text-lg text-primary group-hover:text-secondary transition-colors">
                                {m.name}
                              </h4>
                              <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mt-0.5">
                                {m.role}
                              </p>
                              <p className="text-xs text-slate-500 font-medium mt-1 leading-snug">
                                {m.qualification}
                              </p>
                            </div>
                          </div>
                          {m.bio && (
                            <p className="text-xs text-slate-500 leading-relaxed font-body">
                              {m.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advisors */}
              {advisors.length > 0 && (
                <div className="space-y-10 text-left">
                  <div className="border-b border-slate-200 pb-4 flex items-center gap-3">
                    <Building className="w-6 h-6 text-secondary" />
                    <h3 className="text-2xl font-display font-extrabold text-primary">Advisors</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {advisors.map((m) => (
                      <div
                        key={m.id}
                        className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group text-left"
                      >
                        <div className="space-y-6">
                          <div className="flex gap-4 items-center">
                            <MemberAvatar name={m.name} photoUrl={m.photoUrl || m.image} />
                            <div>
                              <h4 className="font-display font-bold text-base text-primary group-hover:text-secondary transition-colors">
                                {m.name}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                {m.role}
                              </p>
                              <p className="text-xs text-slate-500 font-medium mt-1 leading-snug">
                                {m.qualification}
                              </p>
                            </div>
                          </div>
                          {m.bio && (
                            <p className="text-xs text-slate-500 leading-relaxed font-body">
                              {m.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Partner with Us Section */}
      <section className="py-24 bg-surface text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[12px] font-bold tracking-wider text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            COLLABORATION & PARTNERSHIPS
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-primary">
            Partner With Us
          </h2>
          
          <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            We look forward to working with esteemed institutions and supporting efforts in maximizing the field of education. We are confident we can meet the challenges ahead and stand ready to deliver effective, world-changing innovation in mathematics education.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-white px-8 py-3.5 rounded-xl font-body text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Get In Touch <ArrowRight className="w-4 h-4 text-white" />
            </Link>
            <a
              href="tel:8824661216"
              className="inline-flex items-center gap-2 border border-slate-300 hover:border-primary text-primary px-8 py-3.5 rounded-xl font-body text-xs font-bold hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <PhoneCall className="w-4 h-4 text-primary" /> +91-8824661216
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;
