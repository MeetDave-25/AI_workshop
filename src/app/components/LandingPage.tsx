import { Hero } from "./Hero";
import { About } from "./About";
import { Structure } from "./Structure";
import { Workflow } from "./Workflow";
import { WhatStudentsCreate } from "./WhatStudentsCreate";
import { Tools } from "./Tools";
import { Certification } from "./Certification";
import { AttendanceTicket } from "./AttendanceTicket";
import { FoodCoupon } from "./FoodCoupon";
import { PromptsSection } from "./PromptsSection";
import { MaterialsSection } from "./MaterialsSection";
import { Team } from "./Team";
import { Footer } from "./Footer";
import { Navigation } from "./Navigation";

export function LandingPage() {
    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden">
            <Navigation />
            <Hero />
            <div id="about">
                <About />
            </div>
            <Structure />
            <div id="workflow">
                <Workflow />
            </div>
            <WhatStudentsCreate />
            <div id="tools">
                <Tools />
            </div>
            <div id="certification">
                <Certification />
            </div>
            <div id="prompts">
                <PromptsSection />
            </div>
            <MaterialsSection />
            <AttendanceTicket />
            <div id="coupon">
                <FoodCoupon />
            </div>
            <div id="team">
                <Team />
            </div>
            <Footer />
        </div>
    );
}
