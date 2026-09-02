"use client";

import { FieldGrid, TextField } from "@/components/builder/fields";
import { StepHeader } from "@/components/builder/step-header";
import type { StepProps } from "./types";

export function PersonalStep({ data, update, errors }: StepProps) {
  const p = data.personal;
  const set = (patch: Partial<typeof p>) => update((d) => ({ ...d, personal: { ...d.personal, ...patch } }));

  return (
    <div>
      <StepHeader
        title="Personal information"
        description="How universities will address and contact you. Only name and email are required."
      />
      <div className="flex flex-col gap-4">
        <FieldGrid>
          <TextField label="First name" value={p.firstName} onChange={(v) => set({ firstName: v })} error={errors["personal.firstName"]} autoComplete="given-name" placeholder="Nino" />
          <TextField label="Last name" value={p.lastName} onChange={(v) => set({ lastName: v })} error={errors["personal.lastName"]} autoComplete="family-name" placeholder="Beridze" />
        </FieldGrid>
        <FieldGrid>
          <TextField label="Email" type="email" value={p.email} onChange={(v) => set({ email: v })} error={errors["personal.email"]} autoComplete="email" placeholder="nino@example.com" hint="Use an address you check regularly." />
          <TextField label="Phone" type="tel" optional value={p.phone} onChange={(v) => set({ phone: v })} autoComplete="tel" placeholder="+995 5xx xx xx xx" />
        </FieldGrid>
        <FieldGrid>
          <TextField label="City" optional value={p.city} onChange={(v) => set({ city: v })} autoComplete="address-level2" placeholder="Tbilisi" />
          <TextField label="Country" optional value={p.country} onChange={(v) => set({ country: v })} autoComplete="country-name" placeholder="Georgia" />
        </FieldGrid>
        <FieldGrid>
          <TextField label="LinkedIn" optional value={p.linkedin} onChange={(v) => set({ linkedin: v })} error={errors["personal.linkedin"]} placeholder="linkedin.com/in/yourname" />
          <TextField label="Personal website or GitHub" optional value={p.website} onChange={(v) => set({ website: v })} error={errors["personal.website"]} placeholder="github.com/yourname" />
        </FieldGrid>
      </div>
    </div>
  );
}
