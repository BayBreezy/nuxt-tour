import { fileURLToPath } from "node:url";
import { $fetch, setup } from "@nuxt/test-utils/e2e";
import { describe, expect, it } from "vitest";

describe("Display Tour To User", async () => {
  await setup({
    rootDir: fileURLToPath(new URL("./fixtures/basic", import.meta.url)),
  });

  it("loads the page properly", async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html: string = await $fetch("/");
    // Expect it to have the nt-tooltip id in the DOM
    expect(html).toContain("<div>");
  });

  it("has the target class on the h1 element", async () => {
    const html: string = await $fetch("/");
    // Expect it to have the target class on the h1 element
    expect(html).toContain('class="target"');
  });

  it(
    "automatically starts the tour",
    async () => {
      const html: string = await $fetch("/");
      expect(html).toContain('role="tooltip"');
    },
    { timeout: 20000 }
  );

  it("has correct content inside the step", async () => {
    const html: string = await $fetch("/");
    // Expect it to have the nt-tooltip id in the DOM
    expect(html).toContain("Welcome to the tour");
    expect(html).toContain("This is the subtext");
    expect(html).toContain("This is the first step");
  });
});
