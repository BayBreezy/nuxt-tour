---
title: "useTour() composable"
description: "Control a tour from outside the component using the useTour() composable."
navigation.icon: heroicons:command-line
---

## useTour() composable

`useTour(name)` returns reactive state and control methods for any named tour. Call it from a parent component, a Pinia store, or any composable — no template ref required.

::prose-show-case

:ExComposable

#code

<!-- automd:file src="../../app/components/content/examples/ExComposable.vue" code name="[ComposableExample.vue]" -->

```vue [ComposableExample.vue]
<template>
  <div class="not-prose">
    <div class="flex flex-col gap-4">
      <!-- Feature cards the tour will point at -->
      <div class="grid grid-cols-3 gap-3">
        <div id="ex-composable-state" class="bg-muted rounded-lg border p-3 text-center">
          <p class="text-xs font-semibold">Reactive state</p>
          <p class="text-muted-foreground mt-1 text-xs">isActive · currentStep · progress</p>
        </div>
        <div id="ex-composable-controls" class="bg-muted rounded-lg border p-3 text-center">
          <p class="text-xs font-semibold">Controls</p>
          <p class="text-muted-foreground mt-1 text-xs">start · end · skip · reset</p>
        </div>
        <div id="ex-composable-storage" class="bg-muted rounded-lg border p-3 text-center">
          <p class="text-xs font-semibold">Storage helpers</p>
          <p class="text-muted-foreground mt-1 text-xs">markPlayed · markUnplayed</p>
        </div>
      </div>

      <!-- Control buttons -->
      <div class="flex items-center justify-between">
        <div class="flex gap-2">
          <UiButton
            id="ex-composable-start-btn"
            size="sm"
            variant="outline"
            :disabled="isActive"
            @click="start()"
          >
            Start Tour
          </UiButton>
          <UiButton size="sm" variant="outline" :disabled="!isActive" @click="end()">
            End Tour
          </UiButton>
          <UiButton size="sm" variant="outline" :disabled="isActive" @click="reset()">
            Reset
          </UiButton>
        </div>
        <p class="text-muted-foreground text-xs">
          Status:
          <span class="font-medium">
            {{
              isActive
                ? `Step ${currentStep + 1} of ${totalSteps}`
                : isPlayed
                  ? "Completed"
                  : "Not started"
            }}
          </span>
        </p>
      </div>
    </div>

    <VTour :name="tourName" :steps="steps" />
  </div>
</template>

<script lang="ts" setup>
  import type { TourStep } from "#nuxt-tour/types";

  const tourName = "composable-tour-example";

  const { isPlayed, isActive, currentStep, totalSteps, start, end, reset } = useTour(tourName);

  const steps: TourStep[] = [
    {
      target: "#ex-composable-start-btn",
      title: "useTour() composable",
      body: "Call <strong>start()</strong> from any component — no template ref required. The composable drives the tour through a shared registry.",
      popperConfig: { placement: "top" },
    },
    {
      target: "#ex-composable-state",
      title: "Reactive state",
      subText: "Always in sync",
      body: "<strong>isActive</strong>, <strong>currentStep</strong>, <strong>totalSteps</strong>, and <strong>progress</strong> update reactively as the tour runs.",
      popperConfig: { placement: "bottom" },
    },
    {
      target: "#ex-composable-controls",
      title: "Controls from anywhere",
      subText: "start · end · skip · next · prev · goTo · pause · resume · reset",
      body: "All methods proxy through the registry so any component can control the same tour, even before <strong>&lt;VTour /&gt;</strong> has mounted.",
      popperConfig: { placement: "bottom" },
    },
    {
      target: "#ex-composable-storage",
      title: "Storage helpers",
      subText: "Work independently of the component",
      body: "<strong>markPlayed()</strong> and <strong>markUnplayed()</strong> read/write localStorage without starting or stopping the tour.",
      popperConfig: { placement: "bottom" },
    },
  ];
</script>
```

<!-- /automd -->


### Available state and methods

::prose-field-group{variant="all"}
  :::prose-field{name="isPlayed" type="boolean"}
  `true` once the tour has been completed or skipped.
  :::

  :::prose-field{name="isActive" type="boolean"}
  `true` while the tour is currently running.
  :::

  :::prose-field{name="isPaused" type="boolean"}
  `true` while the tour is paused.
  :::

  :::prose-field{name="currentStep" type="number"}
  Current step index (0-based).
  :::

  :::prose-field{name="totalSteps" type="number"}
  Total number of steps.
  :::

  :::prose-field{name="progress" type="number"}
  Fraction complete: `(currentStep + 1) / totalSteps`.
  :::

  :::prose-field{name="lastPlayedAt" type="Date | null"}
  When the tour was last completed.
  :::

  :::prose-field{name="completionStatus" type="'completed' | 'skipped' | null"}
  How the tour was last closed.
  :::

  :::prose-field{name="start / end / skip / next / prev / pause / resume" type="() => void"}
  Tour control methods. `start()` is queued if the component is not yet mounted.
  :::

  :::prose-field{name="goTo" type="(step: number) => void"}
  Jump to a step by index.
  :::

  :::prose-field{name="markPlayed / markUnplayed" type="() => void"}
  Update stored state without starting or restarting the tour.
  :::

  :::prose-field{name="reset" type="() => void"}
  Clear storage and restart the tour.
  :::
::
