window.__ModuleLoader__.load({
  id: 'dsh-next-turn-reorder',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useState } = React

    function textOf(message) {
      return message.content.filter(block => block.type === 'text').map(block => block.text).join(' ').trim()
    }

    return {
      inject: ['slots', 'remote', 'remote.commands'],
      apply(ctx) {
        const execute = (sessionId, line) => ctx.remote.commands.execute(sessionId, line, [])

        function ReorderDock(props) {
          const { useSession, useProjection } = props
          const sessionId = useSession(session => session.sessionId)
          const inbox = useProjection('inbox')
          const queue = (inbox?.['next-turn'] ?? []).filter(message => message.source.kind === 'user')
          const [busy, setBusy] = useState(false)
          if (queue.length < 2) return null
          const move = (index, direction) => {
            setBusy(true)
            void execute(sessionId, `/next-turn-reorder ${index} ${direction}`).finally(() => setBusy(false))
          }
          const rowStyle = { display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0' }
          const textStyle = { flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
          return h('div', { role: 'group', 'aria-label': 'Next-turn reorder' },
            queue.map((message, index) => h('div', { key: message.id, style: rowStyle },
              h('span', { style: textStyle }, textOf(message) || '(attachment)'),
              h('button', {
                type: 'button', disabled: busy || index === 0,
                onClick: () => move(index, 'up'), 'aria-label': 'Move up', title: 'Move up',
              }, '↑'),
              h('button', {
                type: 'button', disabled: busy || index === queue.length - 1,
                onClick: () => move(index, 'down'), 'aria-label': 'Move down', title: 'Move down',
              }, '↓'),
            )),
          )
        }

        ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({
          name: 'conversation.input.dock', id: 'dsh-next-turn-reorder', order: 100,
        }, ReorderDock))
      },
    }
  },
})
