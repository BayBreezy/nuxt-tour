---
title: "Callbacks & Emits"
description: "See how you can use the different emits and callbacks available in the tour component."
icon: gravity-ui:function
---

## Callbacks and Emits

The following are functions that can be passed to the `VTour` component:

- `complete`: This function is called when the tour is completed. (It should be passed as `@complete=""`)
- `skip`: This function is called when the tour is skipped. (It should be passed as `@skip=""`)

The following are emits that can be listened to:

- `onTourStart`: This event is emitted when the tour starts.
- `onTourEnd`: This event is emitted when the tour ends.

:ExCallbackEmits

### The code
