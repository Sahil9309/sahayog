import { useState, useEffect } from 'react';
import { 
  Heart, 
  Users, 
  Target, 
  TrendingUp, 
  Award,
  Globe,
  Lightbulb,
  Shield,
  CheckCircle,
  Star,
  ArrowRight,
  Play
} from 'lucide-react';

const AboutUs = () => {
  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    funding: 0,
    countries: 0
  });

  // Animate stats on component mount
  useEffect(() => {
    const animateStats = () => {
      const targets = { users: 250000, projects: 15420, funding: 85000000, countries: 195 };
      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setStats({
          users: Math.floor(targets.users * easeOut),
          projects: Math.floor(targets.projects * easeOut),
          funding: Math.floor(targets.funding * easeOut),
          countries: Math.floor(targets.countries * easeOut)
        });
        
        if (currentStep >= steps) clearInterval(timer);
      }, stepTime);
    };

    animateStats();
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toLocaleString();
  };

  const formatMoney = (num) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(0)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num.toLocaleString()}`;
  };

  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=300&h=300&fit=crop&crop=face",
      bio: "Former Silicon Valley executive with 15+ years in fintech and startup ecosystems."
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-Founder",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "Tech visionary who previously led engineering teams at major crowdfunding platforms."
    },
    {
      name: "Priya Sharma",
      role: "Head of Community",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Community builder passionate about connecting creators with supporters worldwide."
    },
    {
      name: "David Kim",
      role: "Head of Product",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "Product strategist focused on creating intuitive experiences for creators and backers."
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Empowerment",
      description: "We believe every great idea deserves a chance to flourish, regardless of background or resources."
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Building a safe, transparent platform where creators and backers can connect with confidence."
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Creating opportunities for innovation and collaboration across borders and cultures."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Constantly evolving our platform to better serve the creative community's needs."
    }
  ];

  const milestones = [
    { year: "2019", event: "Founded with a vision to democratize funding", icon: Lightbulb },
    { year: "2020", event: "Launched platform with 1,000 early adopters", icon: Users },
    { year: "2021", event: "Reached $1M in total funding raised", icon: Target },
    { year: "2022", event: "Expanded to 50+ countries worldwide", icon: Globe },
    { year: "2023", event: "Celebrated 10,000 successful projects", icon: Award },
    { year: "2024", event: "Hit $50M+ in total community funding", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#008080] to-[#006666] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              About
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Sahayog
              </span>
            </h1>
            <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to empower creators, innovators, and dreamers worldwide by connecting 
              them with communities that believe in their vision. Every project funded is a step toward 
              a more creative and innovative future.
            </p>
            <button className="bg-white text-[#008080] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center mx-auto">
              <Play className="mr-2 h-5 w-5" />
              Watch Our Story
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-teal-400">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{formatNumber(stats.users)}+</div>
              <div className="text-teal-200">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{formatNumber(stats.projects)}+</div>
              <div className="text-teal-200">Projects Funded</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{formatMoney(stats.funding)}+</div>
              <div className="text-teal-200">Total Raised</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{stats.countries}</div>
              <div className="text-teal-200">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At Sahayog, we believe that great ideas can come from anywhere and anyone. Our platform 
                serves as a bridge between visionary creators and supportive communities, making it possible 
                for innovative projects to come to life regardless of traditional funding barriers.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We're not just a crowdfunding platform – we're a movement dedicated to democratizing 
                opportunity and fostering global collaboration. Every project we help bring to life 
                contributes to a more creative, innovative, and connected world.
              </p>
              <div className="space-y-4">
                {[
                  "Democratize access to funding for creative projects",
                  "Build trust between creators and backers worldwide",
                  "Foster innovation across all industries and communities",
                  "Create lasting impact through community-driven support"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#008080] mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop" 
                alt="Team collaboration" 
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#008080] p-2 rounded-full">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Community First</div>
                    <div className="text-sm text-gray-500">Building connections that matter</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#008080] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">Key milestones that shaped our story</p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-[#008080]"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex items-center w-full max-w-sm ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#008080] rounded-full flex items-center justify-center">
                      <milestone.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className={`bg-white p-6 rounded-lg shadow-md ${index % 2 === 0 ? 'mr-8' : 'ml-8'}`}>
                      <div className="text-[#008080] font-bold text-lg mb-2">{milestone.year}</div>
                      <div className="text-gray-700">{milestone.event}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The passionate people behind Sahayog</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <div className="text-[#008080] font-medium mb-3">{member.role}</div>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-[#008080] to-[#006666] rounded-2xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Join Our Mission</h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Whether you're a creator with the next big idea or someone who loves supporting 
              innovation, there's a place for you in our community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-[#008080] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center">
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#008080] transition-all flex items-center">
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