import { Handle, Position } from '@xyflow/react'

import type { TriggerData } from '../../types'
import type { NodeProps } from '@xyflow/react'

export default function TriggerNode({ data, selected }: NodeProps) {
  const d = data as unknown as TriggerData
  return (
    <div
      className={`min-w-[160px] rounded-lg border bg-surface px-4 py-3 transition-all ${
        selected ? 'border-[#4ecdc4] shadow-[0_0_0_1px_#4ecdc444]' : 'border-border'
      }`}
      style={{ borderTop: '1.5px solid #4ecdc4aa' }}
    >
      <div className="mb-1 text-[10px] uppercase tracking-widest text-[#4ecdc488]">trigger</div>
      <div className="text-[13px] font-medium text-[#d0d3dc]">{d.label}</div>
      <div className="mt-1 text-[11px] text-[#4a4f62]">{d.event}</div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-[#2e3038] !border-[1.5px] !border-[#4ecdc4] !rounded-full"
      />
    </div>
  )
}
