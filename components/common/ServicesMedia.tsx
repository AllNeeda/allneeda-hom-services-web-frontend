'use client'

import Image from 'next/image';

interface ServiceMediaProps {
    mainImage: string;   
    images: string[];
    /* eslint-disable no-unused-vars */
    onClick: (index:  number) => void;
    /* eslint-enable no-unused-vars */
}

export default function ServicesMedia({ mainImage, images, onClick }: ServiceMediaProps) {
    return (
        <>
            {/* Main Image with overlay icons */}
            <div className="relative w-full h-80 rounded-xl overflow-hidden shadow mb-3 group">
                <Image src={mainImage} alt="Service Image" fill className="object-cover" />
                {/* Overlay icons */}
                <div className="absolute top-3 right-3 flex gap-2 z-10">
                    <button className="bg-white/90 rounded-full p-2 shadow hover:bg-gray-100">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </button>
                    <button className="bg-white/90 rounded-full p-2 shadow hover:bg-gray-100">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7"/>
                            <path d="M16 6l-4-4-4 4"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            {/* Gallery Thumbnails */}
            <div className="flex gap-2 mt-2">
                {images.slice(0, 4).map((img, index) => (
                    <div 
                        key={index} 
                        className="relative w-24 h-16 rounded overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => onClick(index)}
                    >
                        <Image src={img} alt="Gallery" fill className="object-cover" />
                        {index === 3 && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-xs">
                                +2 images
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}