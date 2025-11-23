"use client";

import HeroSection from "../components/home-page/HeroSection";
import UniversityLogos from "../components/home-page/UniversityLogos";
import HowItWorks from "../components/home-page/HowItWorks";
import Testimonials from "../components/home-page/Testimonials";
import FAQ from "../components/home-page/FAQ";
import StartCTA from "../components/home-page/StartCTA";

const HomePage = () => {
    return (
        <div className="flex flex-col items-center w-full min-h-[calc(100vh-65px)]">
            {/* Hero page */}
            <HeroSection />

            {/* University logos */}
            <UniversityLogos />

            {/* How it works section */}
            <HowItWorks />

            {/* Testimonials */}
            <Testimonials />

            {/* FAQ */}
            <FAQ />

            {/* Start call to action */}
            <StartCTA />
        </div>
    );
};

export default HomePage;
