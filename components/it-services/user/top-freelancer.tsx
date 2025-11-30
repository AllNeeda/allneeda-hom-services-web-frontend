'use client'

import { FreelancerCard } from './freelancer-card'

const topFreelancers = [
  {
    id: 1,
    name: "Robert Fox",
    profession: "Nursing Assistant",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.9,
    reviews: 595,
    skills: ["Figma", "Sketch", "HTML5"],
    location: "London",
    rate: "$90 / hr",
    jobSuccess: "98%",
    isOnline: true
  },
  {
    id: 2,
    name: "Kristin Watson",
    profession: "Dog Trainer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.8,
    reviews: 420,
    skills: ["React", "Node.js", "MongoDB"],
    location: "New York",
    rate: "$75 / hr",
    jobSuccess: "96%",
    isOnline: true
  },
  {
    id: 3,
    name: "Darrell Steward",
    profession: "Medical Assistant",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 4.9,
    reviews: 320,
    skills: ["Vue.js", "Python", "Django"],
    location: "San Francisco",
    rate: "$85 / hr",
    jobSuccess: "99%",
    isOnline: false
  },
  {
    id: 4,
    name: "Theresa Webb",
    profession: "Marketing Coordinator",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 4.7,
    reviews: 280,
    skills: ["Angular", "TypeScript", "Firebase"],
    location: "Chicago",
    rate: "$70 / hr",
    jobSuccess: "95%",
    isOnline: true
  },
  {
    id: 5,
    name: "Cameron Williamson",
    profession: "Web Developer",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
    rating: 4.8,
    reviews: 450,
    skills: ["JavaScript", "CSS3", "Bootstrap"],
    location: "Seattle",
    rate: "$95 / hr",
    jobSuccess: "97%",
    isOnline: true
  },
  {
    id: 6,
    name: "Jane Cooper",
    profession: "UI/UX Designer",
    avatar: "https://randomuser.me/api/portraits/women/25.jpg",
    rating: 4.9,
    reviews: 380,
    skills: ["Adobe XD", "Photoshop", "Illustrator"],
    location: "Austin",
    rate: "$80 / hr",
    jobSuccess: "98%",
    isOnline: false
  },
  {
    id: 7,
    name: "Guy Hawkins",
    profession: "Mobile Developer",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 4.6,
    reviews: 220,
    skills: ["React Native", "Flutter", "Swift"],
    location: "Miami",
    rate: "$90 / hr",
    jobSuccess: "94%",
    isOnline: true
  },
  {
    id: 8,
    name: "Leslie Alexander",
    profession: "Data Scientist",
    avatar: "https://randomuser.me/api/portraits/women/35.jpg",
    rating: 4.8,
    reviews: 310,
    skills: ["Python", "Machine Learning", "TensorFlow"],
    location: "Boston",
    rate: "$100 / hr",
    jobSuccess: "96%",
    isOnline: true
  }
]

export default function TopFreelancer() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 dark:text-white mb-3 sm:mb-4">Top Freelancers</h2>
          <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400">
            Discover our most talented and highly-rated freelancers who deliver exceptional results
          </p>
        </div>

        {/* Freelancers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {topFreelancers.map((freelancer) => (
            <FreelancerCard key={freelancer.id} freelancer={freelancer} />
          ))}
        </div>
      </div>
    </section>
  )
}