'use client'

import React, { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react'

interface ShowModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  type?: 'success' | 'error' | 'info' | 'warning' | 'default'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  loading?: boolean
  actions?: React.ReactNode
  className?: string
}

const ShowModal: React.FC<ShowModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  type = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  size = 'md',
  loading = false,
  actions,
  className = ''
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl'
  }

  const typeConfig = {
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      borderColor: 'border-green-200 dark:border-green-700',
      bgColor: 'bg-white dark:bg-gray-900'
    },
    error: {
      icon: AlertCircle,
      iconColor: 'text-red-500',
      borderColor: 'border-red-200 dark:border-red-700',
      bgColor: 'bg-white dark:bg-gray-900'
    },
    warning: {
      icon: AlertCircle,
      iconColor: 'text-yellow-500',
      borderColor: 'border-yellow-200 dark:border-yellow-700',
      bgColor: 'bg-white dark:bg-gray-900'
    },
    info: {
      icon: Info,
      iconColor: 'text-[#0077B6] dark:text-[#35a5e1]',
      borderColor: 'border-[#0077B6]/20 dark:border-[#35a5e1]/20',
      bgColor: 'bg-white dark:bg-gray-900'
    },
    default: {
      icon: null,
      iconColor: '',
      borderColor: 'border-gray-200 dark:border-gray-700',
      bgColor: 'bg-white dark:bg-gray-900'
    }
  }

  const config = typeConfig[type]
  const IconComponent = config.icon

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleOverlayClick}
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative w-full ${sizeClasses[size]} transform transition-all duration-300 ease-out`}
        >
          {/* Modal Content */}
          <div 
            className={`relative ${config.bgColor} ${config.borderColor} border rounded-xl shadow-2xl ${className}`}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  {IconComponent && (
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800">
                      <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
                    </div>
                  )}
                  {title && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {title}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Review your information
                      </p>
                    </div>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="p-8">
              {loading ? (
                                 <div className="flex items-center justify-center py-12">
                   <div className="text-center">
                     <Loader2 className="w-10 h-10 animate-spin text-[#0077B6] dark:text-[#35a5e1] mx-auto mb-4" />
                     <p className="text-gray-600 dark:text-gray-300">Processing...</p>
                   </div>
                 </div>
              ) : (
                children
              )}
            </div>

            {/* Actions */}
            {actions && (
              <div className="flex items-center justify-end gap-4 px-8 pb-8 pt-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowModal 