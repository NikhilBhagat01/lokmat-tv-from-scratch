'use client';

import Image from 'next/image';
import { useState } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const LazyImage = ({ src, alt, className = '', fill = false, width, height, sizes = '', priority = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { targetRef, hasIntersected } = useIntersectionObserver({
    rootMargin: '50px',
    threshold: 0,
  });

  const containerStyle = fill
    ? {
        position: 'absolute',
        inset: 0,
        height: '100%',
        width: '100%',
      }
    : {
        width: width,
        height: height,
        position: 'relative',
      };

  return (
    <div ref={targetRef} className={`${fill ? 'absolute inset-0' : 'relative'}`} style={containerStyle}>
      {hasIntersected ? (
        <>
          <Image
            src={src}
            alt={alt}
            fill={fill}
            width={!fill ? width : undefined}
            height={!fill ? height : undefined}
            sizes={sizes}
            priority={priority}
            className={`
              ${className} 
              ${fill ? 'absolute inset-0' : ''} 
              transition-opacity duration-500 ease-in-out
              ${isLoading ? 'opacity-0' : 'opacity-100'}
            `}
            onLoad={() => setIsLoading(false)}
            quality={75}
            loading={priority ? 'eager' : 'lazy'}
          />
          {isLoading && (
            <div
              className={`absolute inset-0 animate-pulse bg-neutral-800/90 ${className}`}
              style={{
                position: fill ? 'absolute' : 'relative',
                inset: fill ? 0 : undefined,
                width: fill ? '100%' : width,
                height: fill ? '100%' : height,
                aspectRatio: !fill && width && height ? width / height : undefined,
              }}
            />
          )}
        </>
      ) : (
        <div
          className={`bg-neutral-800/90 animate-pulse ${className}`}
          style={{
            position: fill ? 'absolute' : 'relative',
            inset: fill ? 0 : undefined,
            width: fill ? '100%' : width,
            height: fill ? '100%' : height,
            aspectRatio: !fill && width && height ? width / height : undefined,
          }}
        />
      )}
    </div>
  );
};

export default LazyImage;
