import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

export function DetailsTab() {
  return (
    <div className="space-y-6">
      {/* Main Order Details */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  I will be your website developer, website development
                </h2>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Ordered from userTH4578</span>
                  <span>Delivery date: May 6, 2024, 8:07 PM</span>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-sm text-muted-foreground">Order number:</span>
                  <span className="text-sm font-medium">#FO2124ECCD5C4</span>
                  <Button variant="link" size="sm" className="p-0 h-auto text-primary">
                    <Eye className="h-4 w-4 mr-1" />
                    View billing history
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">$585.75</div>
              </div>
            </div>

            <Separator />

            {/* Order Description */}
            <div className="space-y-3">
              <p className="text-sm text-foreground">Hi, In this order we will do following:</p>
              <ul className="text-sm text-foreground space-y-1 ml-4">
                <li>• Welcome Content Listing Menu as well</li>
                <li>• Admin Panel Manage Content & Truck Order feature in Next milestone)</li>
                <li>• Admin Panel Manage Content & Truck Order feature in Next milestone)</li>
              </ul>
            </div>

            <Separator />

            {/* Pricing Breakdown */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Your order</h3>

              <div className="bg-muted p-4 rounded-lg">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-foreground">be your website developer, website development</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Hi, In this order we will do following: - Welcome Content Listing Menu as well - Admin Panel
                        Manage Content & Truck Order feature in Next milestone) - Admin Panel Manage Content & Truck
                        Order feature in Next milestone)
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span>17 days</span>
                        <span>$600</span>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <div>• Functional website</div>
                        <div>• Content upload</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$600</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>$600</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service fee</span>
                    <span>$35.75</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>$585.75</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Extensions */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Order extensions</h3>

              {[1, 2, 3, 4].map((ext) => (
                <Card key={ext} className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Order extension • Apr {20 + ext}, 2024, 8:07 PM
                        </div>
                        <div className="font-medium mt-1">Extend Duration</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">Qty: 1</div>
                        <div className="text-sm">Duration: {ext + 1} days</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-xs text-muted-foreground">
              * Something appears to be missing or incorrect, please contact our{" "}
              <Button variant="link" className="p-0 h-auto text-xs text-primary">
                Customer Support Specialists
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
