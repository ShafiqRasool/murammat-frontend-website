import React from 'react';
import {
  Phone,
  Mail,
  Play
} from 'lucide-react';

// Custom Brand Icons (Fallback since lucide-react deprecated brand icons)
const YoutubeIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const TiktokIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2a3 3 0 0 0 3 3v2a5 5 0 0 1-5-5h-2v11a3 3 0 1 1-3-3v-2a5 5 0 1 0 5 5V2z" />
  </svg>
);

const PinterestIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.218-.173.263-.4.157-1.498-.697-2.434-2.885-2.434-4.637 0-3.778 2.748-7.247 7.915-7.247 4.15 0 7.378 2.96 7.378 6.907 0 4.126-2.6 7.447-6.212 7.447-1.213 0-2.355-.631-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 11.993-5.366 11.993-11.985C24.014 5.367 18.643 0 12.017 0z" />
  </svg>
);

const AppleIcon = ({ size = 18, fill = "currentColor" }: { size?: number, fill?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="none">
    <path d="M12 2.04C10.85 2 9.98 2.88 9 3.84A4.8 4.8 0 0 0 8 7A4.8 4.8 0 0 0 9 10.16c.98.96 1.85 1.84 3 1.84s2.02-.88 3-1.84A4.8 4.8 0 0 0 16 7a4.8 4.8 0 0 0-1-3.16C14.02 2.88 13.15 2 12 2zM12 11c-2.4 0-4.66 1.14-5.94 3.09C4.85 15.93 4 18 4 20c0 1.58.63 3.04 1.76 4.19l.06.05.04.05L7 25c.34.42 1 .5 1.5.5s1.16-.08 1.5-.5L12 23.16 14 25c.34.42 1 .5 1.5.5s1.16-.08 1.5-.5l1.14-1.87.04-.05.06-.05C19.37 23.04 20 21.58 20 20c0-2-.85-4.07-2.06-5.91C16.66 12.14 14.4 11 12 11z" />
  </svg>
);

// ==========================================
// STATIC DATA (Ready to be replaced by API)
// ==========================================

const companyLinks = [
  { id: 1, label: 'Blog', url: '#' },
  { id: 2, label: 'About Us', url: '#' },
  { id: 3, label: 'Careers', url: '#' },
];

const customerLinks = [
  { id: 1, label: 'How it works', url: '#' },
  { id: 2, label: 'iPhone app', url: '#' },
  { id: 3, label: 'Android app', url: '#' },
];

const socialLinks = [
  { id: 1, icon: <FacebookIcon size={18} />, url: 'https://www.facebook.com/profile.php?id=61570663409989' },
  { id: 2, icon: <InstagramIcon size={18} />, url: 'https://www.instagram.com/murammat_pk' },
  { id: 3, icon: <TiktokIcon size={18} />, url: 'https://www.tiktok.com/@murammat.pk' },
  { id: 4, icon: <YoutubeIcon size={18} />, url: 'https://www.youtube.com/@Murammat-admin' },
  { id: 5, icon: <PinterestIcon size={18} />, url: 'https://pin.it/7f3sbiIwW' },
  { id: 6, icon: <TwitterIcon size={18} />, url: '#' },
  { id: 7, icon: <LinkedinIcon size={18} />, url: '#' },
];

// ==========================================
// FOOTER COMPONENT
// ==========================================

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A1A1A] text-gray-300 pt-16 pb-8 relative antialiased border-t-[6px] border-[#00674F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Column 1: Brand & About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6 cursor-pointer">
              <img src="/logo.png" alt="Murammat.pk" className="h-10 w-14 object-contain bg-white rounded-md p-1" />
              <span className="text-2xl font-bold text-white tracking-tight">
                Murammat<span className="text-[#00674F]">.pk</span>
              </span>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed mb-8">
              When it comes to Murammat.pk, the object of the word 'Murammat' reflects our motive to add value to our customers' lives by providing all essential home services. On the other hand, we aim to reduce unemployment in Pakistan by hiring in-house staff whom we train in given skills.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <span className="text-white font-semibold text-sm mr-2">Follow Us</span>
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target={social.url !== '#' ? "_blank" : undefined}
                  rel={social.url !== '#' ? "noopener noreferrer" : undefined}
                  className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#00674F] hover:bg-[#00674F] transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Company Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Company</h3>
            <ul className="space-y-4">
              {companyLinks.map((link) => (
                <li key={link.id}>
                  <a href={link.url} className="text-sm text-gray-400 hover:text-[#00674F] hover:underline transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customers Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Customers</h3>
            <ul className="space-y-4">
              {customerLinks.map((link) => (
                <li key={link.id}>
                  <a href={link.url} className="text-sm text-gray-400 hover:text-[#00674F] hover:underline transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Support</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 group">
                <span className="text-sm text-gray-400">Contact Us</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone size={18} className="text-[#00674F] group-hover:scale-110 transition-transform" />
                <a href="tel:03274540905" className="text-sm text-gray-300 hover:text-white transition-colors">
                  0327-454-0905
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail size={18} className="text-[#00674F] group-hover:scale-110 transition-transform" />
                <a href="mailto:support@murammat.pk" className="text-sm text-gray-300 hover:text-white transition-colors">
                  support@murammat.pk
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & App Links */}
        <div className="pt-8 border-t border-gray-800 flex flex-col lg:flex-row justify-between items-center gap-6">

          <div className="text-xs text-gray-500 text-center lg:text-left">
            Copyright © 2024 - 2026 Murammat.pk. Developed and Owned by Muhammad Shafiq. All Rights Reserved. Murammat.pk logo and related marks are registered Trademarks of Murammat.
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">

            {/* App Store Icons */}
            <div className="flex items-center gap-3">
              <span className="text-white font-semibold text-sm">Mobile App</span>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors">
                <AppleIcon size={16} fill="currentColor" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors">
                <Play size={16} fill="currentColor" />
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            </div>
          </div>

        </div>
      </div>

      {/* Floating WhatsApp Button with Pulse Effect */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end group">
        {/* Tooltip / Chat bubble */}
        <div className="absolute -top-12 right-2 bg-white text-gray-800 text-sm font-bold px-4 py-2 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none translate-y-2 group-hover:translate-y-0 before:content-[''] before:absolute before:top-full before:right-4 before:border-[6px] before:border-transparent before:border-t-white">
          Chat with us!
        </div>

        {/* Main Button */}
        <a
          href="https://wa.me/923274540905"
          target="_blank"
          rel="noopener noreferrer"
          className="relative bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white p-4 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)] hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center"
          aria-label="Contact us on WhatsApp"
        >
          {/* Pulsing rings for attention */}
          <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-75 hidden sm:block"></span>

          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16" className="relative z-10 drop-shadow-md">
            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c-.003 1.396.362 2.76.105 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
          </svg>
        </a>
      </div>
    </footer>
  );
};

export default Footer;