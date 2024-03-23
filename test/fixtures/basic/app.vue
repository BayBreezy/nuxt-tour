<template>
  <div>
    <div class="container">
      <h1 class="target">
        Target 1
      </h1>
    </div>
  </div>
  <VTour
    auto-start
    :steps="steps"
  />
</template>

<script setup lang="ts">
  import type { TourStep } from "#nuxt-tour/props";

  const steps: TourStep[] = [
    {
      target: ".target",
      body: "This is the first step",
      title: "Welcome to the tour",
      subText: "This is the subtext",
    },
  ];
</script>

<style>
  .container {
    margin: 0 auto;
    width: 100%;
    max-width: 1200px;
    padding: 10px 20px;
  }
</style>
