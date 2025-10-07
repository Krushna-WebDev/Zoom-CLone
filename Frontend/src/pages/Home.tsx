import React from "react";
import Hero from "../components/Hero";
import { IoIosVideocam } from "react-icons/io";
import { MdScreenShare } from "react-icons/md";
import { BsChatSquareTextFill } from "react-icons/bs";

interface FeatureInterface {
  title: string;
  desc: string;
  bgcolor: string;
  iconColor: string;
  icon: React.ComponentType;
}

const featureData: FeatureInterface[] = [
  {
    title: "Crystal Clear Video Calls",
    desc: "Lag-free, HD quality audio & video.",
    bgcolor: "bg-orange-300/50",
    iconColor: "text-orange-500",
    icon: IoIosVideocam,
  },
  {
    title: "Screen Sharing",
    desc: "Share your screen instantly with one click",
    bgcolor: "bg-blue-300/50",
    iconColor: "text-blue-500",
    icon: MdScreenShare,
  },
  {
    title: "Secure and Real Time Chat",
    desc: " End-to-end encrypted With Real Time",
    bgcolor: "bg-green-300/50",
    iconColor: "text-green-500",
    icon: BsChatSquareTextFill,
  },
];

const Home = () => {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-7xl min-h-screen">
        <h1 className="text-center font-raleway text-2xl mt-20">
          Feature Of Our Chattique
        </h1>
        <div className="grid grid-cols-3 gap-10 mt-10">
          

          {featureData.map((feature, index) => (
            <div className="flex gap-4 items-center bg-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 max-w-md">
              <div
                className={`${feature.bgcolor} rounded-full p-4 w-16 h-16 flex items-center justify-center hover:bg-orange-300 transition-all duration-300`}
              >
                <feature.icon className={`${feature.iconColor} text-3xl`} />
              </div>
              <div className="space-y-2">
                <h3 className="font-raleway text-xl font-semibold text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm font-poppins">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
