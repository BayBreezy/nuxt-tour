---
title: "Transitions"
description: "Choose from five built-in tooltip animations using the transition prop."
navigation.icon: heroicons:sparkles
---

## Transitions

Pass the `transition` prop to choose how the tooltip enters and leaves. Pick one from the selector below and start the tour to preview it.

::prose-show-case

:ExTransition

#code

<!-- automd:file src="../../app/components/content/examples/ExTransition.vue" code name="[TransitionExample.vue]" -->

```vue [TransitionExample.vue]
<template>
  <div class="not-prose flex flex-col gap-5">
    <div>
      <p class="mb-4 text-sm font-medium">Select a transition</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="t in transitions"
          :key="t"
          class="rounded-full border px-3 py-1 font-mono text-sm transition-colors"
          :class="
            selected === t
              ? 'border-primary bg-primary/20 text-primary'
              : 'bg-muted text-muted-foreground hover:border-primary'
          "
          @click="selected = t"
        >
          {{ t }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-3">
      <div id="ex-transition-step-a" class="rounded-lg border p-3 text-center">
        <p class="text-xs font-semibold">Step 1</p>
        <p class="text-muted-foreground mt-1 text-xs">First target</p>
      </div>
      <div id="ex-transition-step-b" class="rounded-lg border p-3 text-center">
        <p class="text-xs font-semibold">Step 2</p>
        <p class="text-muted-foreground mt-1 text-xs">Second target</p>
      </div>
      <div id="ex-transition-step-c" class="rounded-lg border p-3 text-center">
        <p class="text-xs font-semibold">Step 3</p>
        <p class="text-muted-foreground mt-1 text-xs">Third target</p>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <UiButton size="sm" variant="outline" :disabled="isActive" @click="start()">
        Start Tour
      </UiButton>
      <UiButton size="sm" variant="ghost" @click="reset()"> Reset </UiButton>
    </div>

    <VTour :name="tourName" :transition="selected" save-to-local-storage="never" :steps="steps" />
  </div>
</template>

<script lang="ts" setup>
  import type { TourStep } from "#nuxt-tour/types";

  const tourName = "transition-tour-example";
  const transitions = ["fade", "slide-up", "slide-down", "slide-left", "slide-right"] as const;
  const selected = ref<(typeof transitions)[number]>("fade");

  const { isActive, start, reset } = useTour(tourName);

  const steps: TourStep[] = [
    {
      target: "#ex-transition-step-a",
      title: "Tooltip transitions",
      body: "Select a transition above and press <strong>Start Tour</strong> to see it in action.",
      popperConfig: { placement: "bottom" },
    },
    {
      target: "#ex-transition-step-b",
      title: "Step change",
      subText: "Watch the animation",
      body: "The same transition plays on every step change — in and out.",
      popperConfig: { placement: "bottom" },
    },
    {
      target: "#ex-transition-step-c",
      title: "Mix and match",
      body: "Reset the tour, pick a different transition, and start again to compare.",
      popperConfig: { placement: "bottom" },
    },
  ];
</script>
```

<!-- /automd -->
::

## Per-step transitions

Set `transition` on an individual step to override the tour-level prop for that step only. Steps without a `transition` fall back to the tour prop, then `'fade'`.

::prose-show-case

:ExTransitionPerStep

#code

<!-- automd:file src="../../app/components/content/examples/ExTransitionPerStep.vue" code name="[TransitionPerStepExample.vue]" -->

```vue [TransitionPerStepExample.vue]
<template>
  <div class="not-prose flex flex-col gap-4">
    <div class="grid grid-cols-5 gap-3">
      <div
        v-for="item in stepItems"
        :id="item.id"
        :key="item.id"
        class="bg-muted flex flex-col items-center gap-1 rounded-lg border p-3 text-center"
      >
        <p class="text-xs font-semibold">{{ item.label }}</p>
        <p class="text-muted-foreground font-mono text-[10px]">{{ item.transition }}</p>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <UiButton size="sm" variant="outline" :disabled="isActive" @click="start()">
        Start Tour
      </UiButton>
      <UiButton size="sm" variant="ghost" @click="reset()"> Reset </UiButton>
    </div>

    <VTour :name="tourName" save-to-local-storage="never" :steps="steps" />
  </div>
</template>

<script lang="ts" setup>
  import type { TourStep } from "#nuxt-tour/types";

  const tourName = "transition-per-step-example";
  const { isActive, start, reset } = useTour(tourName);

  const stepItems = [
    { id: "ex-pstep-fade", label: "Step 1", transition: "fade" },
    { id: "ex-pstep-up", label: "Step 2", transition: "slide-up" },
    { id: "ex-pstep-down", label: "Step 3", transition: "slide-down" },
    { id: "ex-pstep-left", label: "Step 4", transition: "slide-left" },
    { id: "ex-pstep-right", label: "Step 5", transition: "slide-right" },
  ] as const;

  const steps: TourStep[] = [
    {
      target: "#ex-pstep-fade",
      title: "fade",
      body: "No <code class='bg-zinc-200! text-zinc-600!'>transition</code> on this step — falls back to the tour default.",
      popperConfig: { placement: "bottom" },
    },
    {
      target: "#ex-pstep-up",
      title: "slide-up",
      body: 'This step sets <code class="bg-zinc-200! text-zinc-600!">transition: "slide-up"</code>.',
      transition: "slide-up",
      popperConfig: { placement: "bottom" },
    },
    {
      target: "#ex-pstep-down",
      title: "slide-down",
      body: 'This step sets <code class="bg-zinc-200! text-zinc-600!">transition: "slide-down"</code>.',
      transition: "slide-down",
      popperConfig: { placement: "bottom" },
    },
    {
      target: "#ex-pstep-left",
      title: "slide-left",
      body: 'This step sets <code class="bg-zinc-200! text-zinc-600!">transition: "slide-left"</code>.',
      transition: "slide-left",
      popperConfig: { placement: "bottom" },
    },
    {
      target: "#ex-pstep-right",
      title: "slide-right",
      body: 'This step sets <code class="bg-zinc-200! text-zinc-600!">transition: "slide-right"</code>.',
      transition: "slide-right",
      popperConfig: { placement: "bottom" },
    },
  ];
</script>
```

<!-- /automd -->
::

### Available transitions

::prose-field-group{variant="all"}
  :::prose-field{name="fade" defaultValue="default"}
  Opacity fade combined with a subtle scale. The default.
  :::

  :::prose-field{name="slide-up"}
  Tooltip slides upward into view (enters from below).
  :::

  :::prose-field{name="slide-down"}
  Tooltip slides downward into view (enters from above).
  :::

  :::prose-field{name="slide-left"}
  Tooltip slides in from the right.
  :::

  :::prose-field{name="slide-right"}
  Tooltip slides in from the left.
  :::
::

### Usage

```vue
<VTour transition="slide-up" :steps="steps" />
```

::prose-callout{variant="tip" title="Custom transitions"}
You can use any Vue `<Transition>` name by overriding the generated CSS classes. The pattern is `nt-tooltip-{name}-enter-active`, `nt-tooltip-{name}-leave-active`, etc.
::
