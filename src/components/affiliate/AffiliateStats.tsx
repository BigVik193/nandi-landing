'use client';

import { useEffect, useRef, useState } from 'react';

export default function AffiliateStats() {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const animateCounters = () => {
    // Animate tests per day
    const testsElement = document.querySelector('[data-count="500"]');
    if (testsElement) {
      animateCountUp(testsElement as HTMLElement, 0, 500, 2000);
    }

    // Animate ROI increase
    const roiElement = document.querySelector('[data-count="312"]');
    if (roiElement) {
      animateCountUpWithPercent(roiElement as HTMLElement, 0, 312, 2500);
    }

    // Animate hours saved
    const hoursElement = document.querySelector('[data-count="40"]');
    if (hoursElement) {
      animateCountUp(hoursElement as HTMLElement, 0, 40, 2000);
    }
  };

  const animateCountUp = (element: HTMLElement, start: number, end: number, duration: number) => {
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (end - start) * easeOutQuart(progress));
      element.textContent = current.toString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  const animateCountUpWithPercent = (element: HTMLElement, start: number, end: number, duration: number) => {
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (end - start) * easeOutQuart(progress));
      element.innerHTML = `${current}<span class="text-4xl lg:text-5xl">%</span>`;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  const easeOutQuart = (t: number): number => {
    return 1 - Math.pow(1 - t, 4);
  };

  return (
    <section className="bg-pricing py-24">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-medium text-black leading-tight font-title">
            Numbers that matter
          </h2>
        </div>
        
        <div ref={statsRef} className="grid md:grid-cols-3 gap-12 text-center">
          <div className="space-y-2">
            <div className="text-8xl lg:text-9xl font-bold text-black font-title" data-count="500">0</div>
            <p className="text-xl text-black font-medium">Tests per day</p>
            <p className="text-sm text-gray-600">vs 5-10 manually</p>
          </div>
          
          <div className="space-y-2">
            <div className="text-8xl lg:text-9xl font-bold text-black font-title" data-count="312">
              0<span className="text-4xl lg:text-5xl">%</span>
            </div>
            <p className="text-xl text-black font-medium">Average ROI increase</p>
            <p className="text-sm text-gray-600">in first 30 days</p>
          </div>
          
          <div className="space-y-2">
            <div className="text-8xl lg:text-9xl font-bold text-black font-title" data-count="40">0</div>
            <p className="text-xl text-black font-medium">Hours saved weekly</p>
            <p className="text-sm text-gray-600">on landing page optimization</p>
          </div>
        </div>
      </div>
    </section>
  );
}