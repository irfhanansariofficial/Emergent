import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#faf7f5]">
      <Header />
      <WhatsAppButton />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#d4af37] mb-4 block">
            Get In Touch
          </span>
          <h1
            className="text-5xl sm:text-6xl tracking-tight text-[#332211] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Contact Us
          </h1>
          <p className="text-base text-[#5c4a3d] max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-[#e8d8d0]"
          >
            <h2 className="text-2xl font-bold text-[#332211] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#332211] mb-2">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#e8d8d0] focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-[#332211]"
                  data-testid="contact-name-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#332211] mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#e8d8d0] focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-[#332211]"
                  data-testid="contact-email-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#332211] mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8d8d0] focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-[#332211]"
                  data-testid="contact-phone-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#332211] mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 rounded-xl border border-[#e8d8d0] focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-[#332211]"
                  data-testid="contact-message-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#d4af37] text-white py-3 rounded-full font-medium hover:bg-[#b8952a] transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                data-testid="contact-submit-button"
              >
                <Send className="w-5 h-5" />
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e8d8d0]">
              <h2 className="text-2xl font-bold text-[#332211] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Contact Information
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-[#f8d7da] p-3 rounded-full">
                    <Phone className="w-6 h-6 text-[#d4af37]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#332211] mb-1">Phone</h3>
                    <p className="text-[#5c4a3d]">+91 98765 43210</p>
                    <p className="text-sm text-[#5c4a3d]">Mon-Sat, 9 AM - 7 PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[#f8d7da] p-3 rounded-full">
                    <Mail className="w-6 h-6 text-[#d4af37]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#332211] mb-1">Email</h3>
                    <p className="text-[#5c4a3d]">hello@beauglowindia.com</p>
                    <p className="text-[#5c4a3d]">support@beauglowindia.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[#f8d7da] p-3 rounded-full">
                    <MapPin className="w-6 h-6 text-[#d4af37]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#332211] mb-1">Address</h3>
                    <p className="text-[#5c4a3d]">
                      123, Beauty Plaza,
                      <br />
                      Andheri West,
                      <br />
                      Mumbai, Maharashtra 400053
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#f8d7da] rounded-2xl p-8">
              <h3 className="text-xl font-bold text-[#332211] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Customer Support
              </h3>
              <p className="text-[#5c4a3d] mb-4">
                Our dedicated support team is here to help you with any questions about our products, orders, or
                delivery.
              </p>
              <button
                onClick={() => {
                  const phoneNumber = '919876543210';
                  const message = 'Hello BeauGlow India! I have a question.';
                  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                  window.open(url, '_blank');
                }}
                className="bg-[#25D366] text-white px-6 py-3 rounded-full font-medium hover:bg-[#1da851] transition-colors"
                data-testid="whatsapp-contact-button"
              >
                Chat on WhatsApp
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}