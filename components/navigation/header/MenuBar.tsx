import Link from "next/link";

const MenuBar = () => {
  return (
    <nav className="hidden md:block bg-white dark:bg-gray-900 border-b dark:border-gray-700 px-4">
      <div className="container max-w-7xl mx-auto ">
        <div className="flex items-center justify-between space-x-8 overflow-x-auto py-2 text-sm">
          <Link
            href="/homeservices"
            className="whitespace-nowrap text-gray-800 dark:text-gray-300 hover:text-[#0077B6] dark:hover:text-[#48CAE4] font-normal"
          >
            Todays Deals
          </Link>
          <Link
            href="/beauty"
            className="whitespace-nowrap text-gray-800 dark:text-gray-300 hover:text-[#0077B6] dark:hover:text-[#48CAE4] font-normal"
          >
            Beauty & Spas
          </Link>
          <Link
            href="/home-services"
            className="whitespace-nowrap text-gray-800 dark:text-gray-300 hover:text-[#0077B6] dark:hover:text-[#48CAE4] font-normal"
          >
            Home Services
          </Link>
          <Link
            href="/it-services"
            className="whitespace-nowrap text-gray-800 dark:text-gray-300 hover:text-[#0077B6] dark:hover:text-[#48CAE4] font-normal"
          >
            IT Services
          </Link>
          <Link
            href="/food"
            className="whitespace-nowrap text-gray-800 dark:text-gray-300 hover:text-[#0077B6] dark:hover:text-[#48CAE4] font-normal"
          >
            Food & Grocery
          </Link>
          <Link
            href="/beauty"
            className="whitespace-nowrap text-gray-800 dark:text-gray-300 hover:text-[#0077B6] dark:hover:text-[#48CAE4] font-normal"
          >
            Travel
          </Link>
          <Link
            href="/beauty"
            className="whitespace-nowrap text-gray-800 dark:text-gray-300 hover:text-[#0077B6] dark:hover:text-[#48CAE4] font-normal"
          >
            Goods
          </Link>
          <Link
            href="/beauty"
            className="whitespace-nowrap text-gray-800 dark:text-gray-300 hover:text-[#0077B6] dark:hover:text-[#48CAE4] font-normal"
          >
            Local
          </Link>
          <Link
            href="/beauty"
            className="whitespace-nowrap text-gray-800 dark:text-gray-300 hover:text-[#0077B6] dark:hover:text-[#48CAE4] font-normal"
          >
            Gifts
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default MenuBar;
