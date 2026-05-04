---
title: Highlight
description: Highlight elements on a page to guide users through a tour.
navigation.icon: heroicons:camera
---

## Highlight

Pass `highlight` (and optionally `backdrop`) to `VTour` to visually focus the current target element.

::prose-show-case

:ExHighlight

#code

<!-- automd:file src="../../app/components/content/examples/ExHighlight.vue" code name="[HighlightExample.vue]" -->

```vue [HighlightExample.vue]
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
```

<!-- /automd -->
::

### Customising the highlight

Override the highlight colour and offset with CSS variables:

```css
#nt-tooltip {
  --nt-highlight-color: #f59e0b;
  --nt-highlight-offset: 6px;
  --nt-highlight-radius: 8px;
}
```

You can also enable highlighting on individual steps only by setting `backdrop: true` on the step definition rather than the component:

```ts
const steps: TourStep[] = [
  {
    target: ".important-button",
    title: "Key action",
    body: "This step has its own backdrop.",
    backdrop: true,
  },
];
```
