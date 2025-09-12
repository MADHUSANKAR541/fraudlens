'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MascotProps {
  isPasswordFocused?: boolean;
  className?: string;
}

const Mascot: React.FC<MascotProps> = ({ isPasswordFocused = false, className = '' }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isEyesClosed, setIsEyesClosed] = useState(false);

  // Auto-blink animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (!isPasswordFocused) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, [isPasswordFocused]);

  // Close eyes when password is focused
  useEffect(() => {
    if (isPasswordFocused) {
      setIsEyesClosed(true);
    } else {
      setIsEyesClosed(false);
    }
  }, [isPasswordFocused]);

  return (
    <div className={`mascot-container ${className}`}>
      <motion.div
        className="mascot"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Mascot Body */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mascot-svg"
        >
          {/* Body */}
          <motion.ellipse
            cx="60"
            cy="80"
            rx="35"
            ry="25"
            fill="url(#bodyGradient)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          />
          
          {/* Head */}
          <motion.circle
            cx="60"
            cy="50"
            r="30"
            fill="url(#headGradient)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          />
          
          {/* Ears */}
          <motion.ellipse
            cx="45"
            cy="30"
            rx="8"
            ry="12"
            fill="url(#earGradient)"
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: -15 }}
            transition={{ delay: 0.3, duration: 0.2 }}
          />
          <motion.ellipse
            cx="75"
            cy="30"
            rx="8"
            ry="12"
            fill="url(#earGradient)"
            initial={{ scale: 0, rotate: 15 }}
            animate={{ scale: 1, rotate: 15 }}
            transition={{ delay: 0.3, duration: 0.2 }}
          />
          
          {/* Inner Ears */}
          <motion.ellipse
            cx="45"
            cy="32"
            rx="4"
            ry="6"
            fill="#FF8A80"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.2 }}
          />
          <motion.ellipse
            cx="75"
            cy="32"
            rx="4"
            ry="6"
            fill="#FF8A80"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.2 }}
          />
          
          {/* Eyes */}
          <AnimatePresence mode="wait">
            {!isEyesClosed && !isBlinking ? (
              <motion.g
                key="open-eyes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                {/* Left Eye */}
                <motion.ellipse
                  cx="50"
                  cy="45"
                  rx="6"
                  ry="8"
                  fill="white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.2 }}
                />
                <motion.circle
                  cx="50"
                  cy="45"
                  r="4"
                  fill="#0D1B2A"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.2 }}
                />
                <motion.circle
                  cx="51"
                  cy="43"
                  r="1.5"
                  fill="white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.1 }}
                />
                
                {/* Right Eye */}
                <motion.ellipse
                  cx="70"
                  cy="45"
                  rx="6"
                  ry="8"
                  fill="white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.2 }}
                />
                <motion.circle
                  cx="70"
                  cy="45"
                  r="4"
                  fill="#0D1B2A"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.2 }}
                />
                <motion.circle
                  cx="71"
                  cy="43"
                  r="1.5"
                  fill="white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.1 }}
                />
              </motion.g>
            ) : (
              <motion.g
                key="closed-eyes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                {/* Closed Eyes */}
                <motion.path
                  d="M 44 45 Q 50 47 56 45"
                  stroke="#0D1B2A"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.path
                  d="M 64 45 Q 70 47 76 45"
                  stroke="#0D1B2A"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.g>
            )}
          </AnimatePresence>
          
          {/* Nose */}
          <motion.polygon
            points="60,50 55,55 65,55"
            fill="#FF8A80"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, duration: 0.2 }}
          />
          
          {/* Mouth */}
          <motion.path
            d="M 55 60 Q 60 65 65 60"
            stroke="#0D1B2A"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.9, duration: 0.3 }}
          />
          
          {/* Whiskers */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.3 }}
          >
            <motion.line
              x1="35"
              y1="55"
              x2="45"
              y2="55"
              stroke="#0D1B2A"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.1, duration: 0.2 }}
            />
            <motion.line
              x1="35"
              y1="60"
              x2="45"
              y2="58"
              stroke="#0D1B2A"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.2, duration: 0.2 }}
            />
            <motion.line
              x1="75"
              y1="55"
              x2="85"
              y2="55"
              stroke="#0D1B2A"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.1, duration: 0.2 }}
            />
            <motion.line
              x1="75"
              y1="60"
              x2="85"
              y2="58"
              stroke="#0D1B2A"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.2, duration: 0.2 }}
            />
          </motion.g>
          
          {/* Tail */}
          <motion.path
            d="M 25 80 Q 15 70 20 60 Q 25 50 30 60 Q 35 70 25 80"
            fill="url(#tailGradient)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
          />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#42A5F5" />
              <stop offset="100%" stopColor="#1565C0" />
            </linearGradient>
            <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#42A5F5" />
              <stop offset="100%" stopColor="#0D47A1" />
            </linearGradient>
            <linearGradient id="earGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#42A5F5" />
              <stop offset="100%" stopColor="#0D47A1" />
            </linearGradient>
            <linearGradient id="tailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#42A5F5" />
              <stop offset="100%" stopColor="#1565C0" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Floating particles */}
        <div className="particles">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [0, -20, -40],
                x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      </motion.div>
      
      <style jsx>{`
        .mascot-container {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          padding: 2rem;
        }
        
        .mascot {
          position: relative;
          cursor: pointer;
        }
        
        .mascot-svg {
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }
        
        .particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
        
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: linear-gradient(45deg, #00BFA6, #42A5F5);
          border-radius: 50%;
          top: 50%;
          left: 50%;
        }
        
        @media (max-width: 768px) {
          .mascot-container {
            padding: 1rem;
          }
          
          .mascot-svg {
            width: 80px;
            height: 80px;
          }
        }
      `}</style>
    </div>
  );
};

export default Mascot;
