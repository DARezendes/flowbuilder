import { Handle, Position } from '@xyflow/react'

import type { ActionData } from '../../types'
import type { NodeProps } from '@xyflow/react'

const ICONS: Record<string, string> = {
  send_email: '✉',
  send_sms: '💬',
  create_task: '✓',
  update_field: '✎',
  webhook: '⚡',
}

function ActionFields({ d }: { d: ActionData }) {
  switch (d.actionType) {
    case 'send_email':
      return <div className="mt-1 text-[11px] text-[#4a4f62]">to: {d.config.to ?? '—'}</div>
    case 'send_sms':
      return <div className="mt-1 text-[11px] text-[#4a4f62]">to: {d.config.to ?? '—'}</div>
    case 'create_task':
      return (
        <div className="mt-1 text-[11px] text-[#4a4f62]">
          <div>title: {d.config.title ?? '—'}</div>
          <div>assignee: {d.config.assignee ?? '—'}</div>
        </div>
      )
    case 'update_field':
      return (
        <div className="mt-1 text-[11px] text-[#4a4f62]">
          <div>field: {d.config.field ?? '—'}</div>
          <div>value: {d.config.value ?? '—'}</div>
        </div>
      )
    case 'webhook':
      return <div className="mt-1 text-[11px] text-[#4a4f62]">url: {d.config.url ?? '—'}</div>
    default:
      return null
  }
}

export default function ActionNode({ data, selected }: NodeProps) {
  const d = data as unknown as ActionData

  return (
    <div
      className={`min-w-[160px] rounded-lg border bg-surface px-4 py-3 transition-all ${
        selected ? 'border-[#7e7eff] shadow-[0_0_0_1px_#7e7eff44]' : 'border-border'
      }`}
      style={{ borderTop: '1.5px solid #7e7effaa' }}
    >
      <div className="mb-1 text-[10px] uppercase tracking-widest text-[#7e7eff88]">action</div>
      <div className="flex items-center gap-2">
        <span className="text-base">{ICONS[d.actionType] ?? '▶'}</span>
        <span className="text-[13px] font-medium text-[#d0d3dc]">{d.label}</span>
      </div>
      <div className="mt-0.5 text-[10px] text-[#4a4f62] uppercase tracking-widest">
        {d.actionType.replace(/_/g, ' ')}
      </div>
      <ActionFields d={d} />
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-[#2e3038] !border-[1.5px] !border-[#7e7eff] !rounded-full"
      />
    </div>
  )
}
