<template>
  <ul>
    <li v-for="(t, k) in links" :key="k">
      <template v-if="!hasChildren(t)">
        <NuxtLink
          @click="setActive(t.id)"
          :class="[
            marginPerDepth(t.depth),
            t.id === activeId
              ? 'text-primary underline underline-offset-2'
              : 'text-muted-foreground no-underline ',
          ]"
          class="mb-2 inline-flex items-center text-sm transition"
          :to="`#${t.id}`"
        >
          <span
            v-if="t.depth > 2"
            class="mr-2 size-1 rounded-full transition"
            :class="[t.id === activeId ? 'bg-primary' : 'bg-muted-foreground/50']"
          ></span>
          {{ t.text }}</NuxtLink
        >
      </template>
      <template v-else>
        <NuxtLink
          @click="setActive(t.id)"
          :class="[
            t.id === activeId
              ? 'text-primary underline underline-offset-2 dark:text-white'
              : 'text-gray-500 no-underline dark:text-gray-400',
          ]"
          class="mb-2 inline-block text-sm text-gray-500 transition dark:text-gray-400"
          :to="`#${t.id}`"
          >{{ t.text }}</NuxtLink
        >
        <DocsToc :setActive="setActive" :activeId="activeId" :links="t.children" />
      </template>
    </li>
  </ul>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    links: any[];
    setActive: (id: string) => void;
    activeId: string;
  }>();

  const hasChildren = (item: any) => item.children && item.children.length > 0;

  const marginPerDepth = (depth: number) => {
    switch (depth) {
      case 3:
        return "pl-3";
      case 4:
        return "ml-8";
    }
  };
</script>
