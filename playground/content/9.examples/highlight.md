---
title: Highlight
description: Highlight elements on a page to guide users through a tour.
icon: heroicons:camera
---

## Highlight

Passing the `highlight` prop to the `VTour` component will allow you to highlight elements on the page as the tour progresses.

Feel free to update the css classes to match your project's design system.

:ExHighlight

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
      <VTour highlight ref="tour" :name="tourName" :steps="steps" />
    </div>
  </Showcase>
</template>

<script lang="ts" setup>
  import { useStorage } from "@vueuse/core";
  import { VTour } from "#components";
  import type { TourStep } from "#nuxt-tour/props";

  const tourName = "highlight-tour-example";

  const tourVisible = useStorage(`nt-${tourName}`, false);
  // Store the tour component in a ref
  const tour = ref<InstanceType<typeof VTour> | null>(null);
  // define the steps for the tour
  const steps: TourStep[] = [
    {
      target: "#highlight>a",
      title: "This will be highlighted",
      body: "Setting the highlight prop to true will highlight the target element",
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
```
