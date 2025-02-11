import { ReactNode, useState } from "react";
import { motion } from "framer-motion";

interface TooltipProps {
  children: ReactNode;
  text: string;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip: React.FC<TooltipProps> = ({ children, text, position = "top" }) => {
  const [visible, setVisible] = useState(false);

  const positionClasses: Record<string, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: " bottom-5 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className={`absolute whitespace-nowrap ${text ? "bg-gray-500" : ""}  text-white text-[10px] py-1 px-2 rounded shadow-lg ${positionClasses[position]}`}
        >
          {text}
        </motion.div>
      )}
    </div>
  );
};

export default Tooltip;
