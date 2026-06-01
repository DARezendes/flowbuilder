import { Handle, Position } from '@xyflow/react'

import type { ConditionData } from '../../types'
import type { NodeProps } from '@xyflow/react'

export default function ConditionNode({ data, selected }: NodeProps) {
  const d = data as unknown as ConditionData
  return (
    <div
      className={`min-w-[160px] rounded-lg border bg-surface px-4 py-3 transition-all ${
        selected ? 'border-[#ff8c69] shadow-[0_0_0_1px_#ff8c6944]' : 'border-border'
      }`}
      style={{ borderTop: '1.5px solid #ff8c69aa' }}
    >
      <div className="mb-1 text-[10px] uppercase tracking-widest text-[#ff8c6988]">condition</div>
      <div className="text-[13px] font-medium text-[#d0d3dc]">{d.label}</div>
      <div className="mt-1 text-[11px] text-[#4a4f62]">
        {d.field} {d.operator} {d.value}
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-[#2e3038] !border-[1.5px] !border-[#ff8c69] !rounded-full"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="yes"
        style={{ top: '35%' }}
        className="!w-3 !h-3 !bg-[#2e3038] !border-[1.5px] !border-[#ff8c69] !rounded-full"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="no"
        style={{ top: '65%' }}
        className="!w-3 !h-3 !bg-[#2e3038] !border-[1.5px] !border-[#ff8c69] !rounded-full"
      />
    </div>
  )
}
