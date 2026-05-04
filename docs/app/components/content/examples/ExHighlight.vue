<template>
  <div class="not-prose">
    <div v-if="isPlayed" class="flex flex-col items-center text-center">
      <p class="mb-5">Click the button below to restart the tour</p>
      <UiButton size="sm" variant="outline" @click="rerunTour"> Restart Tour </UiButton>
    </div>
    <div v-else class="text-center">
      <p class="mb-5">The tour will automatically start when the page loads</p>
    </div>
    <VTour ref="tour" highlight backdrop :name="tourName" :steps="steps" />
  </div>
</template>

<script lang="ts" setup>
  import { VTour } from "#components";
  import type { TourStep } from "#nuxt-tour/types";

  const tourName = "highlight-tour-example";

  const { isPlayed, reset } = useTour(tourName);
  const tour = useTemplateRef<InstanceType<typeof VTour>>("tour");

  const rerunTour = () => reset();

  const steps: TourStep[] = [
    {
      target: "#highlight>a",
      title: "This will be highlighted",
      body: "Setting the highlight prop to true will highlight the target element",
    },
  ];

  onMounted(() => {
    tour.value?.startTour();
  });
</script>
