import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      backgroundColor: "transparent",
      border: "2px solid rgba(102, 126, 234, 0.6)",
      height: 32,
      width: 32,
      transition: {
        type: "spring",
        mass: 0.15,
        damping: 15,
        stiffness: 150
      }
    },
    hover: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      backgroundColor: "rgba(118, 75, 162, 0.2)",
      border: "2px solid rgba(118, 75, 162, 0.8)",
      height: 48,
      width: 48,
      scale: 1.2,
      transition: {
        type: "spring",
        mass: 0.1,
        damping: 10,
        stiffness: 120
      }
    }
  };

  const dotVariants = {
    default: {
      x: mousePosition.x - 4,
      y: mousePosition.y - 4,
    }
  };

  return (
    <>
      {/* Hide default cursor globally on non-touch devices */}
      <style>
        {`
          @media (pointer: fine) {
            body {
              cursor: none;
            }
            a, button, [role="button"], input, select, textarea {
              cursor: none !important;
            }
          }
        `}
      </style>
      <div className="custom-cursor-container" style={{ display: 'block' }}>
        <motion.div
          variants={variants}
          animate={isHovering ? "hover" : "default"}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        />
        <motion.div
          variants={dotVariants}
          animate="default"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: 8,
            height: 8,
            backgroundColor: isHovering ? '#764ba2' : '#667eea',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 10000,
            boxShadow: '0 0 8px rgba(102, 126, 234, 0.8)'
          }}
        />
      </div>
    </>
  );
};

export default CustomCursor;
