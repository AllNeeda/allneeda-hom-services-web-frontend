import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className=" bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container max-w-7xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Company Column */}
          <div className="flex flex-col">
            <h2 className="text-xl font-bold mb-4">Allneeda </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed ">
              The leading B2B SaaS marketplace connecting enterprises with premium digital solutions. Trusted by 15,000+ businesses worldwide.
            </p>
            <div className="flex items-center text-gray-700 dark:text-gray-400 text-sm mb-3">
              <Phone className="w-4 h-4 mr-2 text-[#0077B6] dark:text-[#0077B6]" />
              <span>+1 (202) 830-4424</span>
            </div>
            <div className="flex items-center text-gray-700 dark:text-gray-400 text-sm">
              <Mail className="w-4 h-4 mr-2 text-[#0077B6] dark:text-[#0077B6]" />
              <span>technical@allneeda.com</span>
            </div>
          </div>

          {/* Solutions Column */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Market Solutions</h3>
            <div className="space-y-3 text-justify">
              {[
                'Enterprise SaaS Suite',
                'Payment Processing',
                'Business Analytics',
                'Supply Chain Tools',
                'CRM Integration'
              ].map((item) => (
                <a 
                  key={item} 
                  href="#"
                  className="block text-gray-600 dark:text-gray-400 hover:text-[#0077B6] dark:hover:text-[#0077B6] text-sm transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Resources Column */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <div className="space-y-3 text-justify">
              {[
                'API Documentation',
                'Developer Portal',
                'Case Studies',
                'White Papers',
                'Compliance Center'
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-gray-600 dark:text-gray-400 hover:text-[#0077B6] dark:hover:text-[#0077B6] text-sm transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile Apps Column */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Mobile Access</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-justify">
              Manage your enterprise solutions anywhere with our mobile applications.
            </p>
            
            <div className="space-y-3">
              {/* App Store Button */}
              
              {/* Google Play Button */}
          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            {/* Customer App */}

            {/* Pro's App */}
            <fieldset className="rounded-[4px] p-2 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Link href="https://apps.apple.com/app/idYOUR_APP_ID" target="_blank" rel="noopener noreferrer">
                  <Image src="/assets/logos/app-store.svg" alt="Download on the App Store"  width="0"  height={200} className="w-full hover:scale-102 transition-transform" />
                </Link>
                <Link href="https://play.google.com/store/apps/details?id=YOUR_APP_PACKAGE"   target="_blank" rel="noopener noreferrer">
                  <Image src="/assets/logos/google-play.png" alt="Get it on Google Play" width="100" height={200}  className="w-full hover:scale-102 transition-transform" />
                </Link>
              </div>
            </fieldset>
          </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:mb-0">
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-[#0077B6] dark:hover:text-[#0077B6] text-xs transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-[#0077B6] dark:hover:text-[#0077B6] text-xs transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-[#0077B6] dark:hover:text-[#0077B6] text-xs transition-colors">Service Level Agreement</a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-[#0077B6] dark:hover:text-[#0077B6] text-xs transition-colors">GDPR Compliance</a>
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="text-gray-500 dark:text-gray-400 text-sm">© 2025 Allneeda Corporation</span>
              <div className="flex space-x-4">
                <a href="#" className="text-[#0077B6] dark:text-[#0077B6] hover:text-blue-[#48CAE4] dark:hover:text-[#0049b6] transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="text-[#0077B6] dark:text-[#0077B6] hover:text-blue-[#48CAE4] dark:hover:text-[#0049b6] transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="text-[#0077B6] dark:text-[#0077B6] hover:text-blue-[#48CAE4] dark:hover:text-[#0049b6] transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="text-[#0077B6] dark:text-[#0077B6] hover:text-blue-[#48CAE4] dark:hover:text-[#0049b6] transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
