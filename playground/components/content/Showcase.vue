<template>
  <div :class="[styles({ class: props.class })]">
    <slot />
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    class?: any;
  }>();
  const styles = tv({
    base: "mb-10 flex min-h-[150px] w-full items-center justify-center rounded-lg border px-5 py-10",
  });
</script>
