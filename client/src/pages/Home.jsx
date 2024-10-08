import React from "react";
import Banner from "../components/home/Banner.jsx";
import Hero from "../components/home/Hero.jsx";
import Features from "../components/home/Features.jsx";
import Testimonial from "../components/home/testimonial.jsx";
import CTA from "../components/home/cta.jsx";
import Footer from "../components/home/footer.jsx";

const Home =()=>{
  return(
    <div>
        <Banner />
        <Hero />
        <Features />
        <Testimonial />
        <CTA />
        <Footer />

    </div>
  )
}

export default Home
