"use client";

import Image from 'next/image';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const LazyImage = ({ src, alt, className = "", fill = false, width, height, sizes = "", priority = false }) => {
  const { targetRef, hasIntersected } = useIntersectionObserver({
    rootMargin: '50px',
    threshold: 0
  });

  const containerStyle = fill ? {
    position: 'absolute',
    inset: 0,
    height: '100%',
    width: '100%'
  } : {
    width: width,
    height: height,
    position: 'relative'
  };

  return (
    <div ref={targetRef} className={`${fill ? 'absolute inset-0' : 'relative'}`} style={containerStyle}>
      {hasIntersected ? (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          sizes={sizes}
          priority={priority}
          className={`${className} ${fill ? 'absolute inset-0' : ''}`}
        />
      ) : (
        <div 
          className={`bg-black-200 animate-pulse flex items-center justify-center ${className}`} 
          style={{
            position: fill ? 'absolute' : 'relative',
            inset: fill ? 0 : undefined,
            width: fill ? '100%' : width,
            height: fill ? '100%' : height,
            aspectRatio: !fill && width && height ? width / height : undefined
          }}
        >
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default LazyImage; 