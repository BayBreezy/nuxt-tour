<template>
  <div class="not-prose">
    <div v-if="isPlayed">
      <p class="mb-5">Click the button below to restart the tour</p>
      <UiButton size="sm" variant="outline" @click="rerunTour"> Restart Tour </UiButton>
    </div>
    <VTour highlight :show-arrow="false" ref="tour" name="create-tour-example" :steps="steps">
      <template #limitations-body>
        <ul class="mt-4 mb-3 flex list-inside flex-col gap-3 text-sm text-zinc-600">
          <li v-for="l in limitations" :key="l" class="flex items-start gap-3">
            <Icon
              name="heroicons:exclamation-triangle"
              class="mt-1 size-4 shrink-0 text-amber-500"
            />
            {{ l }}
          </li>
        </ul>
      </template>
      <template #startTour-body>
        <ul class="mt-4 mb-3 flex list-inside flex-col gap-3 text-sm text-zinc-600">
          <li v-for="s in waysToStart" :key="s" class="flex items-start gap-3">
            <Icon name="heroicons:check-badge" class="size-5 shrink-0 text-green-500" />
            {{ s }}
          </li>
        </ul>
      </template>
    </VTour>
  </div>
</template>

<script lang="ts" setup>
  import { VTour } from "#components";
  import type { TourStep } from "#nuxt-tour/types";

  const limitations = [
    "The target prop must be a valid CSS selector.",
    "Ensure that the target element is rendered before the tour starts.",
  ];

  const waysToStart = [
    "Manually start by calling startTour() via a template ref",
    "Automatically start by passing the auto-start prop",
    "Start from anywhere with useTour(name).start()",
  ];

  const tour = useTemplateRef<InstanceType<typeof VTour>>("tour");

  const { isPlayed, reset } = useTour("create-tour-example");

  const rerunTour = () => reset();

  const steps: TourStep[] = [
    {
      target: "#add-the-component>a",
      title: "Create a new tour",
      body: "Learn how you can add a new tour to your page.",
      popperConfig: {
        placement: "right-start",
      },
    },
    {
      target: "#limitations",
      title: "Limitations",
      subText: "Be aware of these limitations",
      slot: "limitations",
      backdrop: true,
      popperConfig: {
        placement: "bottom-start",
        modifiers: [{ name: "offset", options: { offset: [0, 5] } }],
      },
    },
    {
      target: "#starting-the-tour>a",
      title: "Start the tour",
      subText: "Three ways to start the tour",
      slot: "startTour",
      popperConfig: { placement: "right-start" },
    },
    {
      target: "#multiple-tours>a",
      title: "Multiple tours",
      body: "Pass a unique name prop to each VTour instance. Once completed, each tour is tracked independently in localStorage.",
      popperConfig: { placement: "right-start" },
    },
  ];

  onMounted(() => {
    tour.value?.startTour();
  });
</script>

<style scoped>
  :deep(#nt-tooltip) {
    max-width: 420px;
  }
</style>
