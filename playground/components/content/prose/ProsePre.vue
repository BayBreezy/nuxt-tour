<template>
  <div class="relative">
    <button
      v-if="isSupported"
      :disabled="copied"
      class="absolute right-4 top-4 z-10 inline-flex items-center justify-center text-muted-foreground lg:right-6"
      @click="
        copy();
        useSonner('✨ Copied!', {
          description: 'The code has been copied to your clipboard.',
        });
      "
    >
      <Icon v-if="!copied" class="size-4" name="lucide:copy" />
      <Icon v-if="copied" class="size-4" name="lucide:copy-check" />
    </button>
    <div class="max-h-[380px] overflow-auto rounded-md border">
      <div
        v-if="hasFileName"
        class="sticky top-0 z-[1] flex items-center border-b bg-background/70 px-4 backdrop-blur"
      >
        <span class="-mb-px flex h-11 items-center border-b border-sky-500 text-xs">{{
          props.filename
        }}</span>
      </div>
      <pre class="!m-0 !rounded-none" :class="props.class"><slot /></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    code: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: null,
    },
    filename: {
      type: String,
      default: null,
    },
    highlights: {
      type: Array as () => number[],
      default: () => [],
    },
    meta: {
      type: String,
      default: null,
    },
    class: {
      type: String,
      default: null,
    },
  });

  const hasFileName = computed(() => Boolean(props.filename));

  const { copied, isSupported, copy } = useClipboard({
    copiedDuring: 3000,
    legacy: true,
    source: props.code,
  });
</script>
