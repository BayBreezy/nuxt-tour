---
title: Custom Buttons
description: See how you can customize the buttons in the tour.
icon: ic:baseline-smart-button
---

## Custom Buttons

We can change the look and feel of the buttons in the tour by passing an object to the respective button props. The props are:

- <code id="next-btn-code">nextButton</code>
- <code id="skip-btn-code">skipButton</code>
- <code id="prev-btn-code">prevButton</code>
- <code id="finish-btn-code">finishButton</code>

The color of the finish button can be changed by adding a style tag to the SFC.

```vue
<style scoped>
  #nt-tooltip {
    max-width: 400px;
  }
  :deep(#nt-action-finish) {
    @apply bg-green-600 text-white;
  }
</style>
```

:ExCustomButton{.mt-7}

### The code

```vue
<template>
  <Showcase>
    <div class="not-prose">
      <div class="flex flex-col items-center text-center" v-if="tourVisible">
        <p class="mb-5">Click the button below to restart the tour</p>
        <UiButton @click="rerunTour" size="sm" variant="outline">Restart Tour</UiButton>
      </div>
      <div v-else class="text-center">
        <p class="mb-5">The tour will automatically start when the page loads</p>
      </div>
      <!-- This is what matters, not the stuff above -->
      <VTour
        highlight
        ref="tour"
        :name="tourName"
        :steps="steps"
        :skipButton="skipBtn"
        :nextButton="nextBtn"
        :prevButton="prevButton"
        :finishButton="finishButton"
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
  #nt-tooltip {
    max-width: 400px;
  }
  :deep(#nt-action-finish) {
    @apply bg-green-600 text-white;
  }
</style>
```
