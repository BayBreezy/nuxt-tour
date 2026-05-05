<template>
  <div>
    <div :id="backdropId" data-hidden :style="{ clipPath: clipPath }" />
    <Transition :name="transitionName">
      <div
        v-show="showTooltip"
        id="nt-tooltip"
        ref="tooltipEl"
        data-hidden
        role="tooltip"
        tabindex="-1"
      >
        <slot
          v-for="slotName in ['header']"
          :key="slotName"
          :name="`${stepSlot}-header`"
          v-bind="slotProps"
        >
          <div id="nt-tooltip-header">
            <slot :name="`${stepSlot}-title`" v-bind="slotProps">
              <h3 v-if="step?.title" id="nt-tooltip-title" v-html="step.title" />
            </slot>
            <slot :name="`${stepSlot}-sub-text`" v-bind="slotProps">
              <p v-if="step?.subText" id="nt-tooltip-sub-text" v-html="step.subText" />
            </slot>
          </div>
        </slot>

        <slot :name="`${stepSlot}-body`" v-bind="slotProps">
          <div v-if="step?.body" id="nt-tooltip-body" v-html="step.body" />
        </slot>

        <slot :name="`${stepSlot}-progress`" v-bind="slotProps">
          <div v-if="props.showProgress" id="nt-progress">
            {{ currentStepIndex + 1 }} / {{ props.steps.length }}
          </div>
        </slot>

        <slot :name="`${stepSlot}-actions`" v-bind="slotProps">
          <div class="nt-actions">
            <slot :name="`${stepSlot}-skip-button`" v-bind="slotProps">
              <button id="nt-action-skip" type="button" @click.prevent="skipTour">
                <Icon
                  v-if="props.skipButton?.leftIcon"
                  :size="ICON_SIZE"
                  :style="ICON_STYLE"
                  :name="props.skipButton.leftIcon"
                />
                {{ props.skipButton?.label || "Skip" }}
                <Icon
                  v-if="props.skipButton?.rightIcon"
                  :size="ICON_SIZE"
                  :style="ICON_STYLE"
                  :name="props.skipButton.rightIcon"
                />
              </button>
            </slot>

            <slot :name="`${stepSlot}-prev-button`" v-bind="slotProps">
              <button
                v-if="currentStepIndex > 0"
                id="nt-action-prev"
                type="button"
                @click.prevent="prevStep"
              >
                <Icon
                  v-if="props.prevButton?.leftIcon"
                  :size="ICON_SIZE"
                  :style="ICON_STYLE"
                  :name="props.prevButton.leftIcon"
                />
                {{ props.prevButton?.label || "Prev" }}
                <Icon
                  v-if="props.prevButton?.rightIcon"
                  :size="ICON_SIZE"
                  :style="ICON_STYLE"
                  :name="props.prevButton.rightIcon"
                />
              </button>
            </slot>

            <slot v-if="!isLastStep" :name="`${stepSlot}-next-button`" v-bind="slotProps">
              <button id="nt-action-next" type="button" @click.prevent="nextStep">
                <Icon
                  v-if="props.nextButton?.leftIcon"
                  :size="ICON_SIZE"
                  :style="ICON_STYLE"
                  :name="props.nextButton.leftIcon"
                />
                {{ props.nextButton?.label || "Next" }}
                <Icon
                  v-if="props.nextButton?.rightIcon"
                  :size="ICON_SIZE"
                  :style="ICON_STYLE"
                  :name="props.nextButton.rightIcon"
                />
              </button>
            </slot>

            <slot v-if="isLastStep" :name="`${stepSlot}-finish-button`" v-bind="slotProps">
              <button id="nt-action-finish" type="button" @click.prevent="nextStep">
                <Icon
                  v-if="props.finishButton?.leftIcon"
                  :size="ICON_SIZE"
                  :style="ICON_STYLE"
                  :name="props.finishButton.leftIcon"
                />
                {{ props.finishButton?.label || "Done" }}
                <Icon
                  v-if="props.finishButton?.rightIcon"
                  :size="ICON_SIZE"
                  :style="ICON_STYLE"
                  :name="props.finishButton.rightIcon"
                />
              </button>
            </slot>
          </div>
        </slot>

        <slot :name="`${stepSlot}-arrow`" v-bind="slotProps">
          <div v-show="props.showArrow !== false" id="nt-arrow" data-popper-arrow />
        </slot>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
  import type { Instance } from "@popperjs/core";
  import { useEventListener, useScrollLock, useTimeoutFn } from "@vueuse/core";
  import { useFocusTrap } from "@vueuse/integrations/useFocusTrap";

  import { Icon } from "#components";
  import {
    computed,
    nextTick,
    onMounted,
    onUnmounted,
    ref,
    shallowRef,
    toValue,
    watch,
  } from "#imports";

  import { useTour } from "../composables/useTour";
  import type { TourConfig, TourEmits } from "../types";
  import { createTourPopper, updateTourPopper } from "../utils/popper";
  import { scrollToTarget } from "../utils/scroll";
  import {
    shouldSkipTour,
    markComplete,
    saveStepProgress,
    clearEntry,
    getResumeStep,
  } from "../utils/storage";

  const ICON_SIZE = "18px";
  const ICON_STYLE = { flexShrink: 0, color: "inherit" };

  const props = withDefaults(
    defineProps<
      TourConfig & {
        /** Passed by module.ts via a plugin — storage key prefix. */
        _storagePrefix?: string;
        /** Passed by module.ts via a plugin — global storage version. */
        _storageVersion?: string | null;
      }
    >(),
    {
      name: "default",
      autoStart: false,
      backdrop: false,
      startDelay: 100,
      highlight: false,
      showArrow: true,
      showProgress: false,
      keyboard: true,
      trapFocus: true,
      lockScroll: true,
      saveToLocalStorage: "end",
      scrollBehavior: "jump",
      transition: "fade",
      _storagePrefix: "nt",
      _storageVersion: undefined,
    }
  );

  const emit = defineEmits<TourEmits>();

  if (!props.steps?.length) {
    throw new Error("[nuxt-tour] You must provide at least one step.");
  }

  // ─── Composable wiring ───────────────────────────────────────────────────────

  const { _state: tourState } = useTour(props.name, props._storagePrefix);

  // ─── Refs ────────────────────────────────────────────────────────────────────

  const tooltipEl = ref<HTMLElement | null>(null);
  const popperInstance = ref<Instance | null>(null);
  const currentStepIndex = shallowRef(0);
  const showTooltip = shallowRef(false);
  const isActive = shallowRef(false);
  const isPaused = shallowRef(false);
  const clipPath = ref("");

  const backdropId = "nt-backdrop";
  const highlightClass = "nt-highlight";

  // ─── Computed ────────────────────────────────────────────────────────────────

  const step = computed(() => props.steps[currentStepIndex.value]);
  const stepSlot = computed(() => step.value?.slot ?? "");
  const isLastStep = computed(() => currentStepIndex.value === props.steps.length - 1);
  const transitionName = computed(
    () => `nt-tooltip-${step.value?.transition ?? props.transition ?? "fade"}`
  );

  const stepTarget = computed<Element>(() => {
    const t = step.value?.target;
    if (!t) return document.body;
    if (t instanceof HTMLElement) return t;
    const sel = toValue(t as string);
    return document.querySelector(sel) ?? document.body;
  });

  const isCentred = computed(() => stepTarget.value === document.body);

  const slotProps = computed(() => ({
    currentStep: currentStepIndex.value,
    totalSteps: props.steps.length,
    isLastStep: isLastStep.value,
    step: step.value,
    startTour,
    endTour,
    skipTour,
    nextStep,
    prevStep,
    goToStep,
    pause,
    resume,
    isLocked: isLocked.value,
  }));

  // ─── Scroll lock ─────────────────────────────────────────────────────────────

  const isLocked = import.meta.client ? useScrollLock(window) : ref(false);

  // ─── Focus trap ──────────────────────────────────────────────────────────────

  const { activate: trapActivate, deactivate: trapDeactivate } = useFocusTrap(tooltipEl, {
    allowOutsideClick: true,
    fallbackFocus: () => tooltipEl.value!,
  });

  function activateFocusTrap() {
    if (props.trapFocus) trapActivate();
  }

  function deactivateFocusTrap() {
    trapDeactivate();
  }

  // ─── Highlight / clip-path ───────────────────────────────────────────────────

  function calcClipPath(selector: string): string {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) return "";
    const r = el.getBoundingClientRect();
    return `polygon(0% 0%, 0% 100%, ${r.left}px 100%, ${r.left}px ${r.top}px, ${r.right}px ${r.top}px, ${r.right}px ${r.bottom}px, ${r.left}px ${r.bottom}px, ${r.left}px 100%, 100% 100%, 100% 0%)`;
  }

  function applyHighlight() {
    document
      .querySelectorAll(`.${highlightClass}`)
      .forEach((el) => el.classList.remove(highlightClass));
    if (!isCentred.value) stepTarget.value.classList.add(highlightClass);
    clipPath.value = calcClipPath(`.${highlightClass}`);
  }

  function removeHighlight() {
    document
      .querySelectorAll(`.${highlightClass}`)
      .forEach((el) => el.classList.remove(highlightClass));
    clipPath.value = "";
  }

  useEventListener("scroll", () => {
    if (props.highlight && isActive.value) clipPath.value = calcClipPath(`.${highlightClass}`);
  });
  useEventListener("resize", () => {
    if (props.highlight && isActive.value) clipPath.value = calcClipPath(`.${highlightClass}`);
  });

  // ─── Backdrop ────────────────────────────────────────────────────────────────

  function showBackdrop() {
    document.getElementById(backdropId)?.removeAttribute("data-hidden");
  }

  function hideBackdrop() {
    document.getElementById(backdropId)?.setAttribute("data-hidden", "");
  }

  function syncBackdrop() {
    const show = props.backdrop || step.value?.backdrop;
    if (show) showBackdrop();
    else hideBackdrop();
  }

  // ─── Popper ──────────────────────────────────────────────────────────────────

  async function initPopper() {
    if (!tooltipEl.value) return;
    popperInstance.value?.destroy();
    popperInstance.value = createTourPopper(
      stepTarget.value,
      tooltipEl.value,
      step.value?.popperConfig
    );
    if (isCentred.value) {
      tooltipEl.value.classList.add("nt-center");
      await updateTourPopper(
        popperInstance.value,
        stepTarget.value,
        step.value?.popperConfig,
        true
      );
    } else {
      tooltipEl.value.classList.remove("nt-center");
    }
  }

  async function refreshPopper() {
    if (!popperInstance.value || !tooltipEl.value) return;
    if (isCentred.value) {
      tooltipEl.value.classList.add("nt-center");
      await updateTourPopper(
        popperInstance.value,
        stepTarget.value,
        step.value?.popperConfig,
        true
      );
    } else {
      tooltipEl.value.classList.remove("nt-center");
      await updateTourPopper(
        popperInstance.value,
        stepTarget.value,
        step.value?.popperConfig,
        false
      );
    }
  }

  // ─── Show / hide tooltip ─────────────────────────────────────────────────────

  function revealTooltip() {
    tooltipEl.value?.removeAttribute("data-hidden");
    showTooltip.value = true;
  }

  function hideTooltip() {
    tooltipEl.value?.setAttribute("data-hidden", "");
    showTooltip.value = false;
  }

  // ─── Core tour actions ───────────────────────────────────────────────────────

  async function startTour() {
    if (!props.steps?.length) return;

    if (props.saveToLocalStorage !== "never") {
      const skip = shouldSkipTour(props.name ?? "default", {
        prefix: props._storagePrefix,
        version: props._storageVersion ?? null,
        ttl: props.ttl,
      });
      if (skip) return;
    }

    let startAt = 0;
    if (props.saveToLocalStorage === "step") {
      startAt = getResumeStep(props.name ?? "default", props._storagePrefix);
    }
    currentStepIndex.value = startAt;

    useTimeoutFn(
      async () => {
        await initPopper();

        if (props.highlight && !isCentred.value) applyHighlight();
        syncBackdrop();

        await scrollToTarget(
          isCentred.value ? null : stepTarget.value,
          props.scrollBehavior ?? "jump",
          props.jumpOptions
        );

        await step.value?.onShow?.();

        revealTooltip();
        isActive.value = true;
        isPaused.value = false;

        await nextTick();
        activateFocusTrap();
        if (props.lockScroll) isLocked.value = true;

        emit("tour:start");

        // Sync composable state
        tourState.isActive = true;
        tourState.currentStep = currentStepIndex.value;
        tourState.totalSteps = props.steps.length;
      },
      Number(props.startDelay ?? 100)
    );
  }

  async function endTour() {
    hideTooltip();
    hideBackdrop();
    removeHighlight();

    popperInstance.value?.destroy();
    popperInstance.value = null;

    if (props.saveToLocalStorage !== "never") {
      markComplete(props.name ?? "default", "completed", {
        prefix: props._storagePrefix,
        version: props._storageVersion ?? null,
      });
      tourState._storageCompleted = true;
    }

    isActive.value = false;
    isPaused.value = false;
    deactivateFocusTrap();
    if (props.lockScroll) isLocked.value = false;

    await scrollToTarget(
      document.body,
      props.scrollBehavior === "none" ? "none" : "jump",
      props.jumpOptions
    );

    emit("tour:end");

    tourState.isActive = false;
  }

  async function skipTour() {
    hideTooltip();
    hideBackdrop();
    removeHighlight();

    popperInstance.value?.destroy();
    popperInstance.value = null;

    if (props.saveToLocalStorage !== "never") {
      markComplete(props.name ?? "default", "skipped", {
        prefix: props._storagePrefix,
        version: props._storageVersion ?? null,
      });
      tourState._storageCompleted = true;
    }

    isActive.value = false;
    isPaused.value = false;
    deactivateFocusTrap();
    if (props.lockScroll) isLocked.value = false;

    emit("tour:skip");

    tourState.isActive = false;
  }

  async function nextStep() {
    if (!isLastStep.value) {
      await step.value?.onNext?.();
      const from = currentStepIndex.value;
      currentStepIndex.value++;
      emit("tour:step-change", { from, to: currentStepIndex.value });

      if (props.saveToLocalStorage === "step") {
        saveStepProgress(props.name ?? "default", currentStepIndex.value, {
          prefix: props._storagePrefix,
          version: props._storageVersion ?? null,
        });
      }

      await transitionStep();
    } else {
      await endTour();
    }
  }

  async function prevStep() {
    if (currentStepIndex.value === 0) return;
    await step.value?.onPrev?.();
    const from = currentStepIndex.value;
    currentStepIndex.value--;
    emit("tour:step-change", { from, to: currentStepIndex.value });
    await transitionStep();
  }

  async function goToStep(index: number) {
    if (index < 0 || index >= props.steps.length) return;
    if (!isActive.value) await startTour();
    const from = currentStepIndex.value;
    currentStepIndex.value = index;
    emit("tour:step-change", { from, to: index });
    await transitionStep();
  }

  async function transitionStep() {
    hideTooltip();
    await refreshPopper();
    if (props.highlight && !isCentred.value) applyHighlight();
    else if (props.highlight) removeHighlight();
    syncBackdrop();

    await scrollToTarget(
      isCentred.value ? null : stepTarget.value,
      props.scrollBehavior ?? "jump",
      props.jumpOptions
    );
    await step.value?.onShow?.();

    // Small grace period for scroll + popper to settle
    await new Promise<void>((r) => setTimeout(r, 100));
    revealTooltip();

    await nextTick();
    activateFocusTrap();
    if (props.lockScroll) isLocked.value = true;

    tourState.currentStep = currentStepIndex.value;
  }

  function pause() {
    if (!isActive.value || isPaused.value) return;
    isPaused.value = true;
    hideTooltip();
    tourState.isPaused = true;
  }

  function resume() {
    if (!isPaused.value) return;
    isPaused.value = false;
    revealTooltip();
    tourState.isPaused = false;
  }

  async function resetTour() {
    clearEntry(props.name ?? "default", props._storagePrefix);
    tourState._storageCompleted = false;
    currentStepIndex.value = 0;
    isActive.value = false;
    isPaused.value = false;
    deactivateFocusTrap();
    isLocked.value = false;
    popperInstance.value?.destroy();
    popperInstance.value = null;
    await startTour();
  }

  // ─── Keyboard navigation ──────────────────────────────────────────────────────

  useEventListener("keydown", (e: KeyboardEvent) => {
    if (!props.keyboard || !isActive.value || isPaused.value) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") nextStep();
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") prevStep();
    else if (e.key === "Escape") skipTour();
  });

  // ─── Tooltip visibility watch ────────────────────────────────────────────────

  watch(showTooltip, (visible) => {
    if (visible && props.highlight) {
      setTimeout(() => {
        clipPath.value = calcClipPath(`.${highlightClass}`);
      }, 100);
    }
  });

  // ─── Lifecycle ───────────────────────────────────────────────────────────────

  onMounted(async () => {
    tourState.totalSteps = props.steps.length;
    tourState._start = startTour;
    tourState._end = endTour;
    tourState._skip = skipTour;
    tourState._next = nextStep;
    tourState._prev = prevStep;
    tourState._goTo = goToStep;
    tourState._pause = pause;
    tourState._resume = resume;
    tourState._reset = resetTour;

    if (tourState._pendingStart) {
      tourState._pendingStart = false;
      await startTour();
    } else if (props.autoStart) {
      await startTour();
    }
  });

  onUnmounted(() => {
    popperInstance.value?.destroy();
    hideBackdrop();
    removeHighlight();
    isLocked.value = false;

    // Detach from registry so stale refs don't linger
    tourState._start = undefined;
    tourState._end = undefined;
    tourState._skip = undefined;
    tourState._next = undefined;
    tourState._prev = undefined;
    tourState._goTo = undefined;
    tourState._pause = undefined;
    tourState._resume = undefined;
    tourState._reset = undefined;
    tourState.isActive = false;
  });

  // ─── Expose ──────────────────────────────────────────────────────────────────

  defineExpose({
    startTour,
    endTour,
    skipTour,
    nextStep,
    prevStep,
    goToStep,
    pause,
    resume,
    resetTour,
    activateFocusTrap,
    deactivateFocusTrap,
    recalculatePopper: refreshPopper,
    isLocked,
    currentStep: currentStepIndex,
    isActive,
  });
</script>
