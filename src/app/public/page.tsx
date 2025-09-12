'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Eye, 
  BarChart3, 
  Zap, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Play,
  Star,
  TrendingUp,
  Lock,
  Brain
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Advanced ML Detection",
      description: "State-of-the-art machine learning algorithms that detect fraud patterns with 99.7% accuracy.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Real-time Monitoring",
      description: "Monitor transactions in real-time with instant alerts and automated responses.",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Comprehensive Analytics",
      description: "Deep insights and visualizations to understand fraud patterns and trends.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Process millions of transactions per second with sub-millisecond response times.",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collaboration",
      description: "Collaborate with your team using shared dashboards and real-time notifications.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Explainable AI",
      description: "Understand why decisions were made with transparent, explainable AI models.",
      color: "from-red-500 to-red-600"
    }
  ];

  const stats = [
    { number: "99.7%", label: "Detection Accuracy", icon: <CheckCircle className="w-6 h-6" /> },
    { number: "< 1ms", label: "Response Time", icon: <Zap className="w-6 h-6" /> },
    { number: "10M+", label: "Transactions/Day", icon: <TrendingUp className="w-6 h-6" /> },
    { number: "500+", label: "Enterprise Clients", icon: <Users className="w-6 h-6" /> }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Head of Security, TechCorp",
      content: "FraudLens has reduced our false positives by 85% while catching 99.7% of actual fraud attempts.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "CTO, FinanceFlow",
      content: "The explainable AI features help us understand and improve our fraud detection strategies.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Risk Manager, GlobalBank",
      content: "Implementation was seamless and the results exceeded our expectations from day one.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Navigation */}
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
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FraudLens</span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <Link href="/auth/login" className="text-gray-600 hover:text-blue-600 transition-colors">Login</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login"
                className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup"
                className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600"
          style={{ y, opacity }}
        />
        
        {/* Floating Elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Mouse Follower */}
        <motion.div
          className="absolute w-64 h-64 bg-gradient-to-r from-blue-400/20 to-teal-400/20 rounded-full blur-3xl pointer-events-none"
          animate={{
            x: mousePosition.x - 128,
            y: mousePosition.y - 128,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Detect Fraud with
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                AI Precision
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Advanced machine learning algorithms that protect your business from fraud with 99.7% accuracy and real-time monitoring.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link 
                href="/auth/signup"
                className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <motion.button 
                className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
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

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 50 }}
            animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl mb-4 text-white">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for
              <span className="block text-transparent bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text">
                Fraud Detection
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools and advanced AI to protect your business from sophisticated fraud attempts.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={featuresInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers say about FraudLens
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 rounded-2xl p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Protect Your Business?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of companies already using FraudLens to detect and prevent fraud.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/signup"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="/auth/login"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                <Lock className="mr-2 w-5 h-5" />
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">FraudLens</span>
              </div>
              <p className="text-gray-400">
                Advanced AI-powered fraud detection for modern businesses.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FraudLens. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
