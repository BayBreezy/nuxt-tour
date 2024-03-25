---
title: "Callbacks & Emits"
description: "See how you can use the different emits and callbacks available in the tour component."
icon: gravity-ui:function
---

## Callbacks and Emits

The following are functions that can be passed to the `VTour` component:

- `complete`: This function is called when the tour is completed. (It should be passed as `@complete=""`)
- `skip`: This function is called when the tour is skipped. (It should be passed as `@skip=""`)

The following are emits that can be listened to:

- `onTourStart`: This event is emitted when the tour starts.
- `onTourEnd`: This event is emitted when the tour ends.

:ExCallbackEmits

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
      <VTour
        @complete="
          useTimeoutFn(() => {
            useSonner('Complete', {
              description: 'The tour has been completed',
            });
          }, 100)
        "
        @skip="
          useTimeoutFn(() => {
            useSonner('Skipped', {
              description: 'The tour has been skipped',
            });
          }, 200)
        "
        @onTourStart="
          useSonner('Tour Start', {
            description: 'The tour has started',
          })
        "
        @onTourEnd="
          useTimeoutFn(() => {
            useSonner('Tour End', {
              description: 'The tour has ended',
            });
          }, 300)
        "
        ref="tour"
        :name="tourName"
        :steps="steps"
      />
    </div>
  </Showcase>
</template>

<script lang="ts" setup>
  import { useStorage } from "@vueuse/core";
  import { VTour } from "#components";
  import type { TourStep } from "#nuxt-tour/props";

  const tourName = "callbacks-emits-tour-example";

  const tourVisible = useStorage(`nt-${tourName}`, false);
  // Store the tour component in a ref
  const tour = ref<InstanceType<typeof VTour> | null>(null);
  // define the steps for the tour
  const steps: TourStep[] = [
    {
      target: "#callbacks-and-emits>a",
      title: "Callbacks and Emits",
      body: "A notification will be displayed when the tour starts, ends, is skipped, or is completed.",
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
