/** Host half of the next-turn-reorder bundle: registers the /next-turn-reorder command. */
export function apply(ctx) {
  ctx.commands.register({
    name: 'next-turn-reorder',
    description: 'Move a queued next-turn message up or down',
    input: { hint: '<position|id> up|down', attachments: false },
    handler(invocation) {
      const [token, direction] = invocation.rawInput.trim().split(/\s+/)
      if (token === undefined || direction === undefined) {
        return { kind: 'error', text: 'Usage: /next-turn-reorder <position|id> up|down' }
      }
      const inbox = invocation.agent.inbox
      const queue = inbox.nextTurn
      if (queue.length < 2) {
        return { kind: 'error', text: 'At least two queued messages are required to reorder.' }
      }
      const from = /^\d+$/.test(token)
        ? Number(token)
        : queue.findIndex(message => message.id === token)
      if (!Number.isInteger(from) || from < 0 || from >= queue.length) {
        return { kind: 'error', text: 'Queued message not found.' }
      }
      if (direction !== 'up' && direction !== 'down') {
        return { kind: 'error', text: 'Direction must be "up" or "down".' }
      }
      const to = direction === 'up' ? from - 1 : from + 1
      if (to < 0 || to >= queue.length) {
        return { kind: 'error', text: 'That message is already at the edge of the queue.' }
      }
      const message = queue[from]
      // Stopgap reorder: remove + splice. This emits agent/inbox/discarded, which
      // goal-round-driver may read as a cancellation; a core inbox.move would avoid it.
      inbox.remove(message.id)
      inbox.splice('next-turn', to, 0, [message])
      const preview = message.content.filter(block => block.type === 'text').map(block => block.text).join(' ').trim()
      return { kind: 'success', text: `Moved ${preview === '' ? 'the message' : `"${preview.slice(0, 60)}"`} ${direction}.` }
    },
  })
}
