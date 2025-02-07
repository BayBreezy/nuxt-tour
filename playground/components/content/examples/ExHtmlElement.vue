<template>
  <div>
    <div>
      <p id="htmlToTarget1" class="inline-block">Sample element for targeting</p>
    </div>
    <div>
      <p id="htmlToTarget2" class="inline-block">Sample element for targeting</p>
    </div>
    <div>
      <p id="htmlToTarget3" class="inline-block">Sample element for targeting</p>
    </div>
    <Showcase>
      <div class="not-prose">
        <div v-if="tourVisible" class="flex flex-col items-center text-center">
          <p class="mb-5">Click the button below to restart the tour</p>
          <UiButton size="sm" variant="outline" @click="rerunTour"> Restart Tour </UiButton>
        </div>
        <div v-else class="text-center">
          <p class="mb-5">The tour will automatically start when the page loads</p>
        </div>
        <VTour ref="tour" name="html-tour-example" :steps="steps" />
      </div>
    </Showcase>
  </div>
</template>

<script lang="ts" setup>
  import { useStorage } from "@vueuse/core";
  import { VTour } from "#components";
  import type { TourStep } from "#nuxt-tour/props";

  const tourName = "html-tour-example";

  const tourVisible = useStorage(`nt-${tourName}`, false);
  // Store the tour component in a ref
  const tour = ref<InstanceType<typeof VTour> | null>(null);
  // define the steps for the tour
  const htmlTarget1 = ref<HTMLElement | null>(null);
  const htmlTarget2 = ref<HTMLElement | null>(null);
  const htmlTarget3 = ref<HTMLElement | null>(null);

  const steps = computed<TourStep[]>(() => {
    return [
      {
        target: htmlTarget1.value,
        title: "HTML Elements",
        body: "You can also provide the HTML element as a target",
      },
      {
        target: htmlTarget2.value,
        title: "HTML Elements",
        body: "This allows for greater flexibility in targeting elements",
      },
      {
        target: htmlTarget3.value,
        title: "HTML Elements",
        body: "To make sure the DOM is fully rendered assign the element only in the onMounted hook",
      },
    ];
  });

  // Don't mind this. Its just a function to restart the tour
  // if you want to see it again in action.
  const rerunTour = () => {
    tour.value?.resetTour();
  };

  onMounted(() => {
    htmlTarget1.value = document.getElementById("htmlToTarget1");
    htmlTarget2.value = document.getElementById("htmlToTarget2");
    htmlTarget3.value = document.getElementById("htmlToTarget3");

    console.log("target", steps);
    tour.value?.startTour();
  });
</script>
