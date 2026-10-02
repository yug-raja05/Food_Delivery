import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { FALLBACK_MENU_ITEMS } from '../data/constants';

const CookingModalContext = createContext(null);

export const CookingModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const videoRef = useRef(null);
  const autoPlayTimerRef = useRef(null);

  const openCookingModal = useCallback((itemOrId) => {
    let item = null;
    if (typeof itemOrId === 'object' && itemOrId !== null) {
      item = itemOrId;
    } else {
      const idNum = parseInt(itemOrId, 10);
      item = FALLBACK_MENU_ITEMS.find((i) => i.id === idNum || i._id === itemOrId);
    }

    if (!item) {
      item = FALLBACK_MENU_ITEMS[0];
    }

    setActiveItem(item);
    setActiveStep(0);
    setIsPlaying(true);
    setIsMuted(true);
    setIsOpen(true);
    document.body.classList.add("modal-open");
  }, []);

  const closeCookingModal = useCallback(() => {
    setIsOpen(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
    document.body.classList.remove("modal-open");
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const setStep = (stepIndex) => {
    setActiveStep(stepIndex);
    if (videoRef.current && duration > 0 && activeItem?.cookingSteps?.length) {
      const stepDuration = duration / activeItem.cookingSteps.length;
      videoRef.current.currentTime = stepIndex * stepDuration;
    }
  };

  // Step Auto-play cycle
  useEffect(() => {
    if (isOpen && isPlaying && activeItem?.cookingSteps?.length > 1) {
      autoPlayTimerRef.current = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % activeItem.cookingSteps.length);
      }, 7000);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isOpen, isPlaying, activeItem]);

  return (
    <CookingModalContext.Provider
      value={{
        isOpen,
        activeItem,
        activeStep,
        isPlaying,
        isMuted,
        currentTime,
        duration,
        videoRef,
        openCookingModal,
        closeCookingModal,
        togglePlay,
        toggleMute,
        setStep,
        setCurrentTime,
        setDuration
      }}
    >
      {children}
    </CookingModalContext.Provider>
  );
};

export const useCookingModal = () => {
  const context = useContext(CookingModalContext);
  if (!context) {
    throw new Error("useCookingModal must be used within a CookingModalProvider");
  }
  return context;
};

export default CookingModalContext;
