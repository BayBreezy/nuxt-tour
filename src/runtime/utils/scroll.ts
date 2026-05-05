import jump from "jump.js";
import type { Options as JumpOptions } from "jump.js";

export type ScrollBehavior = "jump" | "smooth" | "none";

const defaultJumpOptions: JumpOptions = {
  duration: 300,
  offset: -150,
};

export function scrollToTarget(
  target: Element | null,
  behaviour: ScrollBehavior,
  jumpOptions?: JumpOptions
): Promise<void> {
  if (!target || behaviour === "none") return Promise.resolve();

  if (behaviour === "smooth") {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    // scrollIntoView has no callback; give it a short grace period
    return new Promise((resolve) => setTimeout(resolve, 300));
  }

  // 'jump' (default)
  const opts: JumpOptions = { ...defaultJumpOptions, ...jumpOptions };
  return new Promise((resolve) => {
    jump(target as HTMLElement, {
      ...opts,
      callback() {
        jumpOptions?.callback?.();
        resolve();
      },
    });
  });
}
