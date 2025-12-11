import React from 'react';
import { motion } from 'framer-motion';

// 1. Define the animation variants
// This splits the "hidden" state and "visible" state for cleaner code
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Delay between each child animation
      delayChildren: 0.2,   // Initial delay before starting
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 }, // Start slightly below and transparent
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }, // smooth spring effect
  },
};

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      {/* 2. Attach the motion component and variants to the parent */}
      <motion.div
        className="text-center max-w-2xl px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 3. Use motion.element for children. They inherit the "hidden"/"visible" state automatically */}
        
        {/* Greeting / Pre-title */}
        <motion.p variants={itemVariants} className="text-blue-400 font-medium text-lg mb-4">
          Hi, my name is
        </motion.p>

        {/* Main Headline */}
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold mb-6">
          Alex Developer.
        </motion.h1>

        {/* Sub-headline */}
        <motion.p variants={itemVariants} className="text-xl text-gray-400 mb-8 leading-relaxed">
          I build accessible, pixel-perfect, and performant web experiences.
          Currently focusing on React and modern UI design.
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div variants={itemVariants} className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }} // Simple hover effect
            whileTap={{ scale: 0.95 }}   // Click effect
            className="px-8 py-3 bg-blue-500 rounded-full font-semibold hover:bg-blue-600 transition-colors"
          >
            View Projects
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 border border-gray-600 rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            Contact Me
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;