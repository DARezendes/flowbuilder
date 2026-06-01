import { Background, BackgroundVariant, Controls, MiniMap, ReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import ActionNode from './components/nodes/ActionNode'
import ConditionNode from './components/nodes/ConditionNode'
import TriggerNode from './components/nodes/TriggerNode'
import EditPanel from './components/ui/EditPanel'
import Toolbar from './components/ui/Toolbar'
import { useWorkflowStore } from './store/workflowStore'

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
}

export default function App() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useWorkflowStore()

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: '#0e0f11' }}>
      <Toolbar />
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          deleteKeyCode="Backspace"
          defaultEdgeOptions={{ animated: false, style: { stroke: '#4a4f62', strokeWidth: 1.5 } }}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1e2026" />
          <Controls />
          <MiniMap
            nodeColor={(n) => {
              if (n.type === 'trigger') return '#4ecdc444'
              if (n.type === 'condition') return '#ff8c6944'
              return '#7e7eff44'
            }}
            style={{ background: '#1a1c20', border: '0.5px solid #2e3038' }}
          />
        </ReactFlow>
        <EditPanel />
      </div>
    </div>
  )
}
