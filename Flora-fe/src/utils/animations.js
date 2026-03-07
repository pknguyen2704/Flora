// Animation variants for modern, layout-synced animations across the app

// Page transition animations (optimized for performance)
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 10, // Reduced from 20 for faster feel
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -10,
  },
};

export const pageTransition = {
  type: 'spring',
  stiffness: 260,
  damping: 30,
  mass: 0.5,
  restDelta: 0.001,
};

// Standard high-performance spring for 120Hz displays
export const smoothSpring = {
  type: "spring",
  stiffness: 260,
  damping: 30,
  mass: 0.5,
  restDelta: 0.001
};

// Container with stagger children (optimized)
export const containerVariants = {
  hidden: { 
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.04, // Slightly faster stagger
      delayChildren: 0.02,
      ...smoothSpring
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
      duration: 0.2
    },
  },
};

// Card/Item animations (optimized spring physics for 120Hz)
export const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 15,
    scale: 0.98,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      ...smoothSpring
    },
  },
  exit: {
    opacity: 0,
    y: -15,
    scale: 0.97,
    transition: {
      duration: 0.15, // Faster exit
    },
  },
};

// Fade in from sides (optimized)
export const fadeInFromLeft = {
  hidden: { opacity: 0, x: -20 }, // Reduced from -30
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 15,
    },
  },
};

export const fadeInFromRight = {
  hidden: { opacity: 0, x: 20 }, // Reduced from 30
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 15,
    },
  },
};

// Scale pop animation
export const scalePopVariants = {
  initial: { 
    scale: 0.8, 
    opacity: 0 
  },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// Slide up animation
export const slideUpVariants = {
  hidden: { 
    y: 40, 
    opacity: 0 
  },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

// Layout-aware animations (preserves layout during animations)
export const layoutAwareVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.98,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      layout: {
        duration: 0.3,
      },
    },
  },
};

// Hover animations (GPU accelerated)
export const hoverScale = {
  scale: 1.02,
  transition: {
    type: 'spring',
    stiffness: 500, // Very snappy
    damping: 20,
  },
};

export const hoverLift = {
  y: -4,
  transition: {
    type: 'spring',
    stiffness: 500,
    damping: 20,
  },
};

// Tap animations (instant feel)
export const tapScale = {
  scale: 0.98,
  transition: {
    duration: 0.1, // Very fast
  },
};

// List item animations with layout
export const listItemVariants = {
  hidden: { 
    opacity: 0, 
    x: -20,
  },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      delay: i * 0.05,
    },
  }),
};

// Modal/Dialog animations
export const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

// Backdrop animation
export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};
