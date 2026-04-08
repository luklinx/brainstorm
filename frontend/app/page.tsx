'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

const heroSlides = [
  {
    title: 'Skills for jobs, built for today.',
    subtitle: 'Practical training with online support, wherever you are.',
    featureText: 'Hands-on courses, real industry outcomes.',
    badges: ['TVET', 'Soft Skills', 'Career Coaching'],
    image: '/assets/hero_1.jpg',
  },
  {
    title: 'Start learning in 30 seconds.',
    subtitle: 'Affordable intro programs with job placement guidance.',
    featureText: 'Apply what you learn from day one.',
    badges: ['Live Mentors', 'Industry Projects', 'Certification'],
    image: '/assets/hero_2.JPG',
  },
  {
    title: 'Build your future with us.',
    subtitle: 'Join a community of learners and achieve real results.',
    featureText: 'From basics to advanced skills.',
    badges: ['Community', 'Progress Tracking', 'Support'],
    image: '/assets/hero_3.jpg',
  },
]

const programTiles = [
  {
    icon: '💄',
    title: 'Beauty & Wellness',
    subtitle: 'Professional salon training & entrepreneurship',
    mode: 'Offline + Online',
  },
  {
    icon: '💡',
    title: 'Electrical Installation',
    subtitle: 'Industry-ready practical electrical skills',
    mode: 'Blended Learning',
  },
  {
    icon: '💻',
    title: 'ICT & Networking',
    subtitle: 'Computer networking, hardware, and software support',
    mode: 'Online & Hybrid',
  },
  {
    icon: '👗',
    title: 'Fashion Design',
    subtitle: 'Design, tailoring, and style business coaching',
    mode: 'In-person Studio',
  },
  {
    icon: '🎨',
    title: 'Painting & Interior Design',
    subtitle: 'Creative decor, finishing and space styling',
    mode: 'Hands-on Practical',
  },
  {
    icon: '🍽️',
    title: 'Catering & Hospitality',
    subtitle: 'Hospitality service, catering and event skills',
    mode: 'Blended Programs',
  },
]

const testimonials = [
  {
    name: 'Aisha Musa',
    role: 'Beauty Therapy Graduate',
    quote: 'Brainstorm Academy helped me launch a freelance salon business within 3 months.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Emeka Okafor',
    role: 'ICT Apprentice',
    quote: 'The blended course was practical, affordable, and helped me secure an IT support role.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Zainab Yusuf',
    role: 'Fashion Designer',
    quote: 'I learnt real tailoring and business skills that work in Kaduna market.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  },
]

const partners = [
  'NBTE',
  'KSQAB',
  'CPN',
  'ITPN',
  'NIGERIA TECH HUB',
  'YOUTH SKILLS FUND',
]

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0)
  const touchStartXRef = useRef(0)
  const touchEndXRef = useRef(0)
  const minSwipeDistance = 50

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartXRef.current = event.touches[0].clientX
    touchEndXRef.current = event.touches[0].clientX
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    touchEndXRef.current = event.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const distance = touchStartXRef.current - touchEndXRef.current
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        setActiveSlide((current) => (current + 1) % heroSlides.length)
      } else {
        setActiveSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length)
      }
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 pt-24">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <nav className="container-fluid py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#0A6C3F] rounded-xl flex items-center justify-center shadow-md shadow-[#0A6C3F]/10">
              <span className="text-white font-bold">BA</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0A6C3F] tracking-[0.22em] uppercase">Brainstorm Academy</p>
              <p className="text-xs text-gray-500">Practical skills education</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="btn btn-ghost text-sm px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="btn btn-primary text-sm px-6 py-2"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Slider Section */}
      <section className="relative min-h-[calc(100vh-96px)] overflow-hidden bg-[#0f4b32]">
        <div
          className="relative h-full w-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {heroSlides.map((slide, slideIndex) => (
            <div
              key={slide.title}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                slideIndex === activeSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
              }`}
            >
              {/* Slide Background Image */}
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
              </div>

              {/* Slide Content */}
              <div className="relative z-20 h-full w-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                  {/* Badges */}
                  <div className="flex gap-2 justify-center mb-6 flex-wrap animate-fade-in">
                    {slide.badges.map((badge, index) => (
                      <span
                        key={badge}
                        className="px-4 py-2 bg-[#0A6C3F] text-white rounded-full text-sm font-semibold shadow-lg hover:bg-[#065f35] transition-all duration-300 backdrop-blur-sm"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 max-w-5xl leading-tight animate-slide-up drop-shadow-lg">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="hero-subtitle text-lg sm:text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl leading-relaxed animate-slide-up drop-shadow-md" style={{ animationDelay: '0.2s' }}>
                    {slide.subtitle}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <Link
                      href="/signup"
                      className="px-8 py-4 bg-white text-[#0A6C3F] rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl backdrop-blur-sm"
                    >
                      Ask a question
                    </Link>
                    <Link
                      href="/courses"
                      className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 hover:scale-105 transition-all duration-300 shadow-xl backdrop-blur-sm"
                    >
                      Explore courses
                    </Link>
                  </div>

                  {/* Feature Text */}
                  <p className="text-white text-sm md:text-base font-medium animate-fade-in drop-shadow-sm" style={{ animationDelay: '0.6s' }}>{slide.featureText}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeSlide ? 'bg-white w-8 shadow-lg' : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-fluid">
          <div className="text-center mb-16 animate-fade-in">
            <span className="inline-block px-4 py-2 bg-[#0A6C3F]/10 text-[#0A6C3F] rounded-full text-sm font-semibold mb-4">
              Programs
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Courses built for employment, entrepreneurship and practical mastery.
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Browse our flagship trade categories that combine digital skill and hands-on practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programTiles.map((program, index) => (
              <div
                key={program.title}
                className="card-hover group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {program.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0A6C3F] transition-colors duration-300">
                  {program.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {program.subtitle}
                </p>
                <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium group-hover:bg-[#0A6C3F] group-hover:text-white transition-all duration-300">
                  {program.mode}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white">
        <div className="container-fluid">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Real stories from skills graduates.
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Students who trained with us and launched income-generating careers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {testimonials.map((item, index) => (
              <div
                key={item.name}
                className="card-elevated hover:shadow-2xl transition-all duration-300 animate-fade-in group"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center mb-6">
                  <div
                    className="w-16 h-16 rounded-full bg-cover bg-center ring-4 ring-[#0A6C3F]/10 shadow-md group-hover:ring-[#0A6C3F]/20 transition-all duration-300"
                    style={{ backgroundImage: `url(${item.avatar})` }}
                  />
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.role}</p>
                  </div>
                </div>
                <blockquote className="text-gray-700 text-lg leading-relaxed italic">
                  "{item.quote}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="section-padding bg-gradient-to-b from-white to-gray-50">
        <div className="container-fluid">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-slide-in-left">
              <span className="inline-block px-4 py-2 bg-[#0A6C3F]/10 text-[#0A6C3F] rounded-full text-sm font-semibold mb-6">
                Accreditations
              </span>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Recognized by trusted Nigerian agencies and employer partners.
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our programs are accredited and endorsed by leading organizations in Nigeria's education and skills development sector.
              </p>
            </div>
            <div className="animate-slide-in-right">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {partners.map((name, index) => (
                  <div
                    key={name}
                    className="card text-center font-semibold text-gray-700 hover:border-[#0A6C3F] hover:shadow-lg transition-all duration-300 animate-fade-in group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="group-hover:text-[#0A6C3F] transition-colors duration-300">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-[#0A6C3F] via-[#065f35] to-[#054a2a] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.12),_transparent_35%)] opacity-40" />
        <div className="relative content-width text-center">
          <div className="animate-fade-in">
            <p className="text-white/80 text-sm font-semibold mb-4 tracking-wider uppercase">
              Call to Action
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              Join Brainstorm Academy and start a practical skills program this term.
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Transform your career with industry-relevant skills and real-world experience.
            </p>
            <Link
              href="/signup"
              className="btn btn-secondary text-lg px-8 py-4 hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Start enrollment today
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">Brainstorm Academy</h3>
            <p className="text-gray-400 text-sm">
              Practical skills training for employment and entrepreneurship across Nigeria.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Programs</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/courses" className="hover:text-white transition">All Courses</Link></li>
              <li><Link href="/courses" className="hover:text-white transition">Trading Skills</Link></li>
              <li><Link href="/courses" className="hover:text-white transition">Tech Programs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/signin" className="hover:text-white transition">Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-white transition">Sign Up</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8">
          <p className="text-center text-gray-400 text-sm">
            &copy; 2026 Brainstorm Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}

