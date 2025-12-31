import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BadgeCheck, Shield, MessageSquare, TrendingUp, Sparkles} from "lucide-react"
import Link from "next/link"

interface LeadDialogProps {
  isOpen: boolean
  onClose: () => void
  leadCount?: number
  userEmail?: string
  userName?: string
}

export function LeadDialog({
  isOpen,
  onClose,
  leadCount = 1,
  userName = "",
}: LeadDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg  border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-0 text-gray-900 dark:text-gray-100 overflow-hidden shadow-2xl dark:shadow-gray-900/50 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <DialogClose className="">
          
          <span className="sr-only">Close</span>
        </DialogClose>

        {/* Header - More Compact */}
        <DialogHeader className="px-6 pt-6 pb-4 text-center space-y-3">
          <div className="relative mx-auto">
            <div className="absolute -inset-3 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full blur opacity-20 dark:opacity-30"></div>
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/30 dark:to-blue-900/20 border border-sky-100 dark:border-sky-800/50">
              <Sparkles className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-sky-500 dark:bg-sky-400 animate-pulse"></div>
              <span className="text-sm font-medium text-sky-700 dark:text-sky-300">
                {leadCount} verified client{leadCount > 1 ? "s" : ""}
              </span>
            </div>

          <div className="space-y-2">
            <DialogTitle className="text-xl font-bold leading-tight tracking-tight">
              {userName ? `Hi ${userName}` : "New client interest"}
            </DialogTitle>
            
            
          </div>

          <DialogDescription className="text-sm text-gray-600 dark:text-gray-300 px-2">
            {leadCount} client{leadCount > 1 ? "s are" : " is"} looking for your services.
            Upgrade to a Professional account to view details and claim these opportunities.
          </DialogDescription>
        </DialogHeader>

        {/* Content - More Compact */}
        <div className="px-6 pb-4">
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Premium features:
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2 p-2.5 rounded-md bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-sky-50 dark:bg-sky-900/20">
                    <MessageSquare className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-900 dark:text-gray-100">Direct messaging</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Contact clients instantly
                </p>
              </div>

              <div className="space-y-2 p-2.5 rounded-md bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20">
                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-900 dark:text-gray-100">Verified leads</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Real clients, confirmed intent
                </p>
              </div>

              <div className="space-y-2 p-2.5 rounded-md bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-amber-50 dark:bg-amber-900/20">
                    <TrendingUp className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-900 dark:text-gray-100">Higher visibility</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Priority placement
                </p>
              </div>

              <div className="space-y-2 p-2.5 rounded-md bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-violet-50 dark:bg-violet-900/20">
                    <Shield className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-900 dark:text-gray-100">Premium support</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Priority assistance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - More Compact */}
        <DialogFooter className="px-6 py-4 flex flex-col gap-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30">
          <div className="w-full space-y-3">
            <Button
              className="w-full bg-gradient-to-r from-sky-600 to-emerald-700 hover:from-sky-700 hover:to-blue-700 text-white font-medium text-sm py-2 h-auto shadow-md"
            
            >
              <Link href={'/auth/register'}>Become a pro & continue</Link>
              
            </Button>
            
            <div className="text-center">
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 text-xs h-8"
                  onClick={onClose}
                >
                  View later
                </Button>
              </DialogClose>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Be the first to respond and secure this lead.
              </p>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}