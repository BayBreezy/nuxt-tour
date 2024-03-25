<template>
  <div>
    <UiScrollArea class="h-full">
      <nav class="flex flex-col gap-2 px-2 py-5">
        <template
          v-for="n in navigation"
          :key="n._path"
        >
          <template v-if="!n.children">
            <UiButton
              exact-active-class="bg-muted"
              :to="n._path"
              variant="ghost"
              size="sm"
              class="group justify-start gap-3"
            >
              <Icon
                :name="n.icon"
                class="size-4 text-muted-foreground group-aria-[current]:text-foreground"
              />
              {{ n.title }}
            </UiButton>
          </template>
          <template v-else>
            <div>
              <p class="mt-5 pl-3 text-sm font-semibold">
                {{ n.title }}
              </p>
              <DocsNavlink :navigation="n.children" />
            </div>
          </template>
        </template>
      </nav>
    </UiScrollArea>
  </div>
</template>

<script lang="ts" setup>
  import type { NavItem } from "@nuxt/content/types";

  defineProps<{
    navigation: NavItem[];
  }>();
</script>
