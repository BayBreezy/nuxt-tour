import { createPopper } from "@popperjs/core";
import type { Instance, Modifier, OptionsGeneric } from "@popperjs/core";

export type PopperConfig = Partial<OptionsGeneric<Partial<Modifier<any, any>>>>;

export const defaultPopperConfig: PopperConfig = {
  placement: "auto",
  modifiers: [
    {
      name: "offset",
      options: { offset: [0, 14] },
    },
    {
      name: "flip",
      options: { fallbackPlacements: ["top", "bottom", "left", "right"] },
    },
    {
      name: "preventOverflow",
      options: { padding: 12 },
    },
    {
      name: "arrow",
      options: { padding: 8 },
    },
  ],
};

/** Popper modifier that hides the arrow and centres the tooltip (used for body-targeted steps). */
const centreModifiers: PopperConfig["modifiers"] = [
  {
    name: "offset",
    options: { offset: [0, 0] },
  },
  {
    name: "hideArrow",
    enabled: true,
    phase: "write" as const,
    fn: ({ state }: any) => {
      state.styles.arrow = { ...state.styles.arrow, display: "none" };
    },
    effect: ({ state }: any) => {
      if (state.elements.arrow) state.elements.arrow.style.display = "none";
    },
  },
];

export function createTourPopper(
  reference: Element,
  tooltip: HTMLElement,
  stepConfig?: PopperConfig
): Instance {
  const config = deepMergePopper(defaultPopperConfig, stepConfig);
  return createPopper(reference, tooltip, config);
}

export async function updateTourPopper(
  instance: Instance,
  reference: Element,
  stepConfig?: PopperConfig,
  centre = false
): Promise<void> {
  if (centre) {
    await instance.setOptions({
      placement: "auto",
      strategy: "fixed",
      modifiers: centreModifiers,
    });
  } else {
    // Swap the reference element
    (instance.state.elements as any).reference = reference;
    await instance.setOptions(deepMergePopper(defaultPopperConfig, stepConfig));
    await instance.update();
  }
}

function deepMergePopper(base: PopperConfig, override?: PopperConfig): PopperConfig {
  if (!override) return base;
  const result: PopperConfig = { ...base, ...override };
  if (base.modifiers || override.modifiers) {
    const baseMap = new Map((base.modifiers ?? []).map((m) => [m.name, m]));
    for (const mod of override.modifiers ?? []) {
      baseMap.set(mod.name, { ...baseMap.get(mod.name), ...mod } as any);
    }
    result.modifiers = Array.from(baseMap.values()) as any;
  }
  return result;
}
