import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, AlertCircle } from "lucide-react"

export function RequirementsTab() {
  const requirements = [
    {
      id: 1,
      question: "If you're ordering for a business, what's your industry?",
      answer: "Not answered",
      optional: true,
    },
    {
      id: 2,
      question: "Is this order part of a larger project you're working on?",
      answer: "Not answered",
      optional: true,
    },
    {
      id: 3,
      question: "Do you have a web hosting provider for this project?",
      answer: "Not answered",
      optional: true,
    },
    {
      id: 4,
      question: "Please provide me all the details you would like to include in the email signature.",
      answer: `1. Name: Position, Company Name, Title or Subtitle
2. Headshot or Company Logo,
3. Contact Info like Phone, Email Address, Website link
4. Social Icons and their link if possible
5. Any template/ideas if you have.

ABDULRAHMAN RAHMAN CFO
CLARKS CONSTRUCTION COMPANY
PHONE: +1 (555) 123-4567
admin@clarksconstructioncompany.com for CFO
Operations@clarksconstructioncompany.com for CEO
WWW.clarksconstructioncompany.com
I will send social media links today please make two different signature one for CFO and one for CEO`,
      optional: false,
      attachments: [{ name: "clarks_logo.png", size: "247 KB" }],
    },
    {
      id: 5,
      question: "For animated signature:",
      answer:
        "If you have your animated logo/picture that is great news, if not You need to provide at least 2+ your logo/picture [change applicable]",
      optional: false,
      attachments: [{ name: "clarks_logo.png", size: "247 KB" }],
    },
  ]

  return (
    <div className="space-y-6">
      {/* eslint-disable-next-line */}
      {requirements.map((req, index) => (
        <Card key={req.id}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-2">
                    {req.id}. {req.question}
                    {req.optional && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Optional
                      </Badge>
                    )}
                  </h3>

                  {req.answer === "Not answered" ? (
                    <div className="text-sm text-muted-foreground italic">{req.answer}</div>
                  ) : (
                    <div className="text-sm text-foreground whitespace-pre-line">{req.answer}</div>
                  )}
                </div>
              </div>

              {req.attachments && req.attachments.length > 0 && (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-foreground">ATTACHMENTS</div>
                  {req.attachments.map((attachment, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                        <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center">
                          <span className="text-white text-xs font-bold">C</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{attachment.name}</div>
                        <div className="text-xs text-muted-foreground">{attachment.size}</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Information Notice */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <strong>The information I provided is accurate and clear.</strong> Any changes at this point require the
              sellers approval and may cost extra.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
