import Link from 'next/link';
import { useState } from 'react';
import { User } from 'lucide-react';

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      {/* Trigger Button */}
      <button onClick={openModal}>
        <Link
          href="/"
          className="hidden md:flex flex-col items-center p-2 text-sm text-gray-800 dark:text-gray-300 hover:text-[#0096C7] dark:hover:text-[#0096C7] group"
        >
          <User className="text-lg mb-0.5" />
          <span className="text-xs text-gray-900 dark:text-gray-300 group-hover:text-[#0096C7] dark:group-hover:text-[#0096C7]">
            Account
          </span>
        </Link>
      </button>

      {/* Right-Side Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-[#1A202C] text-sm text-gray-800 dark:text-gray-100 shadow-xl overflow-y-auto transition-transform">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <button
                onClick={closeModal}
                aria-label="Close modal"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="text-center">
              <h3 className="text-base font-semibold">Welcome to Servicyee</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Access all Servicyee has to offer</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {[
                { name: 'My Wishlist', link: '/shared/Wishlist' },
                { name: 'My Servicyees', link: '/servicyees' },
                { name: 'Recently Viewed', link: '/recently-viewed' },
                { name: 'Redeem Gift Card', link: '/redeem-gift-card' },
                { name: 'Notifications', link: '/notifications' },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  className="block py-2 text-sm text-gray-700 dark:text-gray-200 hover:text-[#0096C7] dark:hover:text-[#0096C7] transition-colors font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>


            {/* App Promo */}
            <div className="bg-[#CAF0F8] dark:bg-[#023E8A] p-4 rounded-lg">
              <h3 className="font-semibold text-sm ">Get the Servicyee App</h3>
              <p className="text-xs ">
                Unlock up to 90% discounts on the go with the Servicyee app!
              </p>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center">
                  <div className="bg-white dark:bg-gray-800 p-1 rounded mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#3B82F6">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                      <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[#0096C7] dark:text-[#CAF0F8] font-medium text-sm">4.5 ★</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">100M+ Downloads</div>
                  </div>
                </div>
                <button className="bg-[#0096C7] text-white px-4 py-2 rounded-md text-xs font-medium hover:bg-[#00B4D8] transition-colors">
                  Get the App
                </button>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="space-y-3">
              {/* Facebook */}
              <button className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.5 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46H15.193c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
                Continue with Facebook
              </button>

              {/* Apple */}
              <button className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Continue with Apple
              </button>

              {/* Google */}
              <button className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.15 0 5.95 1.15 8.15 3.05l6.1-6.1C34.6 2.6 29.7.5 24 .5 14.9.5 7.3 6.15 3.9 14.15l7.15 5.55C13.1 13.35 18.1 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.1 24.5c0-1.65-.15-3.25-.45-4.75H24v9.05h12.5c-.55 2.95-2.15 5.45-4.55 7.2l7.15 5.55C43.9 37.6 46.1 31.5 46.1 24.5z" />
                  <path fill="#FBBC05" d="M10.9 28.15c-.5-1.5-.8-3.1-.8-4.65s.3-3.15.8-4.65L3.75 13.3C2.3 16.05 1.5 19 1.5 22c0 3 .8 5.95 2.25 8.7l7.15-5.55z" />
                  <path fill="#34A853" d="M24 44.5c5.7 0 10.6-1.9 14.15-5.2l-7.15-5.55c-2 1.35-4.55 2.15-7 2.15-5.9 0-10.9-3.85-12.75-9.2l-7.15 5.55C7.3 41.85 14.9 47.5 24 47.5z" />
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Email Input */}
            <div>
              <Link
                href="/auth/login"
                className="w-full bg-[#0096C7] text-white py-2.5 rounded-md mt-4 hover:bg-[#00B4D8] transition-colors text-sm font-medium text-center block"
              >
                Or sign in with email
              </Link>
            </div>

            {/* Legal Text */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              By clicking an option above, I agree to the{' '}
              <Link href="#" className="text-[#0096C7] dark:text-[#CAF0F8] hover:underline">Terms and Conditions</Link> and have read the{' '}
              <Link href="#" className="text-[#0096C7] dark:text-[#CAF0F8] hover:underline">Privacy Statement</Link>.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
