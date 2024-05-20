<template>
  <UiNavbar id="main-nav" sticky>
    <UiContainer class="flex h-14 items-center justify-between">
      <div class="flex items-center gap-3">
        <UiButton
          size="icon-sm"
          variant="outline"
          class="h-9 w-9 md:hidden"
          @click="mobileNav = true"
        >
          <Icon name="heroicons:bars-2" class="size-4" />
        </UiButton>
        <NuxtLink class="text-lg font-semibold" to="/"> Nuxt Tour </NuxtLink>
      </div>
      <div class="flex items-center gap-2">
        <UiButton
          id="toggle-button"
          aria-label="Toggle theme"
          title="Toggle theme"
          size="icon-sm"
          variant="ghost"
          @click="toggleTheme"
        >
          <Icon class="size-5" name="lucide:sun-medium" />
        </UiButton>
        <UiButton
          external
          aria-label="Visit the GitHub repository for Nuxt Tour"
          title="Visit the GitHub repository for Nuxt Tour"
          target="_blank"
          to="https://github.com/BayBreezy/nuxt-tour"
          size="icon-sm"
          variant="ghost"
        >
          <Icon class="size-5" name="bi:github" />
        </UiButton>
      </div>
    </UiContainer>
  </UiNavbar>
  <UiSheet v-model:open="mobileNav">
    <UiSheetContent class="p-1">
      <template #content>
        <UiSheetTitle title="Mobile menu" class="sr-only" />
        <UiSheetDescription description="A list of navigation items for mobile" class="sr-only" />
        <DocsNavlink :navigation="navigation" />
      </template>
    </UiSheetContent>
  </UiSheet>
</template>

<script lang="ts" setup>
  const theme = useColorMode();
  const toggleTheme = () => {
    theme.preference = theme.value === "dark" ? "light" : "dark";
  };

  const { navigation } = useContent();
  const mobileNav = ref(false);
</script>
