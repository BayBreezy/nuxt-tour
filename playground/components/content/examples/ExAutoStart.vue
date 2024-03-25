<template>
  <Showcase>
    <div class="not-prose">
      <div
        v-if="tourVisible"
        class="flex flex-col items-center text-center"
      >
        <p class="mb-5">
          Click the button below to restart the tour
        </p>
        <UiButton
          size="sm"
          variant="outline"
          @click="rerunTour"
        >
          Restart Tour
        </UiButton>
      </div>
      <div
        v-else
        class="text-center"
      >
        <p class="mb-5">
          The tour will automatically start when the page loads
        </p>
      </div>
      <VTour
        ref="tour"
        name="autostart-tour-example"
        :steps="steps"
      />
    </div>
  </Showcase>
</template>

<script lang="ts" setup>
  import { useStorage } from "@vueuse/core";
  import { VTour } from "#components";
  import type { TourStep } from "#nuxt-tour/props";

  const tourName = "autostart-tour-example";

  const tourVisible = useStorage(`nt-${tourName}`, false);
  // Store the tour component in a ref
  const tour = ref<InstanceType<typeof VTour> | null>(null);
  // define the steps for the tour
  const steps: TourStep[] = [
    {
      target: "#autostart>a",
      title: "Autostart",
      subText: "The tour will automatically start when the page loads",
      body: "This is the easier way of starting your tour. Simply pass the prop <strong>autoStart</strong> to the tour component",
    },
    {
      title: "No target",
      subText: "Weird things can happen",
      body: "Expect this type of thing when no target is specified. Always try to pass a target lol.",
    },
  ];

  // Don't mind this. Its just a function to restart the tour
  // if you want to see it again in action.
  const rerunTour = () => {
    tour.value?.resetTour();
  };

  onMounted(() => {
    tour.value?.startTour();
  });
</script>
