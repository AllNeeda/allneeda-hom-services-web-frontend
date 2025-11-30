"use client"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users, Zap } from "lucide-react"

export function ModernServiceOverview() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
      <div className="p-8 space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">About This Service</h3>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              I will develop a professional, responsive, and modern website using the latest technologies. With over 5
              years of experience in full-stack development, I specialize in creating high-performance web
              applications that drive results.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">What You Get:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { icon: CheckCircle, text: "Responsive Design" },
              { icon: Zap, text: "Fast Loading Speed" },
              { icon: Users, text: "User-Friendly Interface" },
              { icon: Clock, text: "24/7 Support" },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <feature.icon className="h-5 w-5 text-green-500 dark:text-green-400" />
                <span className="text-gray-700 dark:text-gray-300">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Technologies Used:</h4>
          <div className="flex flex-wrap gap-2">
            {["PHP", "Laravel", "JavaScript", "React", "MySQL", "HTML5", "CSS3", "Bootstrap"].map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
