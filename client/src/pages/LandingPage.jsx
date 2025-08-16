import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Users,
  Target,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const processSteps = [
    {
      icon: Target,
      title: "Create Your Campaign",
      description:
        "Share your project, set your funding goal, and create compelling rewards for backers.",
    },
    {
      icon: Users,
      title: "Build Your Community",
      description:
        "Spread the word through social media and engage with potential backers to build momentum.",
    },
    {
      icon: TrendingUp,
      title: "Bring It to Life",
      description:
        "Reach your goal, fulfill your promises, and turn your vision into a reality.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* ## 1. Hero Section */}
      <section className="bg-gradient-to-br from-[#008080] to-[#006666] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side: Headline and CTAs */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
                Fund the <span className="text-yellow-400">Future</span>,
                Together.
              </h1>
              <p className="text-lg text-teal-100 mb-8 max-w-lg">
                Turn your innovative ideas into reality. Join thousands of
                creators and backers making dreams come true on Sahayog.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/create-event")}
                  className="bg-white text-[#008080] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 flex items-center justify-center shadow-lg"
                >
                  Start Your Campaign <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1553484771-371a605b060b?w=500"
                alt="Innovation"
                className="w-full h-84 object-cover rounded-lg mb-4"
              />
              <h3 className="font-bold text-lg">Smart City Initiative</h3>
              <p className="text-black text-md">
                Making cities more sustainable and connected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ## 2. How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Launch in 3 Simple Steps
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                We've streamlined the funding process so you can focus on what
                matters most: creating. Follow these simple steps to get
                started.
              </p>
            </div>

            <div className="space-y-8">
              {processSteps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[#008080] text-white flex items-center justify-center mr-5">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-gray-600 mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ## 3. CTA Section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#008080] to-[#006666] rounded-2xl p-10 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Make Your Mark?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Your journey to turning ideas into reality starts here. We provide
              the tools, you bring the vision.
            </p>

            <ul className="inline-flex flex-col sm:flex-row gap-x-8 gap-y-3 text-gray-300 mb-8">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-teal-400" /> No hidden
                fees
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-teal-400" /> Secure
                payments
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-teal-400" /> Global
                reach
              </li>
            </ul>

            <div>
              <button
                onClick={() => navigate("/create-event")}
                className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition transform hover:scale-105 shadow-lg"
              >
                <Target className="mr-2 h-5 w-5 inline-block" />
                Start Your Campaign
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;