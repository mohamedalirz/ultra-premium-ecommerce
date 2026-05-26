import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebook, FaInstagram, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="glass mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-xl font-display font-bold gradient-text">PremiumStore</span>
            </div>
            <p className="text-gray-400 text-sm">
              Experience the future of shopping with cutting-edge technology and premium products.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/shop" className="hover:text-neon transition">Shop</Link></li>
              <li><Link to="/about" className="hover:text-neon transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-neon transition">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-neon transition">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/shop?category=Electronics" className="hover:text-neon transition">Electronics</Link></li>
              <li><Link to="/shop?category=Wearables" className="hover:text-neon transition">Wearables</Link></li>
              <li><Link to="/shop?category=Audio" className="hover:text-neon transition">Audio</Link></li>
              <li><Link to="/shop?category=Gaming" className="hover:text-neon transition">Gaming</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl hover:text-neon transition"><FaTwitter /></a>
              <a href="#" className="text-2xl hover:text-neon transition"><FaFacebook /></a>
              <a href="#" className="text-2xl hover:text-neon transition"><FaInstagram /></a>
              <a href="#" className="text-2xl hover:text-neon transition"><FaGithub /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 PremiumStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;