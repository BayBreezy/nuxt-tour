<template>
  <Showcase>
    <div class="not-prose">
      <div v-if="tourVisible" class="flex flex-col items-center text-center">
        <p class="mb-5">Click the button below to restart the tour</p>
        <UiButton size="sm" variant="outline" @click="rerunTour"> Restart Tour </UiButton>
      </div>
      <div v-else class="text-center">
        <p class="mb-5">The tour will automatically start when the page loads</p>
      </div>
      <!-- This is what matters, not the stuff above -->
      <VTour
        ref="tour"
        highlight
        backdrop
        :name="tourName"
        :steps="steps"
        :skip-button="skipBtn"
        :next-button="nextBtn"
        :prev-button="prevButton"
        :finish-button="finishButton"
      />
    </div>
  </Showcase>
</template>

<script lang="ts" setup>
  import { useStorage } from "@vueuse/core";
  import { VTour } from "#components";
  import type { ButtonProp, TourStep } from "#nuxt-tour/props";

  const skipBtn: ButtonProp = {
    label: "I'm good",
    leftIcon: "heroicons:x-circle",
  };
  const nextBtn: ButtonProp = {
    label: "Move on",
    rightIcon: "heroicons:arrow-right",
  };
  const prevButton: ButtonProp = {
    label: "Go back",
    leftIcon: "heroicons:arrow-left",
  };
  const finishButton: ButtonProp = {
    label: "All done",
    rightIcon: "heroicons:check-badge",
  };

  const tourName = "custom-button-tour-example";

  const tourVisible = useStorage(`nt-${tourName}`, false);
  // Store the tour component in a ref
  const tour = ref<InstanceType<typeof VTour> | null>(null);
  // define the steps for the tour
  const steps: TourStep[] = [
    {
      target: "#custom-buttons>a",
      title: "Different buttons",
      body: "Here we are passing a different configuration to each button.",
    },
    {
      target: "#next-btn-code",
      title: "Next button",
      body: "Here we are passing an icon and a new label to the next button.",
    },
    {
      target: "#skip-btn-code",
      title: "Skip button",
      body: "Here we are passing an icon and a new label to the skip button.",
    },
    {
      target: "#prev-btn-code",
      title: "Previous button",
      body: "Here we are passing an icon and a new label to the previous button.",
    },
    {
      target: "#finish-btn-code",
      title: "Finish button",
      body: "Here we are passing an icon and a new label to the finish button.",
    },
  ];

  // Don't mind this. Its just a function to restart the tour
  // if you want to see it again in action.
  const rerunTour = () => {
    tour.value?.resetTour();
  };

  onMounted(() => {
    tour.value?.startTour();
  });
</script>

<style scoped>
  :deep(#nt-tooltip) {
    max-width: 450px;
  }
  :deep(#nt-action-finish) {
    @apply bg-green-600 text-white;
  }
</style>
