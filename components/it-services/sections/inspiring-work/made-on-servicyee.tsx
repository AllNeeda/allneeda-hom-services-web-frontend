'use client'

import Image from "next/image"
import { useState } from "react"
import Masonry from "react-masonry-css"
import { motion } from "framer-motion"

const portfolioItems = [ { id: 1, type: "image", src: "https://cdn.pixabay.com/photo/2015/01/09/11/08/startup-594090_1280.jpg", alt: "Website Development", title: "E-commerce Platform", category: "Web Development", height: "h-80" }, { id: 2, type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4", alt: "Vibe Coding", title: "AI-Powered Coding", category: "Software Development", height: "h-96" }, { id: 3, type: "image", src: "https://cdn.pixabay.com/photo/2016/11/19/14/00/code-1839406_1280.jpg", alt: "Mobile App Design", title: "Mobile Application", category: "App Development", height: "h-72" }, { id: 4, type: "image", src: "https://cdn.pixabay.com/photo/2018/01/17/07/06/laptop-3087585_1280.jpg", alt: "Data Analytics", title: "Business Intelligence", category: "Data Science", height: "h-64" }, { id: 5, type: "video", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", alt: "Video Editing", title: "Creative Video Content", category: "Video Production", height: "h-88" }, { id: 6, type: "image", src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", alt: "Logo Design", title: "Brand Identity", category: "Graphic Design", height: "h-80" }, { id: 7, type: "image", src: "https://cdn.pixabay.com/photo/2016/11/19/18/06/feet-1840619_1280.jpg", alt: "3D Modeling", title: "Product Visualization", category: "3D Design", height: "h-72" }, { id: 8, type: "image", src: "https://cdn.pixabay.com/photo/2016/03/26/13/09/workspace-1280538_1280.jpg", alt: "SEO Optimization", title: "Search Engine Marketing", category: "Digital Marketing", height: "h-88" }, { id: 9, type: "image", src: "https://cdn.pixabay.com/photo/2017/07/31/11/21/people-2557396_1280.jpg", alt: "Team Collaboration", title: "Project Management", category: "Business Services", height: "h-64" }, { id: 10, type: "video", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", alt: "Animation", title: "Motion Graphics", category: "Animation", height: "h-80" }, { id: 11, type: "image", src: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80", alt: "Innovation", title: "Creative Solutions", category: "Innovation", height: "h-96" }, { id: 12, type: "image", src: "https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg", alt: "Learning", title: "Educational Content", category: "Education", height: "h-72" } ]
const breakpointColumnsObj = {
  default: 4,
  1200: 3,
  768: 2,
  500: 1,
}

export default function MadeOnServicyee() {
  const [activeItem, setActiveItem] = useState<any | null>(null)

  return (
    <section className="py-8 pt-12 bg-gray-50 text-black dark:bg-gray-950 dark:text-white  transition-colors">
      <div className="max-w-7xl mx-auto ">
        <div className="mb-8 ">
          <h2 className="text-3xl mb-6  font-semibold ">
            Made on <span className="text-green-500">Servicyee</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Explore interactive works created by our talented community
          </p>
        </div>

        {/* Masonry Grid */}
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-6"
          columnClassName="flex flex-col gap-6"
        >
          {portfolioItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="relative cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all bg-white dark:bg-gray-800"
              onClick={() => setActiveItem(item)}
            >
              {item.type === "image" ? (
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto object-cover bg-black"
                >
                  <source src={item.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="text-white">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-200">{item.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </Masonry>
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setActiveItem(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-w-5xl w-full p-6"
          >
            <button
              className="absolute top-3 right-3 text-white bg-black/50 rounded-full px-3 py-1"
              onClick={() => setActiveItem(null)}
            >
              ✕
            </button>

            {activeItem.type === "image" ? (
              <Image
                src={activeItem.src}
                alt={activeItem.alt}
                width={1200}
                height={800}
                className="w-full h-auto object-contain rounded-xl"
              />
            ) : (
              <video
                controls
                autoPlay
                className="w-full h-auto object-contain rounded-xl bg-black"
              >
                <source src={activeItem.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            <div className="mt-4 text-center text-white">
              <h3 className="text-xl font-semibold">{activeItem.title}</h3>
              <p className="text-gray-300">{activeItem.category}</p>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  )
}
