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
