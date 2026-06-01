import { useWorkflowStore } from '../../store/workflowStore'

import type { ActionData, ConditionData, TriggerData } from '../../types'

const EVENTS = ['form.submit', 'session.start', 'assessment.complete', 'user.signup', 'score.updated']
const OPERATORS = ['>', '<', '==', '!=', 'contains'] as const
const ACTION_TYPES = ['send_email', 'send_sms', 'create_task', 'update_field', 'webhook'] as const

const inputClass =
  'w-full rounded border border-border bg-canvas px-3 py-1.5 text-[12px] text-[#d0d3dc] outline-none focus:border-[#4a4f62] transition-colors'

const selectClass =
  'w-full rounded border border-border bg-canvas px-3 py-1.5 text-[12px] text-[#d0d3dc] outline-none focus:border-[#4a4f62] transition-colors'

function Field({ label, children, htmlFor }: { label: string; children: React.ReactNode; htmlFor: string }) {
  return (
    <div className="mb-4">
      <label htmlFor={htmlFor} className="mb-1 block text-[10px] uppercase tracking-widest text-[#4a4f62]">
        {label}
      </label>
      {children}
    </div>
  )
}

function TriggerFields({ data, nodeId }: { data: TriggerData; nodeId: string }) {
  const { updateNodeData } = useWorkflowStore()

  return (
    <>
      <Field label="label" htmlFor={`${nodeId}-label`}>
        <input
          id={`${nodeId}-label`}
          className={inputClass}
          value={data.label}
          onChange={(e) => updateNodeData(nodeId, { label: e.target.value })}
        />
      </Field>
      <Field label="event" htmlFor={`${nodeId}-event`}>
        <select
          id={`${nodeId}-event`}
          className={selectClass}
          value={data.event}
          onChange={(e) => updateNodeData(nodeId, { event: e.target.value })}
        >
          {EVENTS.map((ev) => (
            <option key={ev} value={ev}>
              {ev}
            </option>
          ))}
        </select>
      </Field>
    </>
  )
}

function ConditionFields({ data, nodeId }: { data: ConditionData; nodeId: string }) {
  const { updateNodeData } = useWorkflowStore()

  return (
    <>
      <Field label="label" htmlFor={`${nodeId}-label`}>
        <input
          id={`${nodeId}-label`}
          className={inputClass}
          value={data.label}
          onChange={(e) => updateNodeData(nodeId, { label: e.target.value })}
        />
      </Field>
      <Field label="field" htmlFor={`${nodeId}-field`}>
        <input
          id={`${nodeId}-field`}
          className={inputClass}
          value={data.field}
          onChange={(e) => updateNodeData(nodeId, { field: e.target.value })}
        />
      </Field>
      <Field label="operator" htmlFor={`${nodeId}-operator`}>
        <select
          id={`${nodeId}-operator`}
          className={selectClass}
          value={data.operator}
          onChange={(e) => updateNodeData(nodeId, { operator: e.target.value as ConditionData['operator'] })}
        >
          {OPERATORS.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
      </Field>
      <Field label="value" htmlFor={`${nodeId}-value`}>
        <input
          id={`${nodeId}-value`}
          className={inputClass}
          value={data.value}
          onChange={(e) => updateNodeData(nodeId, { value: e.target.value })}
        />
      </Field>
    </>
  )
}

function ActionFields({ data, nodeId }: { data: ActionData; nodeId: string }) {
  const { updateNodeData } = useWorkflowStore()

  function updateConfig(key: string, value: string) {
    updateNodeData(nodeId, { config: { ...data.config, [key]: value } })
  }

  return (
    <>
      <Field label="label" htmlFor={`${nodeId}-label`}>
        <input
          id={`${nodeId}-label`}
          className={inputClass}
          value={data.label}
          onChange={(e) => updateNodeData(nodeId, { label: e.target.value })}
        />
      </Field>
      <Field label="action type" htmlFor={`${nodeId}-action-type`}>
        <select
          id={`${nodeId}-action-type`}
          className={selectClass}
          value={data.actionType}
          onChange={(e) =>
            updateNodeData(nodeId, {
              actionType: e.target.value as ActionData['actionType'],
              config: {},
            })
          }
        >
          {ACTION_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </Field>

      {(data.actionType === 'send_email' || data.actionType === 'send_sms') && (
        <Field label="to" htmlFor={`${nodeId}-to`}>
          <input
            id={`${nodeId}-to`}
            className={inputClass}
            value={data.config.to ?? ''}
            onChange={(e) => updateConfig('to', e.target.value)}
          />
        </Field>
      )}

      {data.actionType === 'send_email' && (
        <Field label="subject" htmlFor={`${nodeId}-subject`}>
          <input
            id={`${nodeId}-subject`}
            className={inputClass}
            value={data.config.subject ?? ''}
            onChange={(e) => updateConfig('subject', e.target.value)}
          />
        </Field>
      )}

      {data.actionType === 'create_task' && (
        <>
          <Field label="title" htmlFor={`${nodeId}-title`}>
            <input
              id={`${nodeId}-title`}
              className={inputClass}
              value={data.config.title ?? ''}
              onChange={(e) => updateConfig('title', e.target.value)}
            />
          </Field>
          <Field label="assignee" htmlFor={`${nodeId}-assignee`}>
            <input
              id={`${nodeId}-assignee`}
              className={inputClass}
              value={data.config.assignee ?? ''}
              onChange={(e) => updateConfig('assignee', e.target.value)}
            />
          </Field>
        </>
      )}

      {data.actionType === 'update_field' && (
        <>
          <Field label="field" htmlFor={`${nodeId}-uf-field`}>
            <input
              id={`${nodeId}-uf-field`}
              className={inputClass}
              value={data.config.field ?? ''}
              onChange={(e) => updateConfig('field', e.target.value)}
            />
          </Field>
          <Field label="value" htmlFor={`${nodeId}-uf-value`}>
            <input
              id={`${nodeId}-uf-value`}
              className={inputClass}
              value={data.config.value ?? ''}
              onChange={(e) => updateConfig('value', e.target.value)}
            />
          </Field>
        </>
      )}

      {data.actionType === 'webhook' && (
        <Field label="url" htmlFor={`${nodeId}-url`}>
          <input
            id={`${nodeId}-url`}
            className={inputClass}
            value={data.config.url ?? ''}
            onChange={(e) => updateConfig('url', e.target.value)}
          />
        </Field>
      )}
    </>
  )
}

export default function EditPanel() {
  const { nodes } = useWorkflowStore()
  const selectedNode = nodes.find((n) => n.selected)

  if (!selectedNode) return null

  const kind = selectedNode.data.kind as string
  const data = selectedNode.data as unknown

  const KIND_COLORS: Record<string, string> = {
    trigger: '#4ecdc4',
    condition: '#ff8c69',
    action: '#7e7eff',
  }

  return (
    <div
      className="absolute right-0 top-0 h-full w-64 border-l border-border bg-surface p-4 overflow-y-auto"
      style={{ zIndex: 10 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-widest" style={{ color: KIND_COLORS[kind] ?? '#9ba0ad' }}>
          {kind}
        </div>
        <div className="text-[10px] text-[#4a4f62]">{selectedNode.id}</div>
      </div>

      {kind === 'trigger' && <TriggerFields data={data as TriggerData} nodeId={selectedNode.id} />}
      {kind === 'condition' && <ConditionFields data={data as ConditionData} nodeId={selectedNode.id} />}
      {kind === 'action' && <ActionFields data={data as ActionData} nodeId={selectedNode.id} />}
    </div>
  )
}
