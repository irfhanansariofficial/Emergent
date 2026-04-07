import { motion } from 'framer-motion';
import { Leaf, Heart, Award, Users } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

const values = [
  {
    icon: Leaf,
    title: '100% Natural',
    description: 'All our products are made with pure Ayurvedic ingredients sourced from organic farms across India.',
  },
  {
    icon: Heart,
    title: 'Safe & Tested',
    description: 'Dermatologically tested and approved. Free from harmful chemicals, parabens, and sulfates.',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'We maintain the highest quality standards in every product we create for your beauty needs.',
  },
  {
    icon: Users,
    title: 'Customer First',
    description: 'Your satisfaction is our priority. We offer excellent customer support and hassle-free returns.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#faf7f5]">
      <Header />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#d4af37] mb-4 block">
              Our Story
            </span>
            <h1
              className="text-5xl sm:text-6xl tracking-tight text-[#332211] mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              BeauGlow India
            </h1>
            <p className="text-lg text-[#5c4a3d] max-w-3xl mx-auto leading-relaxed">
              Inspired by the rich heritage of Indian Ayurveda, BeauGlow India brings you premium beauty and cosmetics
              products that enhance your natural glow. We believe in the power of traditional ingredients combined with
              modern formulations to give you the best of both worlds.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.unsplash.com/photo-1599690901937-81d763397828"
                alt="Indian woman with glowing skin"
                className="rounded-2xl shadow-lg w-full"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className="text-4xl font-bold text-[#332211] mb-6"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Our Mission
              </h2>
              <p className="text-[#5c4a3d] leading-relaxed mb-4">
                At BeauGlow India, our mission is to make premium Ayurvedic beauty products accessible to every Indian
                woman. We're committed to preserving ancient beauty secrets while creating products that meet modern
                standards of quality and efficacy.
              </p>
              <p className="text-[#5c4a3d] leading-relaxed">
                Every product is carefully crafted with natural ingredients like turmeric, saffron, sandalwood, and neem
                - ingredients that have been trusted for centuries for their beauty-enhancing properties.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs uppercase tracking-widest font-semibold text-[#d4af37] mb-2 block">
              Why Choose Us
            </span>
            <h2 className="text-4xl sm:text-5xl tracking-tight text-[#332211]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Our Values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-[#e8d8d0] hover:shadow-lg transition-shadow"
              >
                <div className="bg-[#f8d7da] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-[#d4af37]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-[#332211] mb-3">{value.title}</h3>
                <p className="text-sm text-[#5c4a3d] leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-5xl font-bold text-[#d4af37]" style={{ fontFamily: 'Playfair Display, serif' }}>
                50K+
              </h3>
              <p className="text-[#5c4a3d] mt-2">Happy Customers</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-5xl font-bold text-[#d4af37]" style={{ fontFamily: 'Playfair Display, serif' }}>
                100+
              </h3>
              <p className="text-[#5c4a3d] mt-2">Products</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-5xl font-bold text-[#d4af37]" style={{ fontFamily: 'Playfair Display, serif' }}>
                4.8
              </h3>
              <p className="text-[#5c4a3d] mt-2">Average Rating</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-5xl font-bold text-[#d4af37]" style={{ fontFamily: 'Playfair Display, serif' }}>
                5+
              </h3>
              <p className="text-[#5c4a3d] mt-2">Years of Trust</p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}