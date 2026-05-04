<template>
  <div class="not-prose flex flex-col gap-6">
    <p class="text-muted-foreground text-center text-sm">
      Three storage modes — pick one, run the tour, then refresh the page to see the difference.
    </p>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div
        v-for="mode in modes"
        :key="mode.value"
        class="flex flex-col gap-3 rounded-lg border p-4"
      >
        <div>
          <p class="font-mono text-sm font-semibold">{{ mode.value }}</p>
          <p class="text-muted-foreground mt-1 text-xs">{{ mode.description }}</p>
        </div>
        <div class="flex items-center gap-2">
          <UiButton size="sm" variant="outline" @click="startMode(mode.value)"> Start </UiButton>
          <UiButton size="sm" variant="ghost" @click="resetMode(mode.value)"> Reset </UiButton>
        </div>
        <p class="text-muted-foreground text-xs">
          {{ tourStateLabel(mode.value) }}
        </p>
      </div>
    </div>

    <VTour :name="`storage-never-example`" save-to-local-storage="never" :steps="steps" />
    <VTour :name="`storage-step-example`" save-to-local-storage="step" :steps="steps" />
    <VTour :name="`storage-end-example`" save-to-local-storage="end" :steps="steps" />
  </div>
</template>

<script lang="ts" setup>
  import type { TourStep } from "#nuxt-tour/types";

  const modes = [
    {
      value: "never" as const,
      description: "Tour always shows — nothing is saved to localStorage.",
    },
    {
      value: "step" as const,
      description: "Progress is saved after each step. Refresh mid-tour and it resumes.",
    },
    {
      value: "end" as const,
      description: "Saved only when the tour finishes. Default behaviour.",
    },
  ];

  const neverTour = useTour("storage-never-example");
  const stepTour = useTour("storage-step-example");
  const endTour = useTour("storage-end-example");

  const tourMap = {
    never: neverTour,
    step: stepTour,
    end: endTour,
  };

  const startMode = (mode: "never" | "step" | "end") => tourMap[mode].start();
  const resetMode = (mode: "never" | "step" | "end") => tourMap[mode].reset();

  const tourStateLabel = (mode: "never" | "step" | "end") => {
    const t = tourMap[mode];
    if (t.isActive.value)
      return `Running — step ${t.currentStep.value + 1} of ${t.totalSteps.value}`;
    if (t.isPlayed.value) return `Completed`;
    return `Not started`;
  };

  const steps: TourStep[] = [
    {
      title: "Step one",
      body: "This is the first step of the tour.",
    },
    {
      title: "Step two",
      body: "Close the browser tab now and reopen it — see what happens depending on the mode.",
    },
    {
      title: "Step three",
      body: "You made it to the end!",
    },
  ];
</script>
