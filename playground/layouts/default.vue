<template>
  <ConfigProvider :use-id="useIdFunction">
    <div class="flex flex-col">
      <DocsNavbar />
      <UiContainer
        class="grid grid-cols-1 md:grid-cols-[230px,1fr] md:gap-5 lg:grid-cols-[260px,1fr] lg:gap-7 xl:grid-cols-[280px,1fr]"
      >
        <aside class="sticky top-14 hidden h-[calc(100dvh-57px)] w-full border-r lg:block">
          <DocsNavlink />
        </aside>
        <div class="grid xl:grid-cols-[1fr,280px] xl:gap-7">
          <div
            class="prose mx-auto w-full min-w-0 max-w-none py-5 dark:prose-invert lg:container lg:prose-base prose-headings:scroll-mt-16 prose-headings:tracking-tight prose-h2:mt-6 prose-h2:border-b prose-h2:pb-3 first:prose-h2:mt-10 prose-a:decoration-primary prose-a:decoration-wavy prose-a:underline-offset-2 hover:prose-a:text-primary lg:prose-pre:text-base"
          >
            <div class="not-prose">
              <h1 class="mb-2 text-4xl font-bold">
                {{ page.title }}
              </h1>
              <p class="text-lg text-muted-foreground">
                {{ page.description }}
              </p>
              <UiDivider class="my-8" />
            </div>
            <slot />
            <DocsFooter />
          </div>
          <aside
            class="sticky top-14 hidden h-[calc(100dvh-57px)] overflow-y-auto px-3 py-5 xl:block"
          >
            <p class="mb-4 flex items-center gap-3 text-sm font-semibold">
              On this page
            </p>

            <nav>
              <DocsToc
                :set-active="setActive"
                :active-id="activeId"
                :links="toc.links"
              />
            </nav>
          </aside>
        </div>
      </UiContainer>
    </div>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from "radix-vue";
  import { useActiveScroll } from "vue-use-active-scroll";

  const useIdFunction = () => useId();

  const { page, toc } = useContent();

  const ids = computed(() =>
    toc.value?.links?.flatMap(({ id, children = [] }: any) => [
      id,
      ...children.map(({ id }: any) => id), // Flatten any nested link
    ])
  );
  const { setActive, activeId } = useActiveScroll(ids, {
    replaceHash: true,
    overlayHeight: 100,
  });

  useHead({
    htmlAttrs: {
      class: "scroll-smooth",
    },
  });
</script>
