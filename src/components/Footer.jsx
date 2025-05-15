import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function Footer() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = 400; // Fixed height for footer

    const particlesArray = [];
    const numberOfParticles = 30; // Reduced for subtlety

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        this.glow = Math.random() * 0.3 + 0.3; // Reduced glow
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        this.glow = Math.sin(Date.now() * 0.005 + this.x) * 0.3 + 0.3;
      }
      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.glow})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.shadowBlur = 5; // Reduced shadow
        ctx.shadowColor = '#00A651';
        ctx.fill();
      }
    }

    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let particle of particlesArray) {
        particle.update();
        particle.draw();
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = 400;
    });

    return () => window.removeEventListener('resize', () => {});
  }, []);

  return (
    <footer className="relative py-12 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 animate-gradient bg-gradient-to-br from-[#0052CC] to-[#00A651]"></div>
      {/* Subtle Overlay for Color Blending */}
      <div className="absolute inset-0 bg-black/20"></div>
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full opacity-20"></canvas>
      <motion.div
        className="relative container mx-auto px-4 backdrop-blur-xl bg-black/30 border border-gray-200/20 shadow-2xl rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-6 text-white">
          {/* Logo & Mission with Holographic Effect */}
          <div className="text-center md:text-left">
            <motion.h3
              className="text-xl font-bold mb-4 text-[#00A651] holographic inline-block"
              initial={{ rotateX: 0, rotateY: 0 }}
              whileHover={{ rotateX: 15, rotateY: 15, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              Adit Investment Ltd
            </motion.h3>
            <p className="text-sm mb-4 text-gray-200 mx-auto max-w-xs md:max-w-none">
              "Powering creativity and innovation through cutting-edge ICT solutions"
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  className="text-gray-200 hover:text-[#00A651] transition-colors duration-300 relative"
                  whileHover={{ scale: 1.2, textShadow: '0 0 10px #00A651' }}
                >
                  <i className={`fab fa-${social}`}></i>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Products', 'Services', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase()}`}
                    className="text-gray-200 hover:text-[#00A651] transition-colors duration-300 relative"
                    onMouseEnter={(e) => (e.target.style.textShadow = '0 0 10px #00A651')}
                    onMouseLeave={(e) => (e.target.style.textShadow = 'none')}
                  >
                    {link}
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 md:-translate-x-0 md:left-0 w-0 h-0.5 bg-[#00A651] transition-all duration-300 hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              {['Web Development', 'IT Repair', 'Cloud Hosting', 'Database Solutions'].map((service) => (
                <li key={service}>
                  <a
                    href="#"
                    className="text-gray-200 hover:text-[#00A651] transition-colors duration-300 relative"
                    onMouseEnter={(e) => (e.target.style.textShadow = '0 0 10px #00A651')}
                    onMouseLeave={(e) => (e.target.style.textShadow = 'none')}
                  >
                    {service}
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 md:-translate-x-0 md:left-0 w-0 h-0.5 bg-[#00A651] transition-all duration-300 hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-200">
              <li>📍 Busia County, Kenya</li>
              <li>📞 +254 733 681 921</li>
              <li>📧 info@aditinvestment.com</li>
              <li>🕒 Mon-Fri: 8AM - 5PM</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700/50 mt-8 pt-4 text-center text-gray-400">
          © {new Date().getFullYear()} Adit Investment Ltd. All Rights Reserved.
        </div>
       <div className="border-t border-gray-700/50 mt-4 pt-2 text-center text-gray-500 text-xs">
  Website Created By GlimmerInk Creations. +254 746527253
</div>

      </motion.div>

      <style>
        {`
          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 20s ease infinite;
          }
          .holographic {
            background: linear-gradient(45deg, #0052CC, #00A651);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 0 10px rgba(0, 166, 81, 0.5);
            position: relative;
            transition: all 0.3s ease;
          }
          .holographic:hover {
            text-shadow: 0 0 20px rgba(0, 166, 81, 0.8);
          }
        `}
      </style>
    </footer>
  );
}