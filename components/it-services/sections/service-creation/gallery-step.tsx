"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, Play, FileText, X } from "lucide-react"
import Image from "next/image"

interface GalleryStepProps {
   // eslint-disable-next-line
  onNext: (_data: any) => void
  onBack: () => void
  formData: any
}

type GalleryState = {
  images: (File | null)[]
  video: File | null
  documents: File[]
}

export function GalleryStep({ onNext }: GalleryStepProps) {
  const [gallery, setGallery] = useState<GalleryState>({
    images: [null, null, null],
    video: null,
    documents: [],
  })

  // Refs for hidden inputs
  const imageInputsRef = useRef<(HTMLInputElement | null)[]>([])
  const videoInputRef = useRef<HTMLInputElement | null>(null)
  const docsInputRef = useRef<HTMLInputElement | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(gallery)
  }

  // Helpers
  const pickImage = (slot: number) => imageInputsRef.current[slot]?.click()
  const pickVideo = () => videoInputRef.current?.click()
  const pickDocs = () => docsInputRef.current?.click()

  const onImageFiles = (slot: number, files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    if (!file.type.startsWith("image/")) return
    setGallery((prev) => {
      const next = [...prev.images]
      next[slot] = file
      return { ...prev, images: next }
    })
  }

  const onVideoFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    if (!file.type.startsWith("video/")) return
    setGallery((prev) => ({ ...prev, video: file }))
  }

  const onDocFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const accepted: File[] = []
    Array.from(files).forEach((f) => {
      // Restrict to PDFs; change to your needs (e.g., application/*)
      if (f.type === "application/pdf") accepted.push(f)
    })
    if (accepted.length === 0) return
    setGallery((prev) => {
      const remainingSlots = Math.max(0, 2 - prev.documents.length)
      const toAdd = accepted.slice(0, remainingSlots)
      return { ...prev, documents: [...prev.documents, ...toAdd] }
    })
  }

  // Add remove functions
  const removeImage = (slot: number) => {
    setGallery((prev) => {
      const next = [...prev.images]
      next[slot] = null
      return { ...prev, images: next }
    })
  }

  const removeVideo = () => {
    setGallery((prev) => ({ ...prev, video: null }))
  }

  const removeDocument = (index: number) => {
    setGallery((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }))
  }

  // Drag & drop handlers
  const prevent = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const onImageDrop = (slot: number, e: React.DragEvent) => {
    prevent(e)
    onImageFiles(slot, e.dataTransfer.files)
  }

  const onVideoDrop = (e: React.DragEvent) => {
    prevent(e)
    onVideoFiles(e.dataTransfer.files)
  }

  const onDocsDrop = (e: React.DragEvent) => {
    prevent(e)
    onDocFiles(e.dataTransfer.files)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1  gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold mb-2">Showcase Your Services In A Service Gallery</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Encourage buyers to choose your Service by featuring a variety of your work.
              </p>
              <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs">!</span>
                </div>
                <p className="text-sm text-orange-800 dark:text-blue-200">
                  To comply with Servicyee&apos;s terms of service, make sure to upload only content you either own or you have
                  the permission or license to use.
                </p>
              </div>
            </div>

            {/* Service Image Guidelines */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Service Image guidelines</h3>
            </div>

            {/* Images Section */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Images (up to 3)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Get noticed by the right buyers with visual examples of your services.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0, 1, 2].map((slot) => (
                  <Card
                    key={slot}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                    onDragOver={prevent}
                    onDrop={(e) => onImageDrop(slot, e)}
                  >
                    <CardContent className="p-4 text-center">
                      <Input
                        ref={(el) => {
                          imageInputsRef.current[slot] = el
                        }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onImageFiles(slot, e.target.files)}
                      />
                      
                      {gallery.images[slot] ? (
                        <div className="space-y-3">
                          <div className="relative">
                            <Image
                              src={URL.createObjectURL(gallery.images[slot] as File)}
                              alt="Preview"
                              width={200}
                              height={150}
                              className="w-full h-32 object-cover rounded-md"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                              onClick={() => removeImage(slot)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="px-2">
                            <Input
                              value={(gallery.images[slot] as File).name}
                              readOnly
                              className="text-xs text-center bg-gray-50 dark:bg-gray-800 border-0"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="py-6">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Drag & drop a Photo or</p>
                          <Button type="button" variant="link" className="text-blue-600 p-0 h-auto" onClick={() => pickImage(slot)}>
                            Browse
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Video Section */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Video (one only)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Capture buyers attention with a video that showcases your service. Please choose a video shorter than
                  75 seconds and smaller than 50MB.
                </p>
              </div>

              <Card
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                onDragOver={prevent}
                onDrop={onVideoDrop}
              >
                <CardContent className="p-8 text-center">
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => onVideoFiles(e.target.files)}
                  />
                  
                  {gallery.video ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg aspect-video flex items-center justify-center">
                          <Play className="w-12 h-12 text-gray-500" />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                          onClick={removeVideo}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <Input
                        value={gallery.video.name}
                        readOnly
                        className="text-sm text-center bg-gray-50 dark:bg-gray-800 border-0"
                      />
                    </div>
                  ) : (
                    <>
                      <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Drag & drop a Video or</p>
                      <Button type="button" variant="link" className="text-blue-600 p-0 h-auto" onClick={pickVideo}>
                        Browse
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Documents Section */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Documents (up to 2)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Show some of the best work you created in a document (PDFs only).
                </p>
              </div>

              <Card
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                onDragOver={prevent}
                onDrop={onDocsDrop}
              >
                <CardContent className="p-6">
                  <input
                    ref={docsInputRef}
                    type="file"
                    accept="application/pdf"
                    multiple
                    className="hidden"
                    onChange={(e) => onDocFiles(e.target.files)}
                  />
                  
                  {gallery.documents.length > 0 ? (
                    <div className="space-y-3">
                      {gallery.documents.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3 flex-1">
                            <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            <Input
                              value={file.name}
                              readOnly
                              className="text-sm bg-transparent border-0 p-0 h-auto text-gray-700 dark:text-gray-300"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="w-6 h-6 p-0 text-gray-500 hover:text-red-500 flex-shrink-0"
                            onClick={() => removeDocument(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        {gallery.documents.length}/2 uploaded
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Drag & drop PDFs or</p>
                      <Button type="button" variant="link" className="text-blue-600 p-0 h-auto" onClick={pickDocs}>
                        Browse
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white px-8">
                Save & Continue
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
