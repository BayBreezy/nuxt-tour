<template>
  <div class="not-prose">
    <div v-if="isPlayed" class="flex flex-col items-center text-center">
      <p class="mb-5">Click the button below to restart the tour</p>
      <UiButton size="sm" variant="outline" @click="rerunTour"> Restart Tour </UiButton>
    </div>
    <VTour
      ref="tour"
      highlight
      backdrop
      :name="tourName"
      :steps="steps"
      :skip-button="skipBtn"
      :next-button="nextBtn"
      :prev-button="prevBtn"
      :finish-button="finishBtn"
    />
  </div>
</template>

<script lang="ts" setup>
  import { VTour } from "#components";
  import type { ButtonConfig, TourStep } from "#nuxt-tour/types";

  const skipBtn: ButtonConfig = {
    label: "I'm good",
    leftIcon: "heroicons:x-circle",
  };
  const nextBtn: ButtonConfig = {
    label: "Move on",
    rightIcon: "heroicons:arrow-right",
  };
  const prevBtn: ButtonConfig = {
    label: "Go back",
    leftIcon: "heroicons:arrow-left",
  };
  const finishBtn: ButtonConfig = {
    label: "All done",
    rightIcon: "heroicons:check-badge",
  };

  const tourName = "custom-button-tour-example";

  const { isPlayed, reset } = useTour(tourName);
  const tour = useTemplateRef<InstanceType<typeof VTour>>("tour");

  const rerunTour = () => reset();

  const steps: TourStep[] = [
    {
      target: "#custom-buttons>a",
      title: "Different buttons",
      body: "Here we are passing a different configuration to each button.",
    },
    {
      target: "#next-btn-code",
      title: "Next button",
      body: "An icon and a custom label have been passed to the next button.",
    },
    {
      target: "#skip-btn-code",
      title: "Skip button",
      body: "An icon and a custom label have been passed to the skip button.",
    },
    {
      target: "#prev-btn-code",
      title: "Previous button",
      body: "An icon and a custom label have been passed to the previous button.",
    },
    {
      target: "#finish-btn-code",
      title: "Finish button",
      body: "An icon and a custom label have been passed to the finish button.",
    },
  ];

  onMounted(() => {
    tour.value?.startTour();
  });
</script>

<style scoped>
  :deep(#nt-tooltip) {
    max-width: 450px;
  }
  :deep(#nt-action-finish) {
    background-color: var(--color-green-600);
    color: white;
  }
</style>
