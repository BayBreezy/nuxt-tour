<template>
  <div class="not-prose">
    <VTour name="create-tour-example" :steps="steps" ref="tour">
      <template #limitations-body>
        <ul class="mb-3 mt-4 flex list-inside flex-col gap-3 text-sm text-zinc-600">
          <li class="flex items-start gap-3" v-for="l in limitations" :key="l">
            <Icon
              name="heroicons:exclamation-triangle"
              class="mt-1 size-4 shrink-0 text-amber-500"
            />
            {{ l }}
          </li>
        </ul>
      </template>
      <template #startTour-body>
        <ul class="mb-3 mt-4 flex list-inside flex-col gap-3 text-sm text-zinc-600">
          <li class="flex items-start gap-3" v-for="s in waysToStart" :key="s">
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
  import type { TourStep } from "#nuxt-tour/props";

  const limitations = [
    "Only one VTour component can be used per page.",
    "The target prop must be a valid CSS selector.",
    "Ensure that the target element is rendered before the tour is initialized.",
  ];

  const waysToStart = [
    "Manually start by calling the startTour method",
    "Automatically start by passing the  autoStart prop",
  ];

  const tour = ref<InstanceType<typeof VTour> | null>(null);

  const steps: TourStep[] = [
    {
      target: "#add-the-component>a",
      title: "Create a new tour",
      body: "Learn how you can add a new tour to you page",
    },
    {
      target: "#limitations>a",
      title: "Limitations",
      subText: "Be aware of these limitations",
      slot: "limitations",
      popperConfig: {
        placement: "right-start",
      },
    },
    {
      target: "#start-the-tour>a",
      title: "Start the tour",
      subText: "Two ways to start the tour",
      slot: "startTour",
      popperConfig: {
        placement: "right-start",
      },
    },
    {
      target: "#multiple-tours>a",
      title: "Multiple tours",
      body: "You can create multiple tours within your application. Simply pass a name to the tour component. Once the user has completed a tour, the tour will not be shown again(unless the user clears their local storage).",
      popperConfig: {
        placement: "right-start",
      },
    },
  ];

  onMounted(() => {
    tour.value?.startTour();
  });
</script>

<style scoped>
  #nt-tooltip {
    max-width: 400px;
  }
</style>
