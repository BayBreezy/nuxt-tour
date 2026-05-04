<template>
  <div class="not-prose">
    <div v-if="isPlayed" class="flex flex-col items-center text-center">
      <p class="mb-5">Click the button below to restart the tour</p>
      <UiButton size="sm" variant="outline" @click="rerunTour"> Restart Tour </UiButton>
    </div>
    <div v-else class="text-center">
      <p class="mb-5">The tour will automatically start when the page loads</p>
    </div>
    <VTour ref="tour" :name="tourName" :steps="steps" show-progress>
      <template #progress="{ currentStep, totalSteps, progress }">
        <div class="mb-1 flex items-center justify-between text-xs text-zinc-400">
          <span>Step {{ currentStep + 1 }} / {{ totalSteps }}</span>
          <span>{{ Math.round(progress * 100) }}%</span>
        </div>
        <div class="h-1 w-full overflow-hidden rounded-full bg-zinc-100">
          <div
            class="h-full rounded-full bg-sky-500 transition-all duration-300"
            :style="{ width: `${progress * 100}%` }"
          />
        </div>
      </template>
    </VTour>
  </div>
</template>

<script lang="ts" setup>
  import { VTour } from "#components";
  import type { TourStep } from "#nuxt-tour/types";

  const tourName = "progress-tour-example";

  const { isPlayed, reset } = useTour(tourName);
  const tour = useTemplateRef<InstanceType<typeof VTour>>("tour");

  const rerunTour = () => reset();

  const steps: TourStep[] = [
    {
      target: "#progress>a",
      title: "Progress indicator",
      body: "Pass the <strong>show-progress</strong> prop to enable a built-in step counter.",
    },
    {
      title: "Custom progress slot",
      subText: "Full control over the indicator",
      body: "Use the <strong>#progress</strong> slot to render your own indicator — a bar, dots, or anything you like.",
    },
    {
      title: "Slot props",
      body: "The slot receives <strong>currentStep</strong>, <strong>totalSteps</strong>, and <strong>progress</strong> (0–1) so you can drive any UI.",
    },
  ];

  onMounted(() => {
    tour.value?.startTour();
  });
</script>
