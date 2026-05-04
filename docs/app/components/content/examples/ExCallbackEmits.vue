<template>
  <div class="not-prose">
    <div v-if="isPlayed" class="flex flex-col items-center text-center">
      <p class="mb-5">Click the button below to restart the tour</p>
      <UiButton size="sm" variant="outline" @click="rerunTour"> Restart Tour </UiButton>
    </div>
    <VTour
      ref="tour"
      :name="tourName"
      :steps="steps"
      @tour:start="
        useSonner('Tour started', {
          description: 'The tour has started',
        })
      "
      @tour:end="
        useTimeoutFn(() => {
          useSonner('Tour completed', {
            description: 'The tour has been completed',
          });
        }, 100)
      "
      @tour:skip="
        useTimeoutFn(() => {
          useSonner('Tour skipped', {
            description: 'The tour was skipped',
          });
        }, 100)
      "
      @tour:step-change="
        ({ from, to }) =>
          useSonner(`Step ${from + 1} → ${to + 1}`, {
            description: 'Step changed',
          })
      "
    />
  </div>
</template>

<script lang="ts" setup>
  import { VTour } from "#components";
  import type { TourStep } from "#nuxt-tour/types";

  const tourName = "callbacks-emits-tour-example";

  const { isPlayed, reset } = useTour(tourName);
  const tour = useTemplateRef<InstanceType<typeof VTour>>("tour");

  const rerunTour = () => reset();

  const steps: TourStep[] = [
    {
      target: "#callbacks-and-emits>a",
      title: "Callbacks and Emits",
      body: "A notification fires on every tour event: start, end, skip, and step change.",
    },
    {
      title: "Step change",
      subText: "Watch the notification",
      body: "Moving to this step fired the <strong>tour:step-change</strong> event.",
    },
  ];

  onMounted(() => {
    tour.value?.startTour();
  });
</script>
