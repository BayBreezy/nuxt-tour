<template>
  <UiNavbar id="main-nav" sticky>
    <UiContainer class="flex h-14 items-center justify-between">
      <NuxtLink class="text-lg font-semibold" to="/">Nuxt Tour</NuxtLink>
      <div class="flex items-center gap-3">
        <UiButton id="toggle-button" @click="toggleTheme" size="icon-sm" variant="ghost">
          <Icon class="size-4" name="lucide:sun-medium" />
        </UiButton>
      </div>
    </UiContainer>
  </UiNavbar>
</template>

<script lang="ts" setup>
  const theme = useColorMode();
  const toggleTheme = () => {
    theme.preference = theme.value === "dark" ? "light" : "dark";
  };
</script>
