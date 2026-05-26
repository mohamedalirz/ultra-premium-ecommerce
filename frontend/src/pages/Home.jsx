import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import ProductCard from '../components/ui/ProductCard';
import { productAPI } from '../services/api';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const [ref, inView] = useInView({ triggerOnce: true });

  // Fix: Access the data correctly from the response
  const { data: featuredProductsData, isLoading: featuredLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: productAPI.getFeatured
  });

  const { data: trendingProductsData, isLoading: trendingLoading } = useQuery({
    queryKey: ['trendingProducts'],
    queryFn: productAPI.getTrending
  });

  // Extract the products array from the response
  const featuredProducts = featuredProductsData?.data?.products || featuredProductsData?.data || [];
  const trendingProducts = trendingProductsData?.data?.products || trendingProductsData?.data || [];

  const stats = [
    { value: 50000, label: 'Happy Customers', prefix: '+' },
    { value: 1000, label: 'Products', prefix: '+' },
    { value: 99.9, label: 'Satisfaction Rate', suffix: '%' },
    { value: 24, label: 'Support Hours', suffix: '/7' }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-6 px-6 py-2 rounded-full glass"
            >
              <span className="text-neon font-mono text-sm animate-glow">WELCOME TO THE FUTURE</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-display font-bold mb-6">
              Premium Shopping
              <br />
              <span className="gradient-text">Reimagined</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Experience the next generation of eCommerce with cutting-edge technology,
              curated products, and unparalleled luxury.
            </p>
            
            <div className="flex gap-6 justify-center flex-wrap">
              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary px-8 py-4 text-lg"
                >
                  Shop Now
                </motion.button>
              </Link>
              <Link to="/collections">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary px-8 py-4 text-lg"
                >
                  Explore Collections
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Slider */}
      <section className="py-20 bg-gradient-to-b from-transparent to-glass/10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Featured <span className="text-neon">Collections</span>
            </h2>
            <p className="text-gray-400 text-lg">Discover our most sought-after products</p>
          </motion.div>
          
          {featuredLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon"></div>
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="pb-12"
            >
              {featuredProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section ref={ref} className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-neon/10 blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="text-center glass-card p-6"
              >
                <div className="text-4xl md:text-5xl font-display font-bold text-neon mb-2">
                  {inView && (
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={2.5}
                      suffix={stat.suffix}
                      prefix={stat.prefix}
                    />
                  )}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              AI-Powered <span className="text-cyber">Recommendations</span>
            </h2>
            <p className="text-gray-400 text-lg">Curated just for you based on your preferences</p>
          </motion.div>
          
          {trendingLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingProducts.slice(0, 3).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-neon opacity-10 blur-3xl" />
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Ready to Elevate Your
              <span className="gradient-text"> Shopping Experience?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of satisfied customers and experience luxury shopping at its finest.
            </p>
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-12 py-4 text-lg"
              >
                Start Shopping
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;