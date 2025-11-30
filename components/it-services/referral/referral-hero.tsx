import { Button } from "@/components/ui/button"
import Image from "next/image"

export function ReferralHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 z-0">
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-orange-100">irfankhan0101</span>, take the credit for referring friends to Servicyee
            </h1>
            <p className="text-xl mb-6 text-orange-100">
              Earn up to $500 in Servicyee Credits — up to $100 from each referral.
            </p>
            <Button variant="link" className="text-white underline p-0 h-auto">
              Terms and conditions apply
            </Button>
          </div>
          <div className="relative">
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
              alt="People celebrating referral rewards"
              width={600}
              height={400}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
