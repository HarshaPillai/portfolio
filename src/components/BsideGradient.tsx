"use client";

import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

export default function BsideGradient() {
  return (
    <ShaderGradientCanvas
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
      pointerEvents="none"
    >
      <ShaderGradient
        control="props"
        type="plane"
        animate="on"
        uSpeed={0.25}
        uStrength={2.5}
        uDensity={1.1}
        color1="#CC4400"
        color2="#0A0A0A"
        color3="#1A0500"
        grain="on"
        lightType="3d"
        envPreset="city"
        brightness={0.7}
        cAzimuthAngle={180}
        cPolarAngle={90}
        cDistance={3.6}
      />
    </ShaderGradientCanvas>
  );
}
