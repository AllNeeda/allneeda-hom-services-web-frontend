import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function ReferralSteps() {
  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <p className="text-orange-500 dark:text-orange-400 font-medium mb-2">FROM REFERRAL TO REWARD</p>
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Its easy to earn with referrals</h2>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="text-center border-0 shadow-none bg-white dark:bg-gray-900">
          <CardContent className="pt-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
              <Image 
                src="https://cdn-icons-png.flaticon.com/512/456/456283.png" 
                alt="Invite friends" 
                width={32} 
                height={32} 
              />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Invite friends</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Refer friends to Servicyee through email, with your own personal referral link, or by spreading the word on
              social.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center border-0 shadow-none bg-white dark:bg-gray-900">
          <CardContent className="pt-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <Image 
                src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png" 
                alt="They get discount" 
                width={32} 
                height={32} 
              />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">They get a discount</h3>
            <p className="text-gray-600 dark:text-gray-300">When your referrals join Servicyee, theyll get 10% off their first order.</p>
          </CardContent>
        </Card>

        <Card className="text-center border-0 shadow-none bg-white dark:bg-gray-900">
          <CardContent className="pt-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Image 
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                alt="You get credit" 
                width={32} 
                height={32} 
              />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">You get the credit</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Once they complete their order, youll get 10% of their purchase in Servicyee Credits to use on your next
              order.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
