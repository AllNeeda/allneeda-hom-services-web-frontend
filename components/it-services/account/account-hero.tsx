export function AccountHero() {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-10"></div>

      <div className="relative max-w-7xl mx-auto py-16">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, Irfan Khan</h1>
          </div>
        </div>
      </div>
    </div>
  )
}
