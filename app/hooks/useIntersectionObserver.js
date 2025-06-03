"use client";

import { useEffect, useRef, useState } from 'react';

const useIntersectionObserver = (options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasIntersected, setHasIntersected] = useState(false);
    const targetRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
            if (entry.isIntersecting && !hasIntersected) {
                setHasIntersected(true);
            }
        }, {
            root: options.root || null,
            rootMargin: options.rootMargin || '0px',
            threshold: options.threshold || 0
        });

        const currentTarget = targetRef.current;

        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [options.root, options.rootMargin, options.threshold, hasIntersected]);

    return { targetRef, isIntersecting, hasIntersected };
}

export default useIntersectionObserver; 