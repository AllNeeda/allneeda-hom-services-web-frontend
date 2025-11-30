import { Button } from "@/components/ui/button"

export function CategoryHero() {
  return (
    <section className="relative bg-gradient-to-r from-emerald-800 to-emerald-600 text-white py-20">
      {/* Background geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-400 rounded-full opacity-20 -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-orange-400 rounded-full opacity-30 translate-x-12 translate-y-12"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-300 rounded-full opacity-25"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-5xl font-bold mb-4">Programming & Tech</h1>
        <p className="text-xl mb-8 text-emerald-100">You think it. A programmer develops it.</p>
        <Button
          variant="outline"
          className="bg-transparent border-white text-white hover:bg-white hover:text-emerald-800"
        >
          How Servicyee Works
        </Button>
      </div>
    </section>
  )
}
