import React, { useState, useEffect } from 'react';
import './TypingAnimation.css';

interface TypingAnimationProps {
  words: string[];
  className?: string;
  onComplete?: () => void;
  delay?: number;
  cycleDelay?: number;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ 
  words, 
  className, 
  onComplete,
  delay = 500,
  cycleDelay = 2000
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Start animation after delay
    const startTimeout = setTimeout(() => {
      setIsActive(true);
      onComplete?.();
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay, onComplete]);

  useEffect(() => {
    if (!isActive) return;

    const currentWord = words[currentWordIndex];
    
    if (displayText.length < currentWord.length) {
      // Continue typing the current word
      const timeout = setTimeout(() => {
        setDisplayText(currentWord.slice(0, displayText.length + 1));
      }, 80);
      return () => clearTimeout(timeout);
    } else {
      // Word is complete, wait then move to next word
      const timeout = setTimeout(() => {
        setDisplayText('');
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }, cycleDelay);
      return () => clearTimeout(timeout);
    }
  }, [isActive, displayText, currentWordIndex, words, cycleDelay]);

  if (!isActive) {
    return <span className={className}></span>;
  }

  return (
    <span className={`${className} typing-text`}>
      {displayText}
      <span className="typing-cursor">|</span>
    </span>
  );
};

export default TypingAnimation; 