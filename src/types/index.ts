export type NodeKind = 'trigger' | 'condition' | 'action'

export interface TriggerData {
  kind: 'trigger'
  label: string
  event: string
}

export interface ConditionData {
  kind: 'condition'
  label: string
  field: string
  operator: '>' | '<' | '==' | '!=' | 'contains'
  value: string
}

export interface ActionData {
  kind: 'action'
  label: string
  actionType: 'send_email' | 'send_sms' | 'create_task' | 'update_field' | 'webhook'
  config: Record<string, string>
}

export type WorkflowNodeData = TriggerData | ConditionData | ActionData

export interface ExportedWorkflow {
  id: string
  name: string
  exportedAt: string
  nodes: Array<{ id: string; kind: NodeKind; data: WorkflowNodeData }>
  edges: Array<{ id: string; from: string; to: string }>
}
