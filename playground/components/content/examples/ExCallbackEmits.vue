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
        :name="tourName"
        :steps="steps"
        @complete="
          useTimeoutFn(() => {
            useSonner('Complete', {
              description: 'The tour has been completed',
            });
          }, 100)
        "
        @skip="
          useTimeoutFn(() => {
            useSonner('Skipped', {
              description: 'The tour has been skipped',
            });
          }, 200)
        "
        @on-tour-start="
          useSonner('Tour Start', {
            description: 'The tour has started',
          })
        "
        @on-tour-end="
          useTimeoutFn(() => {
            useSonner('Tour End', {
              description: 'The tour has ended',
            });
          }, 300)
        "
      />
    </div>
  </Showcase>
</template>

<script lang="ts" setup>
  import { useStorage } from "@vueuse/core";
  import { VTour } from "#components";
  import type { TourStep } from "#nuxt-tour/props";

  const tourName = "callbacks-emits-tour-example";

  const tourVisible = useStorage(`nt-${tourName}`, false);
  // Store the tour component in a ref
  const tour = ref<InstanceType<typeof VTour> | null>(null);
  // define the steps for the tour
  const steps: TourStep[] = [
    {
      target: "#callbacks-and-emits>a",
      title: "Callbacks and Emits",
      body: "A notification will be displayed when the tour starts, ends, is skipped, or is completed.",
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
