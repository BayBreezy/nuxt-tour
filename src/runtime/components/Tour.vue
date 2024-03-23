<template>
  <div ref="target" :id="parentId" data-hidden role="tooltip">
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
          <h3 v-if="getCurrentStep.title" id="nt-tooltip-title">{{ getCurrentStep.title }}</h3>
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
          <p v-if="getCurrentStep.subText" id="nt-tooltip-sub-text">
            {{ getCurrentStep.subText }}
          </p>
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
      <div v-if="getCurrentStep.body" id="nt-tooltip-body">
        <p>{{ getCurrentStep.body }}</p>
      </div>
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
            type="button"
            id="nt-action-skip"
            @click.prevent="
              endTour();
              props.onSkip?.();
            "
          >
            {{ skipButton?.label || "Skip" }}
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
            id="nt-action-prev"
            v-if="currentStep > 0"
            type="button"
            @click.prevent="prevStep"
          >
            {{ prevButton?.label || "Prev" }}
          </button>
        </slot>
        <slot
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
            {{ isLastStep ? finishButton?.label || "Done" : nextButton?.label || "Next" }}
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
      <div v-show="showArrow" :id="arrowId" data-popper-arrow></div>
    </slot>
  </div>
</template>

<script lang="ts" setup>
  import { createPopper } from "@popperjs/core";
  import { useScrollLock, useStorage, useTimeoutFn } from "@vueuse/core";
  import { useFocusTrap } from "@vueuse/integrations/useFocusTrap";
  import { computed, onMounted, ref, shallowRef, toValue } from "#imports";
  import { defu } from "defu";
  import jump from "jump.js";
  import type { TourProps } from "../props";
  import type { Instance, Modifier, OptionsGeneric } from "@popperjs/core";
  import type { Options } from "jump.js";

  const props = withDefaults(defineProps<TourProps>(), {
    name: "default",
    autoStart: false,
    startDelay: 100,
    highlight: false,
    showArrow: true,
    trapFocus: true,
    lockScroll: true,
  });

  /** The merged config to pass to jump */
  const jumpConfig = computed<Options>(() =>
    defu(props.jumpOptions, {
      duration: 300,
      offset: -100,
    } as Options)
  );

  const popper = ref<Instance | null>(null);

  const emit = defineEmits<{
    /**
     * Emitted when the tour starts
     */
    onTourStart: [];
    /**
     * Emitted when the tour ends
     */
    onTourEnd: [];
  }>();

  // check if the steps prop is empty
  if (!props.steps.length) {
    throw new Error("You must provide at least one step to the tour");
  }

  // The target of the focus trap
  const target = ref();
  const { activate: activateFocusTrap, deactivate: deActivateFocusTrap } = useFocusTrap(target);

  const isLocked = useScrollLock(window);

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
  /** The tour current step */
  const currentStep = shallowRef(0);
  /** The tour last step */
  const lastStep = shallowRef<number | null>(props.steps.length - 1);
  /** The current/active step of the tour. */
  const getCurrentStep = computed(() => {
    return props.steps[currentStep.value];
  });
  /** The last step of the tour. */
  const getLastStep = computed(() => {
    return props.steps[lastStep.value || props.steps.length - 1];
  });
  /** The maximum number of steps in the tour */
  const maxSteps = computed(() => props.steps.length - 1);
  /** The name of the item that will be stored in localStorage. This item will be false by default */
  const storageItem = useStorage(`${tourPrefix}${props.name || "default"}`, false);
  /** Stores a `boolean` value that indicates if the tour is on the last step */
  const isLastStep = computed(() => currentStep.value === maxSteps.value);

  /** The default configuration passed to popper */
  const defaultPopperConfig: Partial<OptionsGeneric<Partial<Modifier<any, any>>>> | undefined = {
    placement: "top",
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

    // Timeout function used to trigger the tour after the specified delay
    useTimeoutFn(async () => {
      // get the parent element and remove the data-hidden attr
      const parent = document.getElementById(parentId);
      parent?.removeAttribute("data-hidden");

      // if the target element is not found, center the tooltip on the screen
      if (!getCurrentStep.value.target) {
        // center the tooltip
        parent?.classList.add("nt-center");
      } else {
        // remove the center class
        parent?.classList.remove("nt-center");
      }

      // get the current step's target
      let target: HTMLElement | null = null;
      // if the target is found, set the target to the target element
      if (toValue(getCurrentStep.value.target)) {
        target = document.querySelector(toValue(getCurrentStep.value.target!));
      }
      const tour = document.getElementById("nt-tooltip");

      // create the popper instance
      popper.value = createPopper(
        target || document.body,
        tour!,
        defu(getCurrentStep.value?.popperConfig, defaultPopperConfig)
      );

      // highlight the target element (if the highlight prop is true & the target element is found)
      props.highlight && target ? highlightTarget() : null;
      // if the current step has an onShow function, call it
      getCurrentStep.value.onShow ? await getCurrentStep.value.onShow() : null;
      // jump to the target element or the body
      jump(target || document.body, jumpConfig.value);
      // emit the onTourStart event
      emit("onTourStart");
      // set the tourStarted value to true
      tourStarted.value = true;
      // activate the focus trap
      if (props.trapFocus) activateFocusTrap();
      // check if scroll should be locked
      if (props.lockScroll) isLocked.value = true;
    }, Number(props.startDelay));
  };

  /**
   * Highlight the target element
   * @returns void
   */
  const highlightTarget = () => {
    // remove the highlight class from all elements
    const highlightedElements = document.querySelectorAll(`.${highlightClass}`);
    highlightedElements.forEach((el) => el.classList.remove(highlightClass));
    // add the highlight class to the current step's target
    let _currentStep = document.querySelector(`${getCurrentStep.value.target}`);
    _currentStep?.classList.add(highlightClass);
  };

  /**
   * Move to the next step
   * @returns void
   */
  const nextStep = async () => {
    // if the current step is less than the max steps, end the tour
    if (currentStep.value < maxSteps.value) {
      // if the current step has an onNext function, call it
      getCurrentStep.value.onNext ? await getCurrentStep.value.onNext() : null;
      // set the last step to the current step
      lastStep.value = currentStep.value;
      // increment the current step
      currentStep.value++;
      // if the target element is not found, center the tooltip on the screen
      if (!document.querySelector(`${getCurrentStep.value.target}`)) {
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
      getCurrentStep.value.onPrev ? await getCurrentStep.value.onPrev() : null;
      // set the last step to the current step
      lastStep.value = currentStep.value;
      // decrement the current step
      currentStep.value--;
      // if the target element is not found, center the tooltip on the screen
      if (!document.querySelector(`${getCurrentStep.value.target}`)) {
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
    // remove the highlight class from all elements
    const highlightedElements = document.querySelectorAll(`.${highlightClass}`);
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
    getCurrentStep.value.onNext ? await getCurrentStep.value.onNext() : null;
    lastStep.value = nextStep - 1 >= 0 ? nextStep - 1 : 0;
    currentStep.value = nextStep;
    // if the target element is not found, center the tooltip on the screen
    if (!document.querySelector(`${getCurrentStep.value.target}`)) {
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
    await popper.value?.setOptions(defu(getCurrentStep.value?.popperConfig, defaultPopperConfig));
    // get the current step's target
    const currentTarget = document.querySelector(`${getCurrentStep.value.target}`);
    // if the target element is not found, center the tooltip on the screen
    if (!currentTarget) {
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
      //@ts-ignore
      popper.value.state.elements.reference = document.querySelector(
        `${getCurrentStep.value.target}`
      );
      await popper.value?.update();
    }
    props.highlight ? highlightTarget() : null;
    jump(
      document.querySelector(`${getCurrentStep.value.target}`) || document.body,
      jumpConfig.value
    );
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
