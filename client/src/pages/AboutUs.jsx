import React from 'react';
import {
  Heart,
  Shield,
  Globe,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";

const AboutUs = () => {
  // Data for our core values - clean and easy to manage.
  const values = [
    {
      icon: Heart,
      title: "Empowerment",
      description: "We believe every great idea deserves a chance to flourish, regardless of background or resources.",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Building a safe, transparent platform where creators and backers can connect with confidence.",
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Creating opportunities for innovation and collaboration across borders and cultures.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Constantly evolving our platform to better serve the creative community's needs.",
    },
  ];

  // Key mission points for clarity.
  const missionPoints = [
    "Democratize access to funding for creative projects",
    "Build trust between creators and backers worldwide",
    "Foster innovation across all industries and communities",
    "Create lasting impact through community-driven support",
  ];

  return (
    <div className="bg-white text-gray-800">

      {/* Section 1: Centered Introduction */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              About <span className="text-[#008080]">Sahayog</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              We're on a mission to empower creators, innovators, and dreamers worldwide by connecting them with communities that believe in their vision. We're not just a crowdfunding platform – we're a movement dedicated to democratizing opportunity.
            </p>
            {/* Corrected alignment for the mission points */}
            <div className="space-y-4">
              {missionPoints.map((point, index) => (
                <div key={index} className="flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-[#008080] mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Core Values */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Core Values</h2>
            <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
              These are the principles that guide everything we do, ensuring we stay true to our mission.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="bg-[#008080] w-12 h-12 rounded-lg flex items-center justify-center mb-5">
                  <value.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Call to Action */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-[#008080] to-[#006666] rounded-2xl p-10 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Whether you're a creator with the next big idea or someone who loves supporting innovation, there's a place for you here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-[#008080] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-transform transform hover:scale-105 flex items-center shadow-md">
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#008080] transition-all flex items-center">
                Explore Projects
                <Star className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
