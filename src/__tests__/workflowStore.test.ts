import { beforeEach, describe, expect, it } from 'vitest'

import { useWorkflowStore } from '../store/workflowStore'

const makeTrigger = (id: string) => ({
  id,
  type: 'trigger',
  position: { x: 0, y: 0 },
  data: { kind: 'trigger', label: 'Test Trigger', event: 'form.submit' } as Record<string, unknown>,
})

const makeCondition = (id: string) => ({
  id,
  type: 'condition',
  position: { x: 0, y: 0 },
  data: {
    kind: 'condition',
    label: 'Test Condition',
    field: 'score',
    operator: '>',
    value: '5',
  } as Record<string, unknown>,
})

const makeAction = (id: string) => ({
  id,
  type: 'action',
  position: { x: 0, y: 0 },
  data: {
    kind: 'action',
    label: 'Test Action',
    actionType: 'send_email',
    config: { to: 'test@example.com' },
  } as Record<string, unknown>,
})

beforeEach(() => {
  useWorkflowStore.setState({ workflowName: 'Test Workflow', nodes: [], edges: [] })
})

describe('workflowStore', () => {
  it('sets workflow name', () => {
    useWorkflowStore.getState().setWorkflowName('My Workflow')
    expect(useWorkflowStore.getState().workflowName).toBe('My Workflow')
  })

  it('adds a node', () => {
    useWorkflowStore.getState().addNode(makeTrigger('trigger-1'))
    expect(useWorkflowStore.getState().nodes).toHaveLength(1)
  })

  it('adds multiple nodes of different types', () => {
    useWorkflowStore.getState().addNode(makeTrigger('trigger-1'))
    useWorkflowStore.getState().addNode(makeCondition('condition-1'))
    useWorkflowStore.getState().addNode(makeAction('action-1'))
    expect(useWorkflowStore.getState().nodes).toHaveLength(3)
  })

  it('exports workflow with correct shape', () => {
    useWorkflowStore.getState().addNode(makeTrigger('trigger-1'))
    const exported = useWorkflowStore.getState().exportWorkflow()
    expect(exported).toMatchObject({
      name: 'Test Workflow',
      nodes: [{ id: 'trigger-1', kind: 'trigger' }],
      edges: [],
    })
    expect(exported.id).toBeTruthy()
    expect(exported.exportedAt).toBeTruthy()
  })

  it('exports workflow with edges', () => {
    useWorkflowStore.getState().addNode(makeTrigger('trigger-1'))
    useWorkflowStore.getState().addNode(makeAction('action-1'))
    useWorkflowStore.getState().onConnect({
      source: 'trigger-1',
      target: 'action-1',
      sourceHandle: null,
      targetHandle: null,
    })
    const exported = useWorkflowStore.getState().exportWorkflow()
    expect(exported.edges).toHaveLength(1)
    expect(exported.edges[0]).toMatchObject({ from: 'trigger-1', to: 'action-1' })
  })

  it('clears workflow', () => {
    useWorkflowStore.getState().addNode(makeTrigger('trigger-1'))
    useWorkflowStore.getState().clearWorkflow()
    expect(useWorkflowStore.getState().nodes).toHaveLength(0)
    expect(useWorkflowStore.getState().edges).toHaveLength(0)
  })

  it('updates trigger node data', () => {
    useWorkflowStore.getState().addNode(makeTrigger('trigger-1'))
    useWorkflowStore.getState().updateNodeData('trigger-1', { label: 'Updated Label' })
    const node = useWorkflowStore.getState().nodes.find((n) => n.id === 'trigger-1')
    expect(node?.data.label).toBe('Updated Label')
  })

  it('updates condition node field and value', () => {
    useWorkflowStore.getState().addNode(makeCondition('condition-1'))
    useWorkflowStore.getState().updateNodeData('condition-1', { field: 'age', value: '18' })
    const node = useWorkflowStore.getState().nodes.find((n) => n.id === 'condition-1')
    expect(node?.data.field).toBe('age')
    expect(node?.data.value).toBe('18')
  })

  it('updates action node config', () => {
    useWorkflowStore.getState().addNode(makeAction('action-1'))
    useWorkflowStore.getState().updateNodeData('action-1', {
      config: { to: 'new@example.com', subject: 'Hello' },
    })
    const node = useWorkflowStore.getState().nodes.find((n) => n.id === 'action-1')
    expect(node?.data.config).toMatchObject({ to: 'new@example.com', subject: 'Hello' })
  })

  it('does not update other nodes when targeting a specific id', () => {
    useWorkflowStore.getState().addNode(makeTrigger('trigger-1'))
    useWorkflowStore.getState().addNode(makeTrigger('trigger-2'))
    useWorkflowStore.getState().updateNodeData('trigger-1', { label: 'Changed' })
    const other = useWorkflowStore.getState().nodes.find((n) => n.id === 'trigger-2')
    expect(other?.data.label).toBe('Test Trigger')
  })
})
