# Next-turn reorder

Reorder queued `next-turn` messages in a DeepSeek Harness conversation.

## Usage

- Type `/next-turn-reorder <position|id> up|down` in the composer. `position` is a
  0-based index in the queued list; an id moves the matching message. When a
  token is all digits it is treated as a position.
- When at least two messages are queued, a reorder strip appears in the input
  dock with up/down buttons for each queued message.

## Limitations

- Reordering only applies to the queued (`next-turn`) list; steered
  (`next-step`) input cannot be reordered.
- Messages whose source is not a plain `user` (for example a goal round prompt)
  are refused and left in place, because the `remove + splice` fallback would
  emit `agent/inbox/discarded`, which the goal-round driver reads as a
  cancellation.
- A clean `Inbox.move` primitive is proposed upstream in the DeepSeek Harness
  Discussions; once it lands, the refusal and the fallback can be dropped.
