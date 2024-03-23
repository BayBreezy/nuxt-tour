<template>
  <div class="flex flex-col">
    <DocsNavbar />
    <UiContainer class="grid grid-cols-1 lg:grid-cols-[280px,1fr]">
      <aside class="sticky top-14 h-[calc(100dvh-57px)] w-full overflow-y-auto border-r">
        <UiScrollArea class="h-full">
          <nav class="flex flex-col px-2 py-5">
            <template v-for="n in navigation" :key="n._path">
              <UiButton
                exactActiveClass="bg-muted"
                :to="n._path"
                variant="ghost"
                class="justify-start gap-3"
              >
                <Icon :name="n.icon" class="size-4" />
                {{ n.title }}
              </UiButton>
            </template>
          </nav>
        </UiScrollArea>
      </aside>
      <UiContainer
        class="prose prose-zinc max-w-none py-5 dark:prose-invert prose-headings:font-bold *:prose-headings:font-semibold prose-headings:before:mr-2 prose-headings:before:font-normal prose-headings:before:opacity-40 prose-headings:before:content-['#'] hover:prose-headings:before:opacity-100 *:prose-h2:no-underline prose-code:rounded-md prose-code:bg-muted prose-code:p-1.5 prose-code:before:content-[''] prose-code:after:content-['']"
      >
        <div class="not-prose">
          <h1 class="mb-2 text-4xl font-bold">{{ page.title }}</h1>
          <p class="text-lg text-muted-foreground">{{ page.description }}</p>
          <UiDivider class="my-8" />
        </div>
        <slot />
      </UiContainer>
    </UiContainer>
  </div>
  <VTour autoStart name="home" :steps="steps"> </VTour>
</template>

<script lang="ts" setup>
  import type { TourStep } from "#nuxt-tour/props";

  const { page, navigation } = useContent();

  const steps: TourStep[] = [
    {
      target: "#main-nav",
      title: "The Navbar",
      subText: "Yes, we all know what a navbar is.",
      body: "A navbar at the top of the page. It is sticky and has a toggle theme button.",
      slot: "navbar",
    },
    {
      target: "#toggle-button",
      title: "Toggle Theme",
      subText: "Switch between light and dark mode.",
      body: "Click this button to toggle between light and dark mode.",
      slot: "toggle-theme",
    },
  ];
</script>
