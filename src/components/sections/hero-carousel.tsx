"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { heroSlides } from "@/data/products";
import { PauseIcon, PlayIcon } from "@/components/icons";

const slideGradients = [
  "linear-gradient(135deg, #c4b59a 0%, #8a7d6b 40%, #5c6b4f 100%)",
  "linear-gradient(160deg, #2a3a5c 0%, #4a6fa5 50%, #8aabcf 100%)",
  "linear-gradient(145deg, #6b5b4a 0%, #a89279 40%, #d4cfc5 100%)",
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [playing, next]);

  const slide = heroSlides[current];

  return (
    <section className="relative w-full overflow-hidden">
      {/* Slide content with image background */}
      <div
        className="relative transition-all duration-700 flex items-end px-6 md:px-16 pb-16 md:pb-24"
        style={{
          background: slideGradients[current % slideGradients.length],
          minHeight: "70vh",
        }}
      >
        {/* Background image */}
        {slide.image.startsWith("/images/") && (
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority
          />
        )}

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Text overlay at bottom-left */}
        <div className="relative z-10 max-w-xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.6px] text-white/70 mb-3">
            {slide.subtitle}
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-normal tracking-[0.6px] text-white mb-8 leading-tight">
            {slide.title}
          </h1>
          <div className="flex gap-3">
            {slide.ctaLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center justify-center px-6 py-2.5 text-[12px] font-medium uppercase tracking-[0.6px] text-white border border-white rounded-full hover:bg-white hover:text-charcoal transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === current ? "bg-white" : "bg-white/40"
            }`}
            aria-label={`Przejdź do slajdu ${i + 1}`}
          />
        ))}

        <button
          onClick={() => setPlaying((p) => !p)}
          className="ml-2 p-1 text-white/60 hover:text-white transition-colors"
          aria-label={playing ? "Wstrzymaj karuzelę" : "Odtwórz karuzelę"}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
    </section>
  );
}
