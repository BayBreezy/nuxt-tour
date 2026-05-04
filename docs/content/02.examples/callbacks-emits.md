---
title: "Callbacks & Emits"
description: "Listen to tour lifecycle events with Vue emits."
navigation.icon: gravity-ui:function
---

## Callbacks and Emits

`VTour` emits four events you can listen to. A notification fires on each one in the demo below.

::prose-show-case

:ExCallbackEmits

#code
<!-- automd:file src="../../app/components/content/examples/ExCallbackEmits.vue" code name="[CallbacksEmitsExample.vue]" -->

```vue [CallbacksEmitsExample.vue]
<template>
  <div class="not-prose">
    <div v-if="isPlayed" class="flex flex-col items-center text-center">
      <p class="mb-5">Click the button below to restart the tour</p>
      <UiButton size="sm" variant="outline" @click="rerunTour"> Restart Tour </UiButton>
    </div>
    <VTour
      ref="tour"
      :name="tourName"
      :steps="steps"
      @tour:start="
        useSonner('Tour started', {
          description: 'The tour has started',
        })
      "
      @tour:end="
        useTimeoutFn(() => {
          useSonner('Tour completed', {
            description: 'The tour has been completed',
          });
        }, 100)
      "
      @tour:skip="
        useTimeoutFn(() => {
          useSonner('Tour skipped', {
            description: 'The tour was skipped',
          });
        }, 100)
      "
      @tour:step-change="
        ({ from, to }) =>
          useSonner(`Step ${from + 1} → ${to + 1}`, {
            description: 'Step changed',
          })
      "
    />
  </div>
</template>

<script lang="ts" setup>
  import { VTour } from "#components";
  import type { TourStep } from "#nuxt-tour/types";

  const tourName = "callbacks-emits-tour-example";

  const { isPlayed, reset } = useTour(tourName);
  const tour = useTemplateRef<InstanceType<typeof VTour>>("tour");

  const rerunTour = () => reset();

  const steps: TourStep[] = [
    {
      target: "#callbacks-and-emits>a",
      title: "Callbacks and Emits",
      body: "A notification fires on every tour event: start, end, skip, and step change.",
    },
    {
      title: "Step change",
      subText: "Watch the notification",
      body: "Moving to this step fired the <strong>tour:step-change</strong> event.",
    },
  ];

  onMounted(() => {
    tour.value?.startTour();
  });
</script>
```

<!-- /automd -->

::

### Event reference

::prose-field-group{variant="bordered"}
  :::prose-field{name="@tour:start" type="() => void"}
  Fired when the tour begins.
  :::

  :::prose-field{name="@tour:end" type="() => void"}
  Fired when the tour completes normally.
  :::

  :::prose-field{name="@tour:skip" type="() => void"}
  Fired when the user skips the tour.
  :::

  :::prose-field{name="@tour:step-change" type="({ from: number, to: number }) => void"}
  Fired on every step transition. Payload contains the previous (`from`) and next (`to`) step indices.
  :::
::
