import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-[#707070]">
        <p>
          ABOUT <span className="text-gray-700 font-semibold">MediHouse</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.about_image}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p class="text-justify">
            Welcome to MediHouse, your trusted private hospital dedicated to
            providing personalized and top-tier healthcare services. At
            MediHouse, we understand the importance of seamless access to
            quality care and reliable health management.
          </p>
          <p class="text-justify">
            Our commitment to excellence drives us to continuously improve our
            services, incorporating the latest medical advancements and
            technology. Whether you’re visiting us for a routine check-up, a
            specialized procedure, or ongoing care, MediHouse is here to support
            your health journey with compassion and expertise.
          </p>
          <b className="text-gray-800">Our Vision</b>
          <p class="text-justify">
            Our vision at MediHouse is to redefine private healthcare by
            delivering a seamless and personalized experience for every patient.
            We strive to bridge the gap between individuals and exceptional
            medical care, ensuring you have access to trusted healthcare
            services whenever you need them.
          </p>
        </div>
      </div>

      <div className="text-xl my-4">
        <p>
          WHY <span className="text-gray-700 font-semibold">US HERE</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Easier to access: </b>
          <p>Easy appointment booking that works with your busy schedule.</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Trustworthiness: </b>
          <p>
            Access to a network of trusted healthcare professionals in your
            area.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Careness: </b>
          <p>
            We provide compassionate care to ensure your health and well-being
            are always our top priority.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
