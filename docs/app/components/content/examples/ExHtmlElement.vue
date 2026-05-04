<template>
  <div class="not-prose">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2 rounded-lg border p-4">
        <p id="htmlToTarget1" class="bg-muted rounded p-2 text-sm">Target element 1</p>
        <p id="htmlToTarget2" class="bg-muted rounded p-2 text-sm">Target element 2</p>
        <p id="htmlToTarget3" class="bg-muted rounded p-2 text-sm">Target element 3</p>
      </div>
      <div v-if="isPlayed" class="flex flex-col items-center text-center">
        <p class="mb-5">Click the button below to restart the tour</p>
        <UiButton size="sm" variant="outline" @click="rerunTour"> Restart Tour </UiButton>
      </div>
      <div v-else class="text-center">
        <p class="mb-5">The tour will automatically start when the page loads</p>
      </div>
    </div>
    <VTour ref="tour" name="html-tour-example" :steps="steps" />
  </div>
</template>

<script lang="ts" setup>
  import { VTour } from "#components";
  import type { TourStep } from "#nuxt-tour/types";

  const tourName = "html-tour-example";

  const { isPlayed, reset } = useTour(tourName);
  const tour = useTemplateRef<InstanceType<typeof VTour>>("tour");

  const htmlTarget1 = ref<HTMLElement | null>(null);
  const htmlTarget2 = ref<HTMLElement | null>(null);
  const htmlTarget3 = ref<HTMLElement | null>(null);

  const rerunTour = () => reset();

  const steps = computed<TourStep[]>(() => [
    {
      target: htmlTarget1.value,
      title: "HTML Elements",
      body: "You can pass an HTMLElement directly as the target.",
    },
    {
      target: htmlTarget2.value,
      title: "HTML Elements",
      body: "This allows for greater flexibility in targeting elements.",
    },
    {
      target: htmlTarget3.value,
      title: "HTML Elements",
      body: "Assign the element in onMounted so the DOM is ready.",
    },
  ]);

  onMounted(() => {
    htmlTarget1.value = document.getElementById("htmlToTarget1");
    htmlTarget2.value = document.getElementById("htmlToTarget2");
    htmlTarget3.value = document.getElementById("htmlToTarget3");
    tour.value?.startTour();
  });
</script>
