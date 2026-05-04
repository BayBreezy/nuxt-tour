<template>
  <div>
    <h1 class="step-1">Step 1 Target</h1>
    <h2 class="step-2">Step 2 Target</h2>
    <h3 class="step-3">Step 3 Target</h3>
    <VTour ref="tour" :steps="steps" />
  </div>
</template>

<script setup lang="ts">
  import type { TourStep } from "#nuxt-tour/types";

  const tour = ref();

  const steps: TourStep[] = [
    { target: ".step-1", title: "Step One", body: "First step body" },
    { target: ".step-2", title: "Step Two", body: "Second step body" },
    { target: ".step-3", title: "Step Three", body: "Third step body" },
  ];
</script>
