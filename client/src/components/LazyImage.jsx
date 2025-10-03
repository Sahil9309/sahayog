import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = null,
  onLoad = () => {},
  onError = () => {},
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad();
  };

  const handleError = () => {
    setHasError(true);
    onError();
  };

  return (
    <div ref={imgRef} className={`relative ${className}`} {...props}>
      {!isInView && (
        <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
          {placeholder || (
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          )}
        </div>
      )}
      
      {isInView && !hasError && (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              {placeholder || (
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              )}
            </div>
          )}
          <img
            src={src}
            alt={alt}
            className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
          />
        </>
      )}
      
      {hasError && (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-2"></div>
            <span className="text-xs">Failed to load</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;