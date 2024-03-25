import type { Modifier, OptionsGeneric } from "@popperjs/core";
import type { ComputedRef, MaybeRefOrGetter, Ref } from "#imports";
import type { Options } from "jump.js";

export type ButtonProp = {
  /**
   * The label of the button
   */
  label?: string;
  /**
   * The icon to display in the button.
   *
   * Any icon from the [Icones](https://icones.netlify.app/) website can be used here
   */
  icon?: string;
};

export type TourStep = {
  /**
   * The element that the step should target
   *
   * This can be a CSS selector, a ref of type string
   *
   * If this is not passed, the step will be positioned in the center of the screen
   */
  target?: string | undefined | null | MaybeRefOrGetter<string> | ComputedRef<string>;

  /**
   * The title of the step
   */
  title?: string | HTMLElement | Ref<HTMLElement> | Ref<string> | undefined | null;
  /**
   * The subtext of the step
   */
  subText?: string | HTMLElement | Ref<HTMLElement> | Ref<string> | undefined | null;
  /**
   * The content of the step
   */
  body?: string | HTMLElement | Ref<HTMLElement> | Ref<string> | undefined | null;
  /**
   * The configuration to pass to popperjs
   */
  popperConfig?: Partial<OptionsGeneric<Partial<Modifier<any, any>>>> | undefined;
  /**
   * The function that should be called when `Next` button is clicked
   */
  onNext?: () => void | (() => Promise<any>);
  /**
   * The function that should be called when `Prev` button is clicked
   */
  onPrev?: () => void | (() => Promise<any>);
  /**
   * The function that should be called when the step is displayed
   */
  onShow?: () => void | (() => Promise<any>);
  /**
   * The prefix that will be added to the slot name
   */
  slot?: string;
};

export type TourProps = {
  /**
   * The name of the tour
   * @default "default"
   */
  name?: string;
  /**
   * The steps of the tour
   */
  steps: TourStep[];
  /**
   * The function that should be called when the tour is completed
   */
  onComplete?: () => void | (() => Promise<any>);
  /**
   * The function that should be called when the tour is skipped
   */
  onSkip?: () => void | (() => Promise<any>);
  /**
   * Determines if the tour should be started automatically
   * @default false
   */
  autoStart?: boolean;
  /**
   * The delay before the tour starts. This will only work if `autoStart` is `true`
   * @default 0
   */
  startDelay?: number | string | null;
  /**
   * When this is `true`, the target element will be highlighted
   */
  highlight?: boolean;
  /**
   * The configuration of the `Next` button
   */
  nextButton?: ButtonProp;
  /**
   * The configuration of the `Skip` button
   */
  skipButton?: ButtonProp;
  /**
   * The configuration of the `Prev` button
   */
  prevButton?: ButtonProp;
  /**
   * The configuration of the `Finish` button
   */
  finishButton?: ButtonProp;
  /**
   * Prop used to determine if the arrow should be shown or not
   * @default true
   */
  showArrow?: boolean;
  /**
   * The configuration to pass to jump.js
   *
   * @default { duration: 600, offset: -100 }
   */
  jumpOptions?: Options;
  /**
   * Determines if focus should be trapped within the tour
   *
   * @default true
   */
  trapFocus?: boolean;
  /**
   * Determines if the scroll should be locked when the tour is active
   *
   * @default true
   */
  lockScroll?: boolean;
};
