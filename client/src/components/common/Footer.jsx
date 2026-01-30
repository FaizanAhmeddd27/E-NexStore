import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-white">ShopHub</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Your one-stop destination for quality products at amazing prices. Shop with confidence and style.
            </p>
            <div className="flex space-x-4">
              <SocialLink icon={<Facebook size={20} />} href="#" />
              <SocialLink icon={<Twitter size={20} />} href="#" />
              <SocialLink icon={<Instagram size={20} />} href="#" />
              <SocialLink icon={<Linkedin size={20} />} href="#" />
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink to="/" text="Home" />
              <FooterLink to="/category/jeans" text="Jeans" />
              <FooterLink to="/category/t-shirts" text="T-Shirts" />
              <FooterLink to="/category/shoes" text="Shoes" />
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-white font-semibold mb-4 text-lg">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors text-sm">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors text-sm">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors text-sm">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors text-sm">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-white font-semibold mb-4 text-lg">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-primary-400 flex-shrink-0" />
                <span className="text-sm">support@shophub.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-primary-400 flex-shrink-0" />
                <span className="text-sm">+1 (234) 567-8900</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-primary-400 flex-shrink-0 mt-1" />
                <span className="text-sm">123 Shopping Street<br />Commerce City, CC 12345</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-8 pt-8 text-center"
        >
          <p className="text-sm text-gray-400">
            © {currentYear} ShopHub. All rights reserved. Made with ❤️ by Your Team
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

const FooterLink = ({ to, text }) => (
  <li>
    <Link to={to} className="hover:text-primary-400 transition-colors text-sm inline-block">
      {text}
    </Link>
  </li>
)

const SocialLink = ({ icon, href }) => (
  <motion.a
    href={href}
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.9 }}
    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors"
  >
    {icon}
  </motion.a>
)

export default Footer