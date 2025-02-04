<template>
  <div>
    <div
      :id="backdropClass"
      :class="backdropClass"
      data-hidden
      :style="'clip-path: ' + getClipPath"
    />
    <Transition name="fade-nt-tooltip">
      <div v-show="showParent" :id="parentId" ref="target" data-hidden role="tooltip">
        <slot
          :name="`${getCurrentStep.slot}-header`"
          v-bind="{
            endTour,
            nextStep,
            prevStep,
            currentStep,
            lastStep,
            getCurrentStep,
            getLastStep,
            jump,
            isLocked,
            isLastStep,
          }"
        >
          <div id="nt-tooltip-header">
            <slot
              :name="`${getCurrentStep.slot}-title`"
              v-bind="{
                endTour,
                nextStep,
                prevStep,
                currentStep,
                lastStep,
                getCurrentStep,
                getLastStep,
                jump,
                isLocked,
                isLastStep,
              }"
            >
              <h3 v-if="getCurrentStep.title" id="nt-tooltip-title" v-html="getCurrentStep.title" />
            </slot>
            <slot
              :name="`${getCurrentStep.slot}-sub-text`"
              v-bind="{
                endTour,
                nextStep,
                prevStep,
                currentStep,
                lastStep,
                getCurrentStep,
                getLastStep,
                jump,
                isLocked,
                isLastStep,
              }"
            >
              <p
                v-if="getCurrentStep.subText"
                id="nt-tooltip-sub-text"
                v-html="getCurrentStep.subText"
              />
            </slot>
          </div>
        </slot>
        <slot
          :name="`${getCurrentStep.slot}-body`"
          v-bind="{
            endTour,
            nextStep,
            prevStep,
            currentStep,
            lastStep,
            getCurrentStep,
            getLastStep,
            jump,
            isLocked,
            isLastStep,
          }"
        >
          <div v-if="getCurrentStep.body" id="nt-tooltip-body" v-html="getCurrentStep.body" />
        </slot>
        <slot
          :name="`${getCurrentStep.slot}-actions`"
          v-bind="{
            endTour,
            nextStep,
            prevStep,
            currentStep,
            lastStep,
            getCurrentStep,
            getLastStep,
            jump,
            isLocked,
            isLastStep,
          }"
        >
          <div class="nt-actions">
            <slot
              :name="`${getCurrentStep.slot}-skip-button`"
              v-bind="{
                endTour,
                nextStep,
                prevStep,
                currentStep,
                lastStep,
                getCurrentStep,
                getLastStep,
                jump,
                isLocked,
                isLastStep,
                skipButton,
                nextButton,
                prevButton,
              }"
            >
              <button
                id="nt-action-skip"
                type="button"
                @click.prevent="
                  endTour();
                  props.onSkip?.();
                "
              >
                <Icon
                  v-if="skipButton?.leftIcon"
                  :size="iconSize"
                  :style="iconStyles"
                  :name="skipButton.leftIcon"
                />
                {{ skipButton?.label || "Skip" }}
                <Icon
                  v-if="skipButton?.rightIcon"
                  :size="iconSize"
                  :style="iconStyles"
                  :name="skipButton.rightIcon"
                />
              </button>
            </slot>
            <slot
              :name="`${getCurrentStep.slot}-prev-button`"
              v-bind="{
                endTour,
                nextStep,
                prevStep,
                currentStep,
                lastStep,
                getCurrentStep,
                getLastStep,
                jump,
                isLocked,
                isLastStep,
                skipButton,
                nextButton,
                prevButton,
              }"
            >
              <button
                v-if="currentStep > 0"
                id="nt-action-prev"
                type="button"
                @click.prevent="prevStep"
              >
                <Icon
                  v-if="prevButton?.leftIcon"
                  :size="iconSize"
                  :style="iconStyles"
                  :name="prevButton.leftIcon"
                />
                {{ prevButton?.label || "Prev" }}
                <Icon
                  v-if="prevButton?.rightIcon"
                  :size="iconSize"
                  :style="iconStyles"
                  :name="prevButton.rightIcon"
                />
              </button>
            </slot>
            <slot
              v-if="!isLastStep"
              :name="`${getCurrentStep.slot}-next-button`"
              v-bind="{
                endTour,
                nextStep,
                prevStep,
                currentStep,
                lastStep,
                getCurrentStep,
                getLastStep,
                jump,
                isLocked,
                isLastStep,
                skipButton,
                nextButton,
                prevButton,
              }"
            >
              <button id="nt-action-next" type="button" @click.prevent="nextStep">
                <Icon
                  v-if="nextButton?.leftIcon"
                  :size="iconSize"
                  :style="iconStyles"
                  :name="nextButton.leftIcon"
                />
                {{ nextButton?.label || "Next" }}
                <Icon
                  v-if="nextButton?.rightIcon"
                  :size="iconSize"
                  :style="iconStyles"
                  :name="nextButton.rightIcon"
                />
              </button>
            </slot>
            <slot
              v-if="isLastStep"
              :name="`${getCurrentStep.slot}-finish-button`"
              v-bind="{
                endTour,
                nextStep,
                prevStep,
                currentStep,
                lastStep,
                getCurrentStep,
                getLastStep,
                jump,
                isLocked,
                isLastStep,
                skipButton,
                nextButton,
                prevButton,
              }"
            >
              <button id="nt-action-finish" type="button" @click.prevent="nextStep">
                <Icon
                  v-if="finishButton?.leftIcon"
                  :size="iconSize"
                  :style="iconStyles"
                  :name="finishButton.leftIcon"
                />
                {{ finishButton?.label || "Done" }}
                <Icon
                  v-if="finishButton?.rightIcon"
                  :size="iconSize"
                  :style="iconStyles"
                  :name="finishButton.rightIcon"
                />
              </button>
            </slot>
          </div>
        </slot>
        <slot
          :name="`${getCurrentStep.slot}-arrow`"
          v-bind="{
            endTour,
            nextStep,
            prevStep,
            currentStep,
            lastStep,
            getCurrentStep,
            getLastStep,
            jump,
            isLocked,
            isLastStep,
            skipButton,
            nextButton,
            prevButton,
          }"
        >
          <div v-show="showArrow" :id="arrowId" data-popper-arrow />
        </slot>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
  import { createPopper } from "@popperjs/core";
  import { useEventListener, useScrollLock, useStorage, useTimeoutFn } from "@vueuse/core";
  import { useFocusTrap } from "@vueuse/integrations/useFocusTrap";
  import { Icon } from "#components";
  import { computed, onMounted, ref, shallowRef, toValue } from "#imports";
  import jump from "jump.js";
  import { merge } from "lodash-es";
  import { watch } from "vue";
  import type { TourEmits, TourProps } from "../props";
  import type { Instance, Modifier, OptionsGeneric } from "@popperjs/core";
  import type { Options } from "jump.js";

  /**Props with the defaults */
  const props = withDefaults(defineProps<TourProps>(), {
    name: "default",
    autoStart: false,
    backdrop: false,
    startDelay: 100,
    highlight: false,
    showArrow: true,
    trapFocus: true,
    lockScroll: true,
  });
  /** Emits for the tour */
  const emit = defineEmits<TourEmits>();

  /** The merged config to pass to jump */
  const jumpConfig = computed<Options>(() =>
    merge(
      {},
      {
        duration: 300,
        offset: -150,
      } as Options,
      props.jumpOptions
    )
  );

  const popper = ref<Instance | null>(null);

  // Default styles applied to icon
  const iconStyles = { flexShrink: 0, color: "inherit" };
  const iconSize = "18px";

  // check if the steps prop is empty
  if (!props.steps?.length) {
    throw new Error("You must provide at least one step to the tour");
  }

  // The target of the focus trap
  const target = ref();
  const { activate: activateFocusTrap, deactivate: deActivateFocusTrap } = useFocusTrap(target);

  const isLocked = useScrollLock(window);

  /**
   * Method used to get the clip path values for the target element
   *
   * Used with the `highlight` & `backdrop` props
   */
  const getClipPathValues = (targetSelector: string) => {
    const targetElement = document?.querySelector(targetSelector) as HTMLElement;
    if (!targetElement) return "";

    const rect = targetElement.getBoundingClientRect();
    return `polygon(
    0% 0%,
    0% 100%,
    ${rect.left - 6}px 100%,
    ${rect.left - 6}px ${rect.top}px,
    ${rect.right + 5}px ${rect.top}px,
    ${rect.right + 5}px ${rect.bottom}px,
    ${rect.left - 6}px ${rect.bottom}px,
    ${rect.left - 6}px 100%,
    100% 100%,
    100% 0%
  )`;
  };

  /** State used to do transition on parent */
  const showParent = shallowRef(true);
  /** The prefix for the tour in local storage. It also prefixes the classes and ID's */
  const tourPrefix = "nt-";
  /** State of the tour. `true` indicates that the tour has started */
  const tourStarted = shallowRef(false);
  /** The parent element id */
  const parentId = `${tourPrefix}tooltip`;
  /** The arrow element id */
  const arrowId = `${tourPrefix}arrow`;
  /** The class to highlight the target element */
  const highlightClass = `${tourPrefix}highlight`;
  /** The class for the backdrop */
  const backdropClass = `${tourPrefix}backdrop`;
  /** The tour current step */
  const currentStep = shallowRef(0);
  /** The tour last step */
  const lastStep = shallowRef<number | null>(props.steps.length - 1);
  /** The current/active step of the tour. */
  const getCurrentStep = computed(() => {
    return props.steps[currentStep.value];
  });
const getCurrentStepTarget = computed(() => {
    const target = getCurrentStep.value.target!;
    if (target instanceof HTMLElement) {
      return target;
    }
    const targetElement = document?.querySelector(toValue(target));
    if (targetElement) {
      return targetElement as HTMLElement;
    } else {
      return document.body;
    }
  });
  const getLastStep = computed(() => {
    return props.steps[lastStep.value || props.steps.length - 1];
  });
  /** The maximum number of steps in the tour */
  const maxSteps = computed(() => props.steps.length - 1);
  /** The name of the item that will be stored in localStorage. This item will be false by default */
  const storageItem = useStorage(`${tourPrefix}${props.name || "default"}`, false);
  /** Stores a `boolean` value that indicates if the tour is on the last step */
  const isLastStep = computed(() => currentStep.value === maxSteps.value);
  const getClipPath = ref(
    getClipPathValues(`.${highlightClass}`) ? getClipPathValues(`.${highlightClass}`) : ""
  );

  /** The default configuration passed to popper */
  const defaultPopperConfig: Partial<OptionsGeneric<Partial<Modifier<any, any>>>> | undefined = {
    placement: "auto",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 14],
        },
      },
      {
        name: "flip",
        options: {
          fallbackPlacements: ["top", "bottom"],
        },
      },
    ],
  };

  /**
   * Function used to start the tour
   *
   * If the `steps` prop is empty, the tour won't start
   *
   *  If the name of the tour in local storage is found and it's value is `true`, the tour won't start
   */
  const startTour = async () => {
    // if the steps prop is empty, don't start the tour
    if (!props.steps || !props.steps.length) return;
    // start tour can be found in local storage and it's value is true, then return
    if (storageItem.value) return;
    // set the current step to 0
    currentStep.value = 0;
    // set the last step to null
    lastStep.value = null;

    // get the parent element
    const parent = document.getElementById(parentId);

    // Timeout function used to trigger the tour after the specified delay
    useTimeoutFn(async () => {
      // if the target element is not found, center the tooltip on the screen
      if (getCurrentStepTarget.value == document.body) {
        // center the tooltip
        parent?.classList.add("nt-center");
      } else {
        // remove the center class
        parent?.classList.remove("nt-center");
      }

      // get the current step's target
      let target = getCurrentStepTarget.value;

      const tour = document.getElementById("nt-tooltip");

      // create the popper instance
      popper.value = createPopper(
        target,
        tour!,
        merge({}, defaultPopperConfig, getCurrentStep.value?.popperConfig)
      );

      // jump to the target element or the body
      jump(target, {
        ...jumpConfig.value,
        callback() {
          if (props.jumpOptions?.callback) {
            props.jumpOptions.callback();
          }
          setTimeout(() => {
            parent?.removeAttribute("data-hidden");
            showParent.value = true;
            tourStarted.value = true;
            // activate the focus trap
            if (props.trapFocus) activateFocusTrap();
            // check if scroll should be locked
            if (props.lockScroll) isLocked.value = true;
          }, 200);
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      props.backdrop || getCurrentStep.value.backdrop ? updateBackdrop() : null;
      // highlight the target element (if the highlight prop is true & the target element is found)
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      props.highlight && target ? highlightTarget() : null;
      // if the current step has an onShow function, call it
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      getCurrentStep.value.onShow ? await getCurrentStep.value.onShow() : null;
      // emit the onTourStart event
      emit("onTourStart");
    }, Number(props.startDelay));
  };

  /**
   * Highlight the target element
   */
  const highlightTarget = () => {
    // remove the highlight class from all elements
    const highlightedElements = document?.querySelectorAll(`.${highlightClass}`);
    highlightedElements.forEach((el) => el.classList.remove(highlightClass));
    // add the highlight class to the current step's target
    const _currentStep = getCurrentStepTarget.value;
    getClipPath.value = getClipPathValues(`.${highlightClass}`);
    _currentStep?.classList.add(highlightClass);
  };

  watch(showParent, (value) => {
    if (value && props.highlight) {
      setTimeout(() => {
        getClipPath.value = getClipPathValues(`.${highlightClass}`);
      }, 100);
    }
  });

  useEventListener("scroll", () => {
    if (props.highlight) {
      getClipPath.value = getClipPathValues(`.${highlightClass}`);
    }
  });
  useEventListener("resize", () => {
    if (props.highlight) {
      getClipPath.value = getClipPathValues(`.${highlightClass}`);
    }
  });

  const updateBackdrop = () => {
    if (props.backdrop) {
      return document?.querySelector(`.${backdropClass}`)!.removeAttribute("data-hidden");
    } else {
      document?.querySelector(`.${backdropClass}`)!.setAttribute("data-hidden", "");
    }
    if (getCurrentStep.value.backdrop) {
      return document?.querySelector(`.${backdropClass}`)!.removeAttribute("data-hidden");
    } else {
      document?.querySelector(`.${backdropClass}`)!.setAttribute("data-hidden", "");
    }
  };

  /**
   * Move to the next step
   * @returns void
   */
  const nextStep = async () => {
    // if the current step is less than the max steps, end the tour
    if (currentStep.value < maxSteps.value) {
      // if the current step has an onNext function, call it
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      getCurrentStep.value.onNext ? await getCurrentStep.value.onNext() : null;
      // set the last step to the current step
      lastStep.value = currentStep.value;
      // increment the current step
      currentStep.value++;
      // if the target element is not found, center the tooltip on the screen
      if (getCurrentStepTarget.value == document.body) {
        document.getElementById(parentId)?.classList.add("nt-center");
      } else {
        // remove the center class
        document.getElementById(parentId)?.classList.remove("nt-center");
      }
      if (props.trapFocus) {
        activateFocusTrap();
      }
      // check if scroll should be locked
      if (props.lockScroll) isLocked.value = true;
      await recalculatePopper();
      return;
    }
    endTour();
  };

  /**
   * Move to the previous step
   * @returns void
   */
  const prevStep = async () => {
    // if the current step is greater than 0, move to the previous step
    if (currentStep.value > 0) {
      // if the current step has an onPrev function, call it
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      getCurrentStep.value.onPrev ? await getCurrentStep.value.onPrev() : null;
      // set the last step to the current step
      lastStep.value = currentStep.value;
      // decrement the current step
      currentStep.value--;
      // if the target element is not found, center the tooltip on the screen
      if (getCurrentStepTarget.value == document.body) {
        document.getElementById(parentId)?.classList.add("nt-center");
      } else {
        // remove the center class
        document.getElementById(parentId)?.classList.remove("nt-center");
      }
      // recalculate the popper
      if (props.trapFocus) {
        activateFocusTrap();
      }
      // check if scroll should be locked
      if (props.lockScroll) isLocked.value = true;
      await recalculatePopper();
    }
  };

  /**
   * End the tour
   * @returns void
   */
  const endTour = async () => {
    // get the parent element and set the data-hidden attr
    document.getElementById(parentId)?.setAttribute("data-hidden", "");
    showParent.value = false;
    // Hide the backdrop
    document?.querySelector(`.${backdropClass}`)!.setAttribute("data-hidden", "");
    // remove the highlight class from all elements
    const highlightedElements = document?.querySelectorAll(`.${highlightClass}`);
    highlightedElements.forEach((el) => el.classList.remove(highlightClass));
    // destroy the popper instance
    popper.value?.destroy();
    // set the storage item to true
    storageItem.value = true;
    // go to the top of the page
    jump(document.body, jumpConfig.value);
    // emit the onTourEnd event
    emit("onTourEnd");
    // deactivate the focus trap
    deActivateFocusTrap();
    // Call onComplete function if it exists
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    props.onComplete ? await props.onComplete() : null;
    isLocked.value = false;
  };

  /**
   * Go to a specific step
   *
   * @param {number} nextStep - The step to go to
   * @returns void
   */
  const goToStep = async (nextStep: number) => {
    // if the tour has not started, start the tour
    if (tourStarted.value === false) await startTour();
    // if the current step has an onNext function, call it
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    getCurrentStep.value.onNext ? await getCurrentStep.value.onNext() : null;
    lastStep.value = nextStep - 1 >= 0 ? nextStep - 1 : 0;
    currentStep.value = nextStep;
    // if the target element is not found, center the tooltip on the screen
    if (getCurrentStepTarget.value == document.body) {
      document.getElementById(parentId)?.classList.add("nt-center");
    } else {
      // remove the center class
      document.getElementById(parentId)?.classList.remove("nt-center");
    }
    // recalculate the popper
    await recalculatePopper();
    if (props.trapFocus) {
      activateFocusTrap();
    }
    // check if scroll should be locked
    if (props.lockScroll) isLocked.value = true;
  };

  /**
   * Reset the tour
   * @returns void
   */
  const resetTour = async () => {
    // set the current step to 0
    currentStep.value = 0;
    // set the last step to 0
    lastStep.value = 0;
    // set the storage item to false
    storageItem.value = false;
    // deactivate the focus trap
    deActivateFocusTrap();
    // unlock the scroll
    isLocked.value = false;
    // destroy the popper instance
    popper.value?.destroy();
    // if the tour has not started, start the tour
    await startTour();
  };

  /**
   * Recalculate the popper
   * @returns void
   */
  const recalculatePopper = async () => {
    // get the parent element and set the data-hidden attr
    showParent.value = false;
    document.getElementById(parentId)?.setAttribute("data-hidden", "");
    // get the current step's target
    const currentTarget = getCurrentStepTarget.value;
    jump(getCurrentStepTarget.value, {
      ...jumpConfig.value,
      callback: async () => {
        setTimeout(() => {
          document.getElementById(parentId)?.removeAttribute("data-hidden");
          showParent.value = true;
          if (props.highlight) {
            getClipPath.value = getClipPathValues(`.${highlightClass}`);
          }
        }, 500);
      },
    });
    await popper.value?.setOptions(
      merge({}, defaultPopperConfig, getCurrentStep.value?.popperConfig)
    );
    // if the target element is not found, center the tooltip on the screen
    if (getCurrentStepTarget.value == document.body) {
      document.getElementById(parentId)?.classList.add("nt-center");
      // update popper options for centering the tooltip
      await popper.value?.setOptions({
        placement: "auto",
        strategy: "fixed",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 0],
            },
          },
          //  Custom modifier to hide the arrow
          {
            name: "hideArrow",
            enabled: true,
            phase: "write",
            fn: ({ state }: any) => {
              // Set arrow style to display: none
              state.styles.arrow = {
                ...state.styles.arrow,
                display: "none",
              };
            },
            effect: ({ state }: any) => {
              // Update Popper.js to reflect changes
              state.elements.arrow.style.display = "none";
            },
          },
        ],
      });
    } else {
      // remove the center class
      document.getElementById(parentId)?.classList.remove("nt-center");
      // @ts-expect-error - When using nuxi typecheck disable error below
      popper.value.state.elements.reference = getCurrentStepTarget.value;
      await popper.value?.update();
    }

    updateBackdrop();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    props.highlight ? highlightTarget() : null;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    getCurrentStep.value.onShow ? await getCurrentStep.value.onShow() : null;
  };

  onMounted(async () => {
    if (props.autoStart) {
      await startTour();
    }
  });

  defineExpose({
    startTour,
    endTour,
    nextStep,
    prevStep,
    goToStep,
    resetTour,
    recalculatePopper,
    activateFocusTrap,
    deActivateFocusTrap,
    isLocked,
  });
</script>
