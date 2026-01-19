import React from "react";

import { UserPlus, Video, MessageSquare, type LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  step: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Account",
    description:
      "Sign up in seconds with your email or social accounts. No credit card required.",
  },
  {
    icon: Video,
    step: "02",
    title: "Start a Call",
    description:
      "Invite anyone with a link. No downloads needed - works directly in the browser.",
  },
  {
    icon: MessageSquare,
    step: "03",
    title: "Connect & Collaborate",
    description:
      "Video call, share screens, or switch to chat. Your workspace, your way.",
  },
];

const HowItWorks = () => {
  return (
    <>
      <div className="mx-auto max-w-7xl mt-25 text-center">
        {/* title */}
        <h1 className="uppercase text-cyan-600 tracking-wider font-semibold ">
          How it works
        </h1>
        <div className="">
          <h1 className="font-raleway text-5xl my-5">
            Get Started in{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Minutes
            </span>
          </h1>
          <p className="font-poppins text-gray-500">
            No complicated setup. No lengthy onboarding. Just instant, seamless
            communication.
          </p>
        </div>
        {/* how it works */}

        <div className="grid grid-cols-3 mt-15">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div className="flex flex-col items-center p-7 border m-10 rounded-2xl border-gray-300">
                <p className="bg-cyan-400 mb-10 font-semibold text-white px-2 rounded-2xl ">
                  Step {step.step}
                </p>
                <IconComponent className="w-15 h-15 text-cyan-500 p-3 mb-5 text-center bg-cyan-100 rounded border border-cyan-300" />
                <h1 className="text-2xl font-semibold mb-5">{step.title}</h1>
                <p className="font-poppins text-gray-700">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HowItWorks;
