<template>
  <div>
    <div v-if="isPlayed" class="flex flex-col items-center text-center">
      <p class="mb-5">Click the button below to restart the tour</p>
      <UiButton size="sm" variant="outline" @click="rerunTour"> Restart Tour </UiButton>
    </div>
    <div v-else class="text-center">
      <p class="mb-5">The tour will automatically start when the page loads</p>
    </div>
    <VTour auto-start name="autostart-tour-example" :steps="steps" />
  </div>
</template>

<script lang="ts" setup>
  import type { TourStep } from "#nuxt-tour/types";

  const tourName = "autostart-tour-example";

  const { isPlayed, reset } = useTour(tourName);

  const rerunTour = () => reset();

  const steps: TourStep[] = [
    {
      target: "#autostart>a",
      title: "Autostart",
      subText: "The tour starts automatically when the component mounts",
      body: "Pass the <strong>auto-start</strong> prop to the VTour component and it will begin as soon as it is mounted.",
    },
    {
      title: "No target",
      subText: "Steps without a target are centred on screen",
      body: "If no target is provided (or the selector does not match), the tooltip floats in the middle of the viewport.",
    },
  ];
</script>
