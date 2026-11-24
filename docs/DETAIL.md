# Queue reorder

Reorder queued `next-turn` messages in a DeepSeek Harness conversation.

## Usage

- Type `/queue-reorder <position|id> up|down` in the composer. `position` is a
  0-based index in the queued list; an id moves the matching message. When a
  token is all digits it is treated as a position.
- When at least two messages are queued, a reorder strip appears in the input
  dock with up/down buttons for each queued message.

## Limitations

- Reordering only applies to the queued (`next-turn`) list; steered
  (`next-step`) input cannot be reordered.
- The plugin reorders through the public `Inbox.remove` + `Inbox.splice`
  operations. `remove` emits an `agent/inbox/discarded` event, which the
  goal-round driver may interpret as a cancellation when the moved message is a
  pending goal attempt. A clean `Inbox.move` primitive is proposed upstream in
  the DeepSeek Harness Discussions.
