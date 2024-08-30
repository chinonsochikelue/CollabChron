"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import logo from "../app/apple-touch-icon.png";

const Hero = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="w-full h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Adjusted Image to ensure it's centered properly */}
            <Image
              src={logo}
              alt="CollabChron Logo"
              width={120}
              height={120}
              className="mx-auto"
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-4xl md:text-5xl font-bold"
          >
            Welcome to CollabChron
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-4 text-lg md:text-xl"
          >
            Collaboration Chronology - Your go-to platform for collaborative
            stories and diverse perspectives.
          </motion.p>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            About CollabChron
          </h2>
          <p className="text-center text-lg md:text-xl">
            CollabChron is a multi-author blog platform dedicated to bringing
            together voices from all over the world. We believe in the power of
            collaboration and the beauty of diverse narratives.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div>
            <h3 className="text-2xl font-bold mb-2">Our Mission</h3>
            <p className="text-lg leading-relaxed">
              At CollabChron, our mission is to foster a community where every
              voice matters. We provide a platform for writers to share their
              unique stories and for readers to discover perspectives that
              challenge their thinking and inspire change.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Why We Exist</h3>
            <p className="text-lg leading-relaxed">
              We exist to bridge gaps, spark conversations, and build a
              collective narrative that is richer and more inclusive. Whether
              you are a seasoned writer or a new voice, we welcome you to
              contribute to the ever-evolving story of human experience.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Our Values
            </h2>
            <p className="text-center text-lg md:text-xl mb-8">
              At the core of CollabChron are values that drive our community and
              define our purpose.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-2">Inclusivity</h3>
              <p className="text-lg">
                We celebrate diversity and encourage the sharing of different
                perspectives, fostering a space where all voices are heard and
                valued.
              </p>
            </div>
            <div className="p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-2">Integrity</h3>
              <p className="text-lg">
                Honesty and transparency are at the heart of everything we do.
                We are committed to maintaining the trust of our community.
              </p>
            </div>
            <div className="p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-2">Collaboration</h3>
              <p className="text-lg">
                We believe in the power of collective effort and work together
                to create a platform that is greater than the sum of its parts.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
