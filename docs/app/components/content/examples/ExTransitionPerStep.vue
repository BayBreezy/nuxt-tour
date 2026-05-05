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
