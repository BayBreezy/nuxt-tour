<template>
  <div>
    <UiScrollArea class="h-full">
      <nav class="flex flex-col gap-2 py-5 pr-2">
        <template v-for="n in navigation" :key="n._path">
          <UiButton
            exactActiveClass="bg-muted"
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
      </nav>
    </UiScrollArea>
  </div>
</template>

<script lang="ts" setup>
  const { navigation } = useContent();
</script>
