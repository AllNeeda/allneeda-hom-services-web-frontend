import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, HelpCircle, MessageCircle, ChevronDown, ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function OrderSidebar() {
  return (
    <div className="space-y-6">
      {/* Order Details Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Order details</CardTitle>
            <Button variant="ghost" size="sm">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Gig Preview */}
          <div className="flex space-x-3">
            <div className="w-16 h-12 bg-slate-800 rounded flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-bold">WEB</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground line-clamp-2">
                I will create an email signature for apple mail, outlook
              </p>
              <p className="text-xs text-muted-foreground mt-1">COMPLETED</p>
            </div>
          </div>

          <Separator />

          {/* Order Info */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ordered from</span>
              <span className="font-medium">Naz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery date</span>
              <span className="font-medium">Feb 25, 2:04 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total price</span>
              <span className="font-medium">$42.30</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order number</span>
              <span className="font-medium">#FO168050CF01</span>
            </div>
          </div>

          <Button className="w-full bg-black hover:bg-gray-800 text-white">Order Again</Button>

          {/* Track Order */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium">
              Track Order
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 pt-2">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Delivery reviewed</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Order completed</span>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Support */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium">
              Support
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <HelpCircle className="h-4 w-4" />
                  <span>FAQs</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Resolution center</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  )
}
