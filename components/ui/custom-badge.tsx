// components/ui/Badge.tsx
interface BadgeProps {
    title: string
    bgColor?: string // optional, fallback to gray
    textColor?: string // optional, fallback to gray
    BorderColor?: string // optional, fallback to gray
  }
  
  export default function CustomBadge({ title, bgColor = 'gray', textColor , BorderColor = "border-gray-300"}: BadgeProps) {
    
    return (
      <span
        className={`
          inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium 
          border ${bgColor} ${textColor} ${BorderColor}
        `}
      >
        {title}
      </span>
    )
  }
  