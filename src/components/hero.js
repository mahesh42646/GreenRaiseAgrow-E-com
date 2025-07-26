'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import Header from '../eng/components/header';

const slides = [
  {
    heading: 'Bone Meal',
    subheading: 'Organic Phosphorus & Calcium for Stronger Plants',
    description: 'Green Raise Bone Meal is a premium organic fertilizer rich in phosphorus and calcium. It naturally promotes healthy root development, strong stems, and vibrant blooms. Ideal for flowering plants, fruits, and vegetables, this eco-friendly solution ensures robust growth and long-lasting plant health for your home or kitchen garden.',
    image: '/bone-meal.png',
    bgColor: 'linear-gradient(270deg, rgba(197, 104, 10, 0.8) 0%, rgba(197, 104, 10, 0.8) 100%)',
    textColor: '#ffff',
    btnColor: '#ffff',
    btnTextColor: '#222',
  },
  {
    heading: 'Cow Dung Manure',
    subheading: 'Traditional Organic Nutrition for Soil Health',
    description: 'Green Raise Cow Dung Manure is a time-tested organic fertilizer that enhances soil fertility and promotes sustainable plant growth. Its slow-release nutrients are perfect for vegetables, fruits, and flowers, supporting robust, long-lasting growth and healthier harvests in your garden or farm.',
    image: '/cow-dung-manure.png',
    bgColor: 'linear-gradient(270deg, rgba(190, 150, 3, 0.8) 0%, rgba(190, 150, 3, 0.8) 100%)',
    textColor: '#fffff',
    btnColor: '#ffff',
    btnTextColor: '#222',
  },
  {
    heading: 'Green Root Powder',
    subheading: ' Enhanced Root & Soil Health',
    description: 'Green Raise Green Root Humic Acid Powder boosts soil microbial activity, promotes vigorous root growth, and increases nutrient absorption. It rejuvenates soil structure, leading to healthier plants and higher yields. This natural supplement is perfect for gardeners aiming for sustainable, thriving crops and improved soil quality.',
    image: '/green-root.png',
    bgColor: 'linear-gradient(270deg, rgba(9, 119, 183, 0.8) 0%, rgba(9, 119, 183, 0.8) 100%)',
    textColor: '#ffff',
    btnColor: '#ffff',
    btnTextColor: '#222',
  },
  {
    heading: 'Neem Cake Powder',
    subheading: 'Natural Pest Control & Soil Booster',
    description: 'Green Raise Neem Cake Powder acts as both a bio-fertilizer and pest repellent. It protects plant roots from harmful pests while enriching soil fertility, making it an ideal eco-friendly solution for organic farming and gardening. Use it to ensure healthy, pest-free plants and sustainable soil improvement.',
    image: '/neem-cake.png',
    bgColor: 'linear-gradient(270deg, rgba(226, 33, 52, 0.8) 0%, rgba(226, 33, 52, 0.8) 100%)',
    textColor: '#ffff',
    btnColor: '#ffff',
    btnTextColor: '#222',
  },
  {
    heading: 'Organic Compost',
    subheading: '100% Natural Soil Enricher for Lush Growth',
    description: 'Green Raise Organic Compost improves soil fertility and moisture retention, accelerating plant growth with essential nutrients. Sustainably produced, it restores soil health and supports vibrant gardens and farms. Perfect for home gardeners seeking a natural, chemical-free way to boost plant vitality and soil structure.',
    image: '/organic-compost.png',
    bgColor: 'linear-gradient(270deg, rgba(0, 153, 128, 0.8) 0%, rgba0, 153, 128, 0.8) 100%)',
    textColor: '#ffff',
    btnColor: '#ffff',
    btnTextColor: '#222',
  },
  {
    heading: 'Potting Mix',
    subheading: 'Ready-to-Use Blend for All Plants',
    description: 'Green Raise Potting Mix is a specially formulated soil blend for pots, balconies, and terrace gardens. It offers excellent aeration, drainage, and nutrition, ensuring vibrant growth for flowers, vegetables, and indoor plants. This all-purpose mix makes gardening easy and effective for both beginners and experts.',
    image: '/potting-mix.png',
    bgColor: 'linear-gradient(270deg, rgba(230, 119, 1, 0.8) 0%, rgba(230, 119, 1, 0.8) 100%)',
    textColor: '#ffff',
    btnColor: '#ffff',
    btnTextColor: '#222',
  },
  {
    heading: 'Roots Spray (500ml)',
    subheading: 'Liquid Root Booster for Rapid Plant Growth',
    description: 'Green Raise Roots Spray is a powerful liquid root enhancer that stimulates strong root development and improves nutrient uptake. Easy to apply and suitable for all plant types, it ensures faster, healthier growth and resilience, making it an essential addition to any plant care routine.',
    image: '/roots-liq.png',
    bgColor: 'linear-gradient(270deg, rgba(135, 2, 71, 0.8) 0%, rgba(135, 2, 71, 0.8) 100%)',
    textColor: '#ffff',
    btnColor: '#ffff',
    btnTextColor: '#222',
  },
  {
    heading: 'Vermi Compost',
    subheading: 'Earthworm-Powered Organic Fertilizer',
    description: 'Green Raise Vermi Compost is a nutrient-rich organic fertilizer produced by earthworms. It enhances plant growth, improves soil texture, and boosts yield naturally, without harmful chemicals. Ideal for eco-conscious gardeners, it provides a sustainable way to nourish your soil and support healthy, productive plants.',
    image: '/varmi-compost.png',
    bgColor: 'linear-gradient(270deg, rgba(67, 155, 26, 0.8) 0%, rgba(67, 155, 26, 0.8) 100%)',
    textColor: '#ffff',
    btnColor: '#ffff',
    btnTextColor: '#222',
  },
];

function Hero() {
  const [active, setActive] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    let timeout;
    if (!fade) {
      timeout = setTimeout(() => setFade(true), 3500);
    } else {
      timeout = setTimeout(() => {
        setActive((prev) => (prev + 1) % slides.length);
        setFade(false);
      }, 700);
    }
    return () => clearTimeout(timeout);
  }, [fade, active]);

  const slide = slides[active];

  return (
    <div>
        {/* <Header /> */}
      <div
        className="hero-carousel  d-flex align-items-center justify-content-center w-100"
        style={{ minHeight: '480px', background: slide.bgColor, transition: 'background 2s ease', overflow: 'hidden' }}
      >
        <style jsx>{`
          .hero-carousel { position: relative; }
          .hero-slide {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            min-height: 480px;
          }
          .hero-text {
            flex: 1 1 0;
            z-index: 2;
            transition: color 0.7s ease;
          }
          .hero-heading {
            font-size: 3.8rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
          }
          .hero-subheading {
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 1rem;
          }
          .hero-desc {
            font-size: 1.2rem;
            margin-bottom: 2rem;
          }
          .hero-btn {
            font-size: 1.1rem;
            font-weight: 600;
            border-radius: 2rem;
            padding: 0.75rem 2.2rem;
            border: none;
            transition: background 0.3s, color 0.3s;
          }
          .hero-img {
            flex: 1 1 0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 0;
            min-height: 320px;
          }
          @keyframes imgIn {
            0% { opacity: 0; transform: translate(50%, -50%) scale(1.2); }
            100% { opacity: 1; transform: translate(0, 0) scale(1); }
          }
          @keyframes imgOut {
            0% { opacity: 1; transform: translate(0, 0) scale(1); }
            100% { opacity: 0; transform: translate(-30%, 30%) scale(0.9); }
          }
          @keyframes textIn {
            0% { opacity: 0; transform: translateY(40px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes textOut {
            0% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-30px); }
          }
          .hero-img-anim-in { animation: imgIn 0.7s ease both; }
          .hero-img-anim-out { animation: imgOut 0.7s ease both; }
          .hero-text-anim-in { animation: textIn 0.5s ease both; }
          .hero-text-anim-out { animation: textOut 0.5s ease both; }

          @media (max-width: 900px) {
            .hero-slide {
              flex-direction: column-reverse;
            
            }
            .hero-text {
            //   padding: 1.5rem 1rem 0.5rem 1rem;
              text-align: center;
            }
            .hero-img {
              min-height: 180px;
              margin-bottom: 1.5rem;
            }
          }
            
        `}</style>

        <div className="hero-slide container">
          <div
            className={`hero-text${fade ? ' hero-text-anim-out' : ' hero-text-anim-in'}`}
            style={{ color: slide.textColor }}
          >
            <div className="hero-heading">{slide.heading}</div>
            <div className="hero-subheading">{slide.subheading}</div>
            <div className="hero-des text- mb-3 py-2">{slide.description}</div>
            <Link href="/shop" className="btn hero-btn" style={{ background: slide.btnColor, color: slide.btnTextColor }}>
              Shop Now <i className="bi bi-arrow-right ms-2 fw-bold"></i>
            </Link>
          </div>
          <div
            style={{ width: '50%', height: '66vh', paddingLeft: '200px' }}
            className={`hero-img${fade ? ' hero-img-anim-out' : ' hero-img-anim-in'}`}       >
            <Image
              src={slide.image}
              alt={slide.heading}
              width={520}
              height={380}
              style={{
                objectFit: 'contain',
                borderRadius: '1.5rem',
                height: '500px',
                width: 'auto',
               
              }}
              priority
            />
          </div>
        </div>
      </div>

      {/* Water Droplet Divider */}
      <div style={{ background: slide.bgColor }}>
      <svg
    viewBox="0 0 1440 150"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block', width: '100%', height: '100px' }}
    preserveAspectRatio="none"
  >
    <path
      fill="#fff"
      d="M0,0 C60,60 120,60 180,0 C240,60 300,60 360,0 C420,60 480,60 540,0 C600,60 660,60 720,0 C780,60 840,60 900,0 C960,60 1020,60 1080,0 C1140,60 1200,60 1260,0 C1320,60 1380,60 1440,0 L1440,150 L0,160 Z"
    />
  </svg>
      </div>
    </div>
  );
}

export default function HomePage() {
  return <Hero />;
}
