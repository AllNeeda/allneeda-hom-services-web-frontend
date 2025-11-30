import HeroSection from '@/components/guest/sections/home/HeroSection'
import HomeSections from '@/components/guest/sections/home/HomeSections';
import TrendingGift from '@/components/guest/sections/home/TrendingGift';
import MarketPlaceSection from '@/components/guest/sections/home/MarketPlaceSection';
import { services } from "@/data/dummy";
import React from 'react'

const HomeCleint = () => {
    return (
        <div>
            <HeroSection />
            <MarketPlaceSection />
            <HomeSections from={0} to={6} title='Home Services' services={services}/>
            <TrendingGift />
            <HomeSections from={6} to={12} title='IT Services' services={services}/>
            <HomeSections from={12} to={18} title='Food Services' services={services}/>
            <HomeSections from={18} to={24} title='Grocery Services' services={services}/>
        </div>
    )
}

export default HomeCleint