"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { 
  User, 
  Star, 
  Shield, 
  DollarSign,
  Users,
  ArrowRight,
  Headphones
} from "lucide-react"

interface OnboardingIntroProps {
  onNext: () => void
  onBack: () => void
}
// eslint-disable-next-line
export function OnboardingIntro({ onNext, onBack }: OnboardingIntroProps) {
  const [activeTab, setActiveTab] = useState<'hiring' | 'freelancing'>('hiring')
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-green-800 dark:bg-green-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-300 dark:bg-yellow-400/70 rounded-full opacity-80"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-300 dark:bg-orange-400/70 rounded-full opacity-80"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Work Your Way
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8">
              Give your visitor a smooth online experience with a solid UX design.
            </p>
            <Button 
              onClick={onNext} 
              size="lg" 
              className="bg-green-500 hover:bg-green-400 text-white px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 dark:focus-visible:ring-offset-gray-900"
            >
              Become Seller
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* For Hiring / For Freelancing Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Vertical Tabs */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Side - Vertical Navigation */}
            <div className="lg:w-1/3">
              <div className="space-y-4">
                <button 
                  onClick={() => setActiveTab('hiring')}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                    activeTab === 'hiring' 
                      ? 'bg-green-100 dark:bg-green-900/30 border-l-4 border-green-600 text-green-800 dark:text-green-300' 
                      : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <h3 className="text-lg font-semibold mb-2">For Hiring</h3>
                  <p className="text-sm">Find the perfect freelancer for your project</p>
                </button>
                
                <button 
                  onClick={() => setActiveTab('freelancing')}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                    activeTab === 'freelancing' 
                      ? 'bg-green-100 dark:bg-green-900/30 border-l-4 border-green-600 text-green-800 dark:text-green-300' 
                      : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <h3 className="text-lg font-semibold mb-2">For Freelancing</h3>
                  <p className="text-sm">Start earning with your skills and expertise</p>
                </button>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="lg:w-2/3">
              {activeTab === 'hiring' ? (
                <div className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">For Hiring</h2>
                      <div className="space-y-4 text-gray-600 dark:text-gray-300">
                        <p>
                          Find the perfect freelancer for your project. Browse through thousands of skilled professionals and choose the best match for your needs.
                        </p>
                        <p>
                          Our platform connects you with verified freelancers who have proven track records and excellent reviews from previous clients.
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 dark:text-green-400 dark:border-green-700 px-5 sm:px-6 py-2 mt-4"
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                    <div className="relative">
                      <Image
                        src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80"
                        alt="Team collaboration and hiring"
                        width={400}
                        height={300}
                        className="rounded-lg shadow-lg shadow-black/10 dark:shadow-black/30"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">For Freelancing</h2>
                      <div className="space-y-4 text-gray-600 dark:text-gray-300">
                        <p>
                          Start your freelance journey and earn money doing what you love. Create your profile, showcase your skills, and connect with clients worldwide.
                        </p>
                        <p>
                          Build your reputation, grow your business, and achieve financial freedom by offering your services to clients who need your expertise.
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 dark:text-green-400 dark:border-green-700 px-5 sm:px-6 py-2 mt-4"
                      >
                        Start Freelancing
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                    <div className="relative">
                      <Image
                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
                        alt="Freelancer working on laptop"
                        width={400}
                        height={300}
                        className="rounded-lg shadow-lg shadow-black/10 dark:shadow-black/30"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">How It Works</h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">Most viewed and all-time top-selling services</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg shadow-black/5 dark:shadow-black/20">
                <User className="w-7 h-7 sm:w-8 sm:h-8 text-gray-700 dark:text-gray-200" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Post a job</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Tell us about your project and well connect you with the right freelancers.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg shadow-black/5 dark:shadow-black/20">
                <Users className="w-7 h-7 sm:w-8 sm:h-8 text-gray-700 dark:text-gray-200" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Choose freelancers</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Review proposals and select the best freelancer for your project.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg shadow-black/5 dark:shadow-black/20">
                <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-gray-700 dark:text-gray-200" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Pay safely</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Pay securely through our platform with built-in protection.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg shadow-black/5 dark:shadow-black/20">
                <Headphones className="w-7 h-7 sm:w-8 sm:h-8 text-gray-700 dark:text-gray-200" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">We are here to help</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Get support whenever you need it with our 24/7 customer service.</p>
            </div>
          </div>
        </div>
      </div>

      {/* A whole world of freelance talent Section */}
      <div className="container mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-7xl mx-auto">
          {/* Left Side - Content */}
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 sm:p-8 rounded-lg">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8">
              A whole world of freelance talent at your fingertips
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Proof of quality</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Check work samples, reviews, and identity verification to ensure quality and authenticity.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">No cost until you hire</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Interview, negotiate rates, and pay only for approved work. No upfront costs or hidden fees.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Safe and secure</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Your data is protected with enterprise-grade security and 24/7 support when you need it.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative flex items-center justify-center">
            <div className="w-[320px] h-[360px] sm:w-[380px] sm:h-[420px] lg:w-[400px] lg:h-[440px]">
              <Image
                src="https://images.pexels.com/photos/1181696/pexels-photo-1181696.jpeg?auto=compress&w=800&q=80"
                alt="Freelancers collaborating in a modern workspace"
                width={400}
                height={400}
                className="rounded-lg shadow-lg shadow-black/10 dark:shadow-black/30 object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">834M</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Total Freelancer</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">732M</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Positive Review</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">90M</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Order received</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">236M</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Projects Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Frequently Asked Questions</h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">Lorem ipsum dolor sit amet, consectetur.</p>
          </div>

          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">What methods of payments are supported?</h3>
                <span className="text-green-600 dark:text-green-400">-</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Can I cancel at anytime?</h3>
                <span className="text-gray-400 dark:text-gray-300">+</span>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">How do I get a receipt for my purchase?</h3>
                <span className="text-gray-400 dark:text-gray-300">+</span>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Which license do I need?</h3>
                <span className="text-gray-400 dark:text-gray-300">+</span>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">How do I get access to a theme I purchased?</h3>
                <span className="text-gray-400 dark:text-gray-300">+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
