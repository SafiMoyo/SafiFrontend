import { MouseEvent, ReactNode, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type Props = {
  children: ReactNode;
};
const MagneticLink = ({ children }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;

    const { height, width, left, top } = (ref.current as HTMLDivElement).getBoundingClientRect();

    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX, y: middleY });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  return (
    <motion.div
      className='relative'
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}>
      {children}
    </motion.div>
  );
};
export default MagneticLink;
