# dsh-next-turn-reorder

Reorder queued `next-turn` messages in DeepSeek Harness.

A community plugin that fills the gap until the official Harness ships a native
next-turn-reorder primitive. See the upstream proposal for the core `Inbox.move`
capability.

## What it does

- Registers a host slash command `/next-turn-reorder <position|id> up|down`.
- Adds a reorder strip to the input dock with up/down buttons per queued message.

## Install

- Local directory: **Plugins** > **Add plugin**, or
  `dsh plugin --profile <name> add ./dsh-next-turn-reorder`.
- npm: `dsh plugin --profile <name> add dsh-next-turn-reorder`.

## Known limitation

Reordering is implemented with the public `Inbox.remove` + `Inbox.splice`
operations. `remove` emits `agent/inbox/discarded`, which the goal-round driver
can read as a cancellation when the moved message is a pending goal attempt.
As a mitigation, messages whose source is not a plain `user` (for example a
goal round prompt) are refused with an error and left in place.

A clean `Inbox.move` primitive (reorder without a discard notification) is
tracked upstream in the DeepSeek Harness Discussions; once it lands, the
refusal and the `remove + splice` fallback can be dropped.

## Development

```sh
node --check index.js && node --check client.js
```
