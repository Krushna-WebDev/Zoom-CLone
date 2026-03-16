import React from "react";
import { Camera, MessageSquare, Monitor } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FeatureInterface {
  title: string;
  desc: string;
  bgcolor: string;
  iconColor: string;
  icon: LucideIcon;
}

const featureData: FeatureInterface[] = [
  {
    title: "Crystal Clear Video Calls",
    desc: "Lag-free, HD quality audio & video.",
    bgcolor: "bg-orange-300/50",
    iconColor: "text-orange-500",
    icon: Camera,
  },
  {
    title: "Screen Sharing",
    desc: "Share your screen instantly with one click",
    bgcolor: "bg-blue-300/50",
    iconColor: "text-blue-500",
    icon: Monitor,
  },
  {
    title: "Secure and Real Time Chat",
    desc: " End-to-end encrypted With Real Time",
    bgcolor: "bg-green-300/50",
    iconColor: "text-green-500",
    icon: MessageSquare,
  },
];

const Features = () => {
  return (
    <>
      <div className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:mt-25">
        <h1 className="text-center text-sm font-semibold uppercase tracking-wider text-cyan-600">
          Features
        </h1>
        <h1 className="my-4 text-center font-raleway text-3xl sm:text-4xl lg:text-5xl">
         Everything You Need to <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Connect</span>
        </h1>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {featureData.map((feature) => (
            <div
              key={feature.title}
              className="mx-auto flex w-full max-w-md items-start gap-4 rounded-2xl bg-gray-100 p-6 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8"
            >
              <div
                className={`${feature.bgcolor} flex h-14 w-14 shrink-0 items-center justify-center rounded-full p-4 transition-all duration-300 hover:bg-orange-300 sm:h-16 sm:w-16`}
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

export default Features;
