'use client';

import { useEffect, useRef, useState } from 'react';

export default function StatsSection() {
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
    // Animate count up for tests per month (0 to 150)
    const testsElement = document.querySelector('[data-count="150"]');
    if (testsElement) {
      animateCountUp(testsElement as HTMLElement, 0, 150, 2000);
    }

    // Animate count up for ARPU increase (0 to 340%)
    const arpuElement = document.querySelector('[data-count="340"]');
    if (arpuElement) {
      animateCountUpWithPercent(arpuElement as HTMLElement, 0, 340, 2500);
    }

    // Animate count down for setup time (30 to 5)
    const setupElement = document.querySelector('[data-count-down="30"]');
    if (setupElement) {
      animateCountDown(setupElement as HTMLElement, 30, 5, 2000);
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

  const animateCountDown = (element: HTMLElement, start: number, end: number, duration: number) => {
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start - (start - end) * easeOutQuart(progress));
      element.textContent = current.toString();
      
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
        <div ref={statsRef} className="grid md:grid-cols-3 gap-12 text-center">
          <div className="space-y-2">
            <div className="text-8xl lg:text-9xl font-bold text-black font-title" data-count="150">0</div>
            <p className="text-xl text-black font-medium">IAP tests per month</p>
            <p className="text-sm text-gray-600">vs 5-10 with manual updates</p>
          </div>
          
          <div className="space-y-2">
            <div className="text-8xl lg:text-9xl font-bold text-black font-title" data-count="340">0<span className="text-4xl lg:text-5xl">%</span></div>
            <p className="text-xl text-black font-medium">Higher ARPU</p>
            <p className="text-sm text-gray-600">than static IAP offers</p>
          </div>
          
          <div className="space-y-2">
            <div className="text-8xl lg:text-9xl font-bold text-black font-title" data-count-down="30" data-target="5">30</div>
            <p className="text-xl text-black font-medium">Minutes to integrate SDK</p>
            <p className="text-sm text-gray-600">vs weeks with custom solutions</p>
          </div>
        </div>
      </div>
    </section>
  );
}