'use client';

import { LeftRail } from './LeftRail';
import { CenterStage } from './CenterStage';
import { RightRail } from './RightRail';
import { LeftDock } from './LeftDock';

export function BuilderContainer() {
  return (
    <>
      {/* Left Dock - Collapsible */}
      <LeftDock />
      
      {/* Left Rail - Section tree and module library */}
      <LeftRail />
      
      {/* Center Stage - Main editing area */}
      <CenterStage />
      
      {/* Right Rail - Inspector panel */}
      <RightRail />
    </>
  );
}
