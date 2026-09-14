"use client";

import React from "react";
import {
  OnboardingProgressStepper,
  type OnboardingProgressStepperProps,
} from "./OnboardingProgressStepper";

export interface OnboardingHeaderProps extends OnboardingProgressStepperProps {
  totalSteps?: number;
}

export function OnboardingHeader(props: OnboardingHeaderProps) {
  return <OnboardingProgressStepper currentStep={props.currentStep} />;
}
