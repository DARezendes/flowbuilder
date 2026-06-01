import { addEdge, applyEdgeChanges, applyNodeChanges } from '@xyflow/react'
import { create } from 'zustand'

import type { ExportedWorkflow, WorkflowNodeData } from '../types'
import type { Connection, Edge, EdgeChange, Node, NodeChange } from '@xyflow/react'

type FlowNode = Node<Record<string, unknown>>

interface WorkflowState {
  workflowName: string
  nodes: FlowNode[]
  edges: Edge[]
  setWorkflowName: (name: string) => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void
  addNode: (node: FlowNode) => void
  exportWorkflow: () => ExportedWorkflow
  clearWorkflow: () => void
}

const INITIAL_NODES: FlowNode[] = [
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 80, y: 200 },
    data: { kind: 'trigger', label: 'Form Submitted', event: 'form.submit' },
  },
  {
    id: 'condition-1',
    type: 'condition',
    position: { x: 320, y: 120 },
    data: {
      kind: 'condition',
      label: 'Score Check',
      field: 'score',
      operator: '>',
      value: '5',
    },
  },
  {
    id: 'action-1',
    type: 'action',
    position: { x: 560, y: 60 },
    data: {
      kind: 'action',
      label: 'Send Email',
      actionType: 'send_email',
      config: { to: 'care@example.com' },
    },
  },
  {
    id: 'action-2',
    type: 'action',
    position: { x: 560, y: 240 },
    data: {
      kind: 'action',
      label: 'Create Task',
      actionType: 'create_task',
      config: { title: 'Follow up', assignee: 'care_team' },
    },
  },
]

const INITIAL_EDGES: Edge[] = [
  { id: 'e1', source: 'trigger-1', target: 'condition-1', animated: true },
  { id: 'e2', source: 'condition-1', target: 'action-1', label: 'yes' },
  { id: 'e3', source: 'condition-1', target: 'action-2', label: 'no' },
]

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflowName: 'Patient Intake Workflow',
  nodes: INITIAL_NODES,
  edges: INITIAL_EDGES,

  setWorkflowName: (name) => set({ workflowName: name }),

  onNodesChange: (changes) => set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) })),

  onEdgesChange: (changes) => set((s) => ({ edges: applyEdgeChanges(changes, s.edges) })),

  onConnect: (connection) => set((s) => ({ edges: addEdge({ ...connection, animated: true }, s.edges) })),

  updateNodeData: (nodeId, data) =>
    set((s) => ({
      nodes: s.nodes.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n)),
    })),

  addNode: (node) => set((s) => ({ nodes: [...s.nodes, node] })),

  exportWorkflow: () => {
    const { nodes, edges, workflowName } = get()
    return {
      id: crypto.randomUUID(),
      name: workflowName,
      exportedAt: new Date().toISOString(),
      nodes: nodes.map((n) => ({
        id: n.id,
        kind: n.data.kind as WorkflowNodeData['kind'],
        data: n.data as unknown as WorkflowNodeData,
      })),
      edges: edges.map((e) => ({ id: e.id, from: e.source, to: e.target })),
    }
  },

  clearWorkflow: () => set({ nodes: [], edges: [] }),
}))
