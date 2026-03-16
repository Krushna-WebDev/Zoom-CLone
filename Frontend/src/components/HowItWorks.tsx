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
      <div className="mx-auto mt-20 max-w-7xl px-4 text-center sm:px-6 lg:mt-25">
        {/* title */}
        <h1 className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
          How it works
        </h1>
        <div className="">
          <h1 className="my-4 font-raleway text-3xl sm:text-4xl lg:text-5xl">
            Get Started in{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Minutes
            </span>
          </h1>
          <p className="mx-auto max-w-2xl font-poppins text-sm leading-7 text-gray-500 sm:text-base">
            No complicated setup. No lengthy onboarding. Just instant, seamless
            communication.
          </p>
        </div>
        {/* how it works */}

        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.step}
                className="flex flex-col items-center rounded-2xl border border-gray-300 p-6 sm:p-7"
              >
                <p className="mb-8 rounded-2xl bg-cyan-400 px-3 py-1 text-sm font-semibold text-white">
                  Step {step.step}
                </p>
                <IconComponent className="mb-5 h-16 w-16 rounded border border-cyan-300 bg-cyan-100 p-3 text-center text-cyan-500" />
                <h1 className="mb-4 text-xl font-semibold sm:text-2xl">{step.title}</h1>
                <p className="font-poppins text-sm leading-7 text-gray-700 sm:text-base">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HowItWorks;
