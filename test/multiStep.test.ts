import { fileURLToPath } from "node:url";

import { $fetch, setup } from "@nuxt/test-utils/e2e";
import { describe, expect, it } from "vitest";

describe("Multi-step tour", async () => {
  await setup({
    rootDir: fileURLToPath(new URL("./fixtures/multistep", import.meta.url)),
  });

  it("renders all three target elements", async () => {
    const html: string = await $fetch("/");
    expect(html).toContain('class="step-1"');
    expect(html).toContain('class="step-2"');
    expect(html).toContain('class="step-3"');
  });

  it("renders the tooltip element in the DOM", async () => {
    const html: string = await $fetch("/");
    expect(html).toContain('role="tooltip"');
    expect(html).toContain('id="nt-tooltip"');
  });

  it("renders the first step title (SSR renders active step only)", async () => {
    const html: string = await $fetch("/");
    // SSR renders only the currently active step (index 0)
    expect(html).toContain("Step One");
  });

  it("renders the next button", async () => {
    const html: string = await $fetch("/");
    expect(html).toContain('id="nt-action-next"');
  });

  it("renders the skip button", async () => {
    const html: string = await $fetch("/");
    expect(html).toContain('id="nt-action-skip"');
  });
});
