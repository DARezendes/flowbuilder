import { useWorkflowStore } from '../../store/workflowStore'

import type { WorkflowNodeData } from '../../types'

const TEMPLATES = [
  {
    label: '+ trigger',
    kind: 'trigger',
    defaultData: {
      kind: 'trigger',
      label: 'New Trigger',
      event: 'form.submit',
    } as WorkflowNodeData,
  },
  {
    label: '+ condition',
    kind: 'condition',
    defaultData: {
      kind: 'condition',
      label: 'New Condition',
      field: 'score',
      operator: '>' as const,
      value: '0',
    } as WorkflowNodeData,
  },
  {
    label: '+ action',
    kind: 'action',
    defaultData: {
      kind: 'action',
      label: 'New Action',
      actionType: 'send_email' as const,
      config: {},
    } as WorkflowNodeData,
  },
]

const COLORS: Record<string, string> = {
  trigger: '#4ecdc4',
  condition: '#ff8c69',
  action: '#7e7eff',
}

let counter = 100

export default function Toolbar() {
  const { workflowName, setWorkflowName, addNode, exportWorkflow, clearWorkflow } = useWorkflowStore()

  function handleAdd(t: (typeof TEMPLATES)[0]) {
    const node = {
      id: `${t.kind}-${++counter}`,
      type: t.kind,
      position: { x: 200 + Math.random() * 200, y: 150 + Math.random() * 200 },
      data: t.defaultData as unknown as Record<string, unknown>,
    }
    addNode(node)
  }

  function handleExport() {
    const w = exportWorkflow()
    const blob = new Blob([JSON.stringify(w, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${workflowName.replace(/\s+/g, '-').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-2">
      <input
        value={workflowName}
        onChange={(e) => setWorkflowName(e.target.value)}
        className="min-w-[200px] bg-transparent text-[13px] font-medium text-[#d0d3dc] outline-none border-b border-transparent focus:border-[#4a4f62] transition-colors mr-2"
      />
      <div className="h-4 w-px bg-border" />
      {TEMPLATES.map((t) => (
        <button
          type="button"
          key={t.kind}
          onClick={() => handleAdd(t)}
          className="rounded border border-border bg-canvas px-3 py-1 text-[11px] transition-colors hover:border-[#4a4f62]"
          style={{ color: `${COLORS[t.kind]}cc` }}
        >
          {t.label}
        </button>
      ))}
      <div className="flex-1" />
      <button
        type="button"
        onClick={clearWorkflow}
        className="rounded border border-border bg-canvas px-3 py-1 text-[11px] text-[#4a4f62] transition-colors hover:text-[#9ba0ad]"
      >
        clear
      </button>
      <button
        type="button"
        onClick={handleExport}
        className="rounded border border-[#7e7eff55] bg-[#7e7eff11] px-3 py-1 text-[11px] text-accent transition-colors hover:bg-[#7e7eff22]"
      >
        export json ↓
      </button>
    </div>
  )
}
