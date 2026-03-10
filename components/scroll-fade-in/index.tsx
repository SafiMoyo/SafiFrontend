'use client';

import { motion, useInView } from 'framer-motion';
import React, { useRef } from 'react';

type Props = {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
  className?: string;
};

const ScrollFadeIn = ({
  children,
  direction = 'up',
  duration = 0.5,
  delay = 0,
  className
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const getVariants = () => {
    let x = 0,
      y = 0;
    switch (direction) {
      case 'left':
        x = -100;
        break;
      case 'right':
        x = 100;
        break;
      case 'up':
        y = 100;
        break;
      case 'down':
        y = -100;
        break;
      default:
        break;
    }

    return {
      hidden: { opacity: 0, x, y },
      visible: { opacity: 1, x: 0, y: 0 }
    };
  };

  return (
    <motion.div
      ref={ref}
      initial='hidden'
      animate={inView ? 'visible' : 'hidden'}
      variants={getVariants()}
      className={className}
      transition={{
        duration,
        delay,
        type: 'spring',
        stiffness: 80,
        damping: 20
      }}>
      {children}
    </motion.div>
  );
};

export default ScrollFadeIn;
