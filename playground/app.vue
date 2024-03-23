<template>
  <div>
    <UiContainer class="flex h-dvh items-center justify-center py-10">
      <div id="first-button">
        <UiButton text="Hey there!" />
      </div>
    </UiContainer>
    <UiContainer class="flex h-dvh items-end py-10">
      <div id="second-button">
        <UiButton text="Hey there!" />
      </div>
    </UiContainer>
    <UiContainer class="flex h-dvh items-end py-10">
      <div id="third-button">
        <UiButton text="Hey there!" />
      </div>
    </UiContainer>
  </div>

  <VTour highlight autoStart ref="tour" :steps="steps">
    <template #second-body>
      <div>
        <p class="text-green-500">This is the second button</p>
      </div>
    </template>
  </VTour>
</template>

<script setup lang="ts">
  import { VTour } from "#components";
  import type { TourStep } from "#build/nuxt-tour";

  const steps: TourStep[] = [
    {
      target: "#first-button",
      title: "First Button",
      subText: "This is the first button subtext",
      body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      popperConfig: {
        placement: "top",
      },
    },
    {
      target: "#second-button",
      body: "This is the second button",
      slot: "second",
    },
    {
      title: "No target",
      subText: "This is what happens when you don't pass a target element.",
      body: "Passing no target to the step will make the step appear in the center of the screen. The page will scroll up to the step if it's not in the viewport.",
    },
    {
      target: "#third-button",
      body: "This is the third button",
      slot: "third",
    },
  ];

  const tour = ref<InstanceType<typeof VTour> | null>(null);
</script>
