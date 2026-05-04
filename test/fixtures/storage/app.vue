<template>
  <div>
    <h1 class="target">Storage test target</h1>
    <VTour name="storage-test" :auto-start="true" save-to-local-storage="end" :steps="steps" />
  </div>
</template>

<script setup lang="ts">
  import type { TourStep } from "#nuxt-tour/types";

  const steps: TourStep[] = [
    { target: ".target", title: "Storage tour", body: "Testing storage behaviour" },
  ];
</script>
