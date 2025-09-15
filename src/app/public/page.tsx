'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Shield, 
  Eye, 
  BarChart3, 
  Zap, 
  ArrowRight,
  Lock,
  Brain,
  AlertTriangle,
  Upload,
  Bell
} from 'lucide-react';
import { useWakeUpContext } from '../components/WakeUpProvider';

const LandingPage: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const problemRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);
  const howRef = useRef<HTMLDivElement>(null);
  const [scanDone, setScanDone] = useState(false);
  
  const { isBackendAlive, isWakingUp } = useWakeUpContext();
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  const problemInView = useInView(problemRef, { once: true, margin: "-100px" });
  const whyInView = useInView(whyRef, { once: true, margin: "-100px" });
  const howInView = useInView(howRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

 
  useEffect(() => {
    const timer = setTimeout(() => setScanDone(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const painPoints = [
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Manual review is slow",
      description: "Banks lose millions daily while cases wait in queues.",
      color: "from-red-500 to-rose-600"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fraud evolves fast",
      description: "Static rules can’t keep up with new attack patterns.",
      color: "from-orange-500 to-amber-600"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "High false alarms",
      description: "Analysts waste time chasing false positives.",
      color: "from-yellow-500 to-emerald-500"
    }
  ];

  const whyBullets = [
    { icon: <Zap className="w-6 h-6" />, title: "Real-time detection", description: "ML/DL models score events as they happen." },
    { icon: <Brain className="w-6 h-6" />, title: "Explainability", description: "Understand exactly why a case was flagged." },
    { icon: <BarChart3 className="w-6 h-6" />, title: "Scalable & automated", description: "Built to handle millions of accounts." },
    { icon: <Shield className="w-6 h-6" />, title: "Proactive alerts", description: "Stop fraud before losses occur." }
  ];


  const teamMembers = [
    { name: 'Meganathan', role: 'AI & ML Engineer', photo: '/mascot-open.svg' },
    { name: 'Nizam Aashiq', role: 'ML Engineer', photo: '/mascot-open.svg' },
    { name: 'Priya Dharshini', role: 'Data Analyst', photo: '/mascot-open.svg' },
    { name: 'Abhinaya', role: 'Data Analyst', photo: '/mascot-open.svg' },
    { name: 'Shreen', role: 'Feature Engineering', photo: '/mascot-open.svg' },
    { name: 'Jeba Priya', role: 'Model Validation', photo: '/mascot-open.svg' },
    { name: 'Kavinmathi', role: 'Frontend', photo: '/mascot-open.svg' },
    { name: 'Madhu Sankar', role: 'Backend & Deployment', photo: '/mascot-open.svg' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Shield className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">FraudLens</span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#problem" className="text-gray-600 hover:text-blue-600 transition-colors">Problem</a>
              <a href="#why" className="text-gray-600 hover:text-blue-600 transition-colors">Why</a>
              <a href="#how" className="text-gray-600 hover:text-blue-600 transition-colors">How it works</a>
              <Link href="/auth/login" className="text-gray-600 hover:text-blue-600 transition-colors">Login</Link>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden lg:flex items-center space-x-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                <div className={`w-2 h-2 rounded-full ${
                  isWakingUp ? 'bg-yellow-400 animate-pulse' :
                  isBackendAlive ? 'bg-green-400' :
                  isBackendAlive === false ? 'bg-red-400' : 'bg-gray-400'
                }`} />
                <span className="text-xs text-gray-600">
                  {isWakingUp ? 'Waking up...' :
                   isBackendAlive ? 'Live' :
                   isBackendAlive === false ? 'Offline' : 'Checking...'}
                </span>
              </div>
              
              <Link 
                href="/auth/login"
                className="hidden sm:inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup"
                className="inline-flex items-center px-3 py-2 sm:px-6 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
                <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          style={{ 
            y, 
            opacity,
            backgroundColor: '#eaf8f4',
            backgroundImage: `
              radial-gradient(1200px 600px at 20% 20%, rgba(45,212,191,0.28), transparent 60%),
              radial-gradient(1000px 500px at 75% 25%, rgba(56,189,248,0.20), transparent 60%),
              radial-gradient(800px 400px at 50% 80%, rgba(16,185,129,0.16), transparent 60%)
            `,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(2,6,23,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(2,6,23,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 0 0'
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(closest-corner at 50% 50%, rgba(255,255,255,0) 60%, rgba(2,6,23,0.10) 100%)'
          }}
        />
        
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => {
            const seededRandom = (seed: number) => {
              const x = Math.sin(seed) * 10000;
              return x - Math.floor(x);
            };
            
            const left = seededRandom(i * 0.1) * 100;
            const top = seededRandom(i * 0.1 + 100) * 100;
            const duration = 3 + seededRandom(i * 0.1 + 200) * 2;
            const delay = seededRandom(i * 0.1 + 300) * 2;
            
            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.1, 0.35, 0.1],
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  delay: delay,
                }}
              />
            );
          })}
        </div>

        <motion.div
          className="absolute w-48 h-48 bg-gradient-to-r from-teal-400/15 to-sky-400/15 rounded-full blur-2xl pointer-events-none"
          animate={{
            x: mousePosition.x - 96,
            y: mousePosition.y - 96,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="w-full max-w-xl mx-auto md:mx-0 flex flex-col items-center md:items-start px-4 sm:px-0">
            <motion.h1 
                  className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-4 text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
                  AI-Powered Fraud Detection for Safer Banking
            </motion.h1>
            
            <motion.p 
                  className="text-lg sm:text-xl md:text-2xl text-slate-700 max-w-2xl text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
                  Detect fraudulent accounts in real-time with explainable AI.
            </motion.p>
            
            <motion.div 
                  className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link 
                    href="/dashboard"
                    className="group inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 w-full sm:w-auto"
              >
                    Try Demo
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
                  <a 
                    href="#problem"
                    className="group inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-slate-700 bg-white/80 border border-slate-200 rounded-xl hover:bg-white transition-all duration-200 backdrop-blur-sm shadow-sm w-full sm:w-auto"
                  >
                    Learn More
                  </a>
                </motion.div>
              </div>

              <div className="relative h-[280px] sm:h-[340px] md:h-[420px] lg:h-[460px] -translate-y-5 sm:-translate-y-10 md:-translate-y-4 px-4 sm:px-0">
                <motion.div 
                  className="absolute inset-0 flex items-end justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <div className="w-[88%] max-w-xl aspect-[5/3] rounded-[28px] border border-white/15 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(2,6,23,0.45)] overflow-hidden relative flex items-center justify-center">
                    <div className="pointer-events-none absolute inset-0 rounded-[28px]" style={{
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)'
                    }} />
                    <div className="pointer-events-none absolute inset-0 rounded-[28px] border-2 border-slate-300/50" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/8 to-transparent" />
                    <svg viewBox="0 0 340 210" className="relative h-auto" style={{ width: '85%', transform: 'translateY(4px) scaleY(1.2)' }}>
                      <defs>
                        <linearGradient id="colGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                          <stop offset="55%" stopColor="rgba(245,251,255,0.85)" />
                          <stop offset="100%" stopColor="rgba(226,232,240,0.75)" />
                        </linearGradient>
                        <linearGradient id="marble" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="rgba(255,255,255,0.98)" />
                          <stop offset="100%" stopColor="rgba(240,255,252,0.9)" />
                        </linearGradient>
                        <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(255,255,255,1)" />
                          <stop offset="100%" stopColor="rgba(56,189,248,0.55)" />
                        </linearGradient>
                        <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(167,243,208,0.55)" />
                          <stop offset="100%" stopColor="rgba(59,130,246,0.32)" />
                        </linearGradient>
                        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
                          <feOffset dy="2" result="off" />
                          <feMerge>
                            <feMergeNode in="off" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <linearGradient id="engrave" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                          <stop offset="100%" stopColor="rgba(255,255,255,0.55)" />
                        </linearGradient>
                      </defs>
 
 
                      <g filter="url(#softShadow)">
                        <rect x="46" y="164" width="248" height="12" rx="6" fill="url(#marble)" />
                        <rect x="62" y="152" width="216" height="10" rx="5" fill="url(#marble)" />
                        <rect x="76" y="142" width="188" height="8" rx="4" fill="rgba(203,213,225,0.75)" />
                      </g>
 
                      <g filter="url(#softShadow)">
                        <rect x="52" y="98" width="236" height="12" rx="6" fill="url(#marble)" />
                        <text x="170" y="95" textAnchor="middle" fontSize="16" letterSpacing="2.5" fill="rgba(15,23,42,0.65)" stroke="rgba(15,23,42,0.45)" strokeWidth="0.6">BANK</text>
                        <text x="170" y="94" textAnchor="middle" fontSize="16" letterSpacing="2.5" fill="rgba(255,255,255,0.98)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.25">BANK</text>
                      </g>
 
                      {Array.from({ length: 5 }).map((_, i) => {
                        const x = 74 + i * 42;
                        return (
                          <g key={i} filter="url(#softShadow)">
                            <rect x={x} y={108} width="22" height="46" rx="11" fill="url(#colGrad)" />
                            <rect x={x + 4} y={110} width="2" height="42" rx="1" fill="rgba(148,163,184,0.9)" />
                            <rect x={x + 9} y={110} width="2" height="42" rx="1" fill="rgba(100,116,139,0.9)" />
                            <rect x={x + 14} y={110} width="2" height="42" rx="1" fill="rgba(148,163,184,0.9)" />
                            <rect x={x - 6} y="102" width="34" height="8" rx="4" fill="rgba(255,255,255,0.98)" stroke="rgba(148,163,184,0.5)" strokeWidth="0.5" />
                            <rect x={x - 6} y="154" width="34" height="8" rx="4" fill="rgba(250,250,255,0.98)" stroke="rgba(148,163,184,0.5)" strokeWidth="0.5" />
                          </g>
                        );
                      })}
 
                      <g filter="url(#softShadow)">
                        <polygon points="170,34 272,92 68,92" fill="url(#roofGrad)" />
                        <polygon points="170,42 240,90 100,90" fill="url(#glass)" stroke="rgba(59,130,246,0.4)" strokeWidth="1" />
                        <line x1="170" y1="34" x2="170" y2="92" stroke="rgba(2,132,199,0.55)" strokeWidth="2" />
                      </g>
 
                      <g opacity="0.25">
                        <rect x="152" y="118" width="36" height="30" rx="4" fill="url(#glass)" stroke="rgba(71,85,105,0.25)" strokeWidth="0.5" />
                      </g>

                      <g pointerEvents="none">
                        <text x="170" y="94" textAnchor="middle" fontSize="16" letterSpacing="2.5" fill="rgba(255,255,255,0.98)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.25">BANK</text>
                        <text x="170" y="95" textAnchor="middle" fontSize="16" letterSpacing="2.5" fill="rgba(15,23,42,0.65)" stroke="rgba(15,23,42,0.45)" strokeWidth="0.6">BANK</text>
                      </g>
                    </svg>
                  </div>
                </motion.div>

                {!scanDone && (
                  <motion.div
                    className="absolute"
                    initial={{ left: '10%', top: '30%' }}
                    animate={{
                      left: ['10%', '66%', '10%'],
                      top: ['30%', '60%', '30%']
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="relative">
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-64 h-64 rounded-full bg-sky-500/20 blur-2xl" />
                      <div className="w-36 h-36 drop-shadow-[0_10px_30px_rgba(2,132,199,0.35)]">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <defs>
                            <radialGradient id="lensGlow" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="rgba(56,189,248,0.55)" />
                              <stop offset="80%" stopColor="rgba(56,189,248,0.18)" />
                              <stop offset="100%" stopColor="rgba(56,189,248,0.0)" />
                            </radialGradient>
                            <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                              <stop offset="100%" stopColor="rgba(2,132,199,0.85)" />
                            </linearGradient>
                            <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="rgba(186,230,253,0.6)" />
                              <stop offset="100%" stopColor="rgba(2,132,199,0.45)" />
                            </linearGradient>
                          </defs>
                          <circle cx="38" cy="38" r="30" fill="url(#lensGlow)" />
                          <g transform="translate(52,52) rotate(35)">
                            <rect x="0" y="0" width="32" height="8" rx="4" fill="rgba(2,132,199,0.9)" />
                            <rect x="2" y="2" width="28" height="4" rx="2" fill="rgba(255,255,255,0.65)" />
                          </g>
                          <circle cx="38" cy="38" r="22" fill="url(#glassGrad)" stroke="url(#rim)" strokeWidth="4" />
                          <circle cx="38" cy="38" r="24" fill="none" stroke="rgba(2,132,199,0.8)" strokeWidth="2" />
                          <path d="M20,34 C26,24 48,20 58,28" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="3" strokeLinecap="round" />
                          <path d="M19,42 C25,50 51,53 60,44" fill="none" stroke="rgba(2,132,199,0.3)" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                )}

                {scanDone && (
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="absolute" style={{ top: '38%', right: '10%' }}>
                      <div className="relative">
                        <div className="absolute -inset-4 rounded-xl bg-gradient-to-b from-teal-400/20 to-blue-500/10 blur-xl" />
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center border border-white/25 shadow-[0_6px_24px_rgba(16,185,129,0.35)]">
                          <Shield className="w-7 h-7 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute left-1/2 top-[40%] -translate-x-1/2">
                      <div className="backdrop-blur-md bg-white border border-emerald-300 rounded-full px-4 py-1.5 text-teal-800 font-semibold text-sm shadow-[0_4px_20px_rgba(2,6,23,0.15)] inline-flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-800" />
                        Guarded
                      </div>
                    </div>
            </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      <section id="problem" ref={problemRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={problemInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">The Challenge</h2>
            <p className="text-2xl md:text-2xl  text-gray-900 mb-4">Why traditional approaches fail in today&apos;s fraud landscape.</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            initial={{ opacity: 0 }}
            animate={problemInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {painPoints.map((item, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                animate={problemInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${item.color} rounded-2xl mb-4 sm:mb-6 text-white`}>
                  <div className="w-6 h-6 sm:w-8 sm:h-8">{item.icon}</div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="why" ref={whyRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={whyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Why FraudLens AI?</h2>
            <p className="text-2xl md:text-2xl  text-gray-900 mb-4">Built for speed, scale, and clarity—without the false alarms.</p>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0 }}
            animate={whyInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 to-teal-50 p-6 md:p-8 overflow-hidden">
              <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-teal-200/30 blur-3xl" />
              <ul className="divide-y divide-slate-200/70">
                {whyBullets.map((feature, index) => (
                  <motion.li
                key={index}
                    className="py-5 first:pt-0 last:pb-0"
                    initial={{ opacity: 0, y: 14 }}
                    animate={whyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                  >
                    <div className="group flex items-start gap-5">
                      <div className="relative shrink-0">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 opacity-20 blur-md transition-opacity group-hover:opacity-30" />
                        <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 text-white shadow-[0_8px_24px_rgba(16,185,129,0.25)]">
                  {feature.icon}
                </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                          <span className="text-teal-700/70 text-sm hidden sm:inline">Why it matters</span>
                        </div>
                        <p className="text-slate-600 mt-1 leading-relaxed">
                          {feature.description}
                        </p>
                        <div className="mt-3 h-1 w-0 group-hover:w-24 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full transition-all duration-300" />
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="how" ref={howRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={howInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How It Works</h2>
            <p className="text-2xl md:text-2xl  text-gray-900 mb-4">A simple, explainable flow from data to decisions.</p>
          </motion.div>

          <motion.ol 
            className="relative mx-auto max-w-3xl px-4 sm:px-0"
            initial={{ opacity: 0 }}
            animate={howInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-slate-200 via-slate-200/60 to-transparent" />
            {[{
              icon: <Upload className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Upload/Connect", desc: "Securely connect or upload bank data."
            },{
              icon: <Brain className="w-4 h-4 sm:w-5 sm:h-5" />, title: "AI Analysis", desc: "Models learn patterns from historical signals."
            },{
              icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Probability Score", desc: "Each account gets an interpretable risk score."
            },{
              icon: <Bell className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Alerts & Insights", desc: "Prioritized alerts with reasons and actions."
            }].map((step, index) => (
              <li key={index} className="relative pl-16 sm:pl-20 pb-8 sm:pb-10 last:pb-0">
                <div className="absolute left-0 top-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <span className="absolute -z-10 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-teal-500/10" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">{index + 1}</span>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-[0_6px_24px_rgba(2,6,23,0.06)]">
                  <div className="flex items-center gap-2 sm:gap-3 text-teal-700 font-medium mb-2">
                    <div className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-md bg-teal-50 text-teal-600">
                      {step.icon}
                    </div>
                    <span className="text-sm sm:text-base">{step.title}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">{step.desc}</p>
                </div>
              </li>
            ))}
          </motion.ol>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-emerald-500 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">Experience It in Action</h2>
            <p className="text-lg sm:text-xl md:text-2xl text-emerald-50 mb-6 sm:mb-4">Try our interactive demo with sample data or your own.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Link 
                href="/dashboard"
                className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-emerald-700 bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-xl hover:bg-white transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 w-full sm:w-auto"
              >
                Try Our Demo
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link 
                href="/auth/login"
                className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-white border-2 border-white/70 rounded-xl hover:bg-white/20 transition-all duration-200 w-full sm:w-auto"
              >
                <Lock className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About the Team</h2>
            <p className="text-lg sm:text-xl md:text-2xl text-black-50 mb-6 sm:mb-4">Eight builders passionate about making banking safer.</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {teamMembers.map((m, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto rounded-full bg-gray-100 overflow-hidden mb-3 sm:mb-4 flex items-center justify-center">
                  <Image src={m.photo} alt={m.name} width={64} height={64} className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 opacity-70" />
                </div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base">{m.name}</div>
                <div className="text-gray-600 text-xs sm:text-sm">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold">FraudLens</span>
              </div>
              <p className="text-gray-400 text-sm sm:text-base">
                Advanced AI-powered fraud detection for modern businesses.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 FraudLens. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
