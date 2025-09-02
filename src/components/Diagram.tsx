import React, { useState, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
} from "reactflow";
import type { Node } from "reactflow";
import type { Edge } from "reactflow";
import type { Position } from "reactflow";
import "reactflow/dist/style.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import dagre from "dagre";

// Types
interface Task {
  id: string;
  task_title: string;
  status: "completed" | "in-progress" | "pending";
}

interface TaskGroup {
  group_name: string;
  tasks: Task[];
}

interface User {
  id: string;
  task_owner: string;
  approvers: string[];
  taskGroups: TaskGroup[];
}

// Sample data
const users: User[] = [
  {
    id: "1",
    task_owner: "Paul",
    approvers: ["4", "4"],
    taskGroups: [
      {
        group_name: "Frontend",
        tasks: [
          { id: "1", task_title: "Paul Task 1", status: "completed" },
          { id: "2", task_title: "Paul Task 2", status: "in-progress" },
        ],
      },
      {
        group_name: "Backend",
        tasks: [
          { id: "3", task_title: "Paul Task 3", status: "pending" },
          { id: "4", task_title: "Paul Task 4", status: "completed" },
        ],
      },
    ],
  },
  {
    id: "2",
    task_owner: "Nicho",
    approvers: ["3", "5"],
    taskGroups: [
      {
        group_name: "API",
        tasks: [
          { id: "5", task_title: "Nicho Task 1", status: "completed" },
          { id: "6", task_title: "Nicho Task 2", status: "completed" },
        ],
      },
    ],
  },
  {
    id: "3",
    task_owner: "Mark",
    approvers: ["6"],
    taskGroups: [
      {
        group_name: "Review",
        tasks: [
          { id: "7", task_title: "Mark Task 1", status: "completed" },
          { id: "8", task_title: "Mark Task 2", status: "completed" },
          { id: "9", task_title: "Mark Task 3", status: "pending" },
        ],
      },
    ],
  },
  {
    id: "4",
    task_owner: "Anna",
    approvers: ["6", "7"],
    taskGroups: [
      {
        group_name: "Testing",
        tasks: [
          { id: "10", task_title: "Anna Task 1", status: "completed" },
          { id: "11", task_title: "Anna Task 2", status: "in-progress" },
        ],
      },
    ],
  },
  {
    id: "5",
    task_owner: "Luke",
    approvers: ["7", "8"],
    taskGroups: [
      {
        group_name: "Frontend",
        tasks: [
          { id: "12", task_title: "Luke Task 1", status: "completed" },
          { id: "13", task_title: "Luke Task 2", status: "completed" },
        ],
      },
    ],
  },
  {
    id: "6",
    task_owner: "Sophia",
    approvers: ["9"],
    taskGroups: [
      {
        group_name: "Backend",
        tasks: [
          { id: "14", task_title: "Sophia Task 1", status: "pending" },
          { id: "15", task_title: "Sophia Task 2", status: "in-progress" },
        ],
      },
    ],
  },
  {
    id: "7",
    task_owner: "James",
    approvers: ["9", "10"],
    taskGroups: [
      {
        group_name: "API",
        tasks: [
          { id: "16", task_title: "James Task 1", status: "completed" },
          { id: "17", task_title: "James Task 2", status: "completed" },
        ],
      },
    ],
  },
  {
    id: "8",
    task_owner: "Olivia",
    approvers: ["10"],
    taskGroups: [
      {
        group_name: "Review",
        tasks: [
          { id: "18", task_title: "Olivia Task 1", status: "completed" },
          { id: "19", task_title: "Olivia Task 2", status: "pending" },
        ],
      },
    ],
  },
  {
    id: "9",
    task_owner: "Emma",
    approvers: [],
    taskGroups: [
      {
        group_name: "Testing",
        tasks: [
          { id: "20", task_title: "Emma Task 1", status: "completed" },
        ],
      },
    ],
  },
  {
    id: "10",
    task_owner: "Liam",
    approvers: [],
    taskGroups: [
      {
        group_name: "Frontend",
        tasks: [
          { id: "21", task_title: "Liam Task 1", status: "in-progress" },
        ],
      },
    ],
  },
];


// Helper: status color for nodes
const getStatusColor = (tasks: Task[]): string => {
  const hasInProgress = tasks.some((t) => t.status === "in-progress");
  const hasPending = tasks.some((t) => t.status === "pending");
  const allCompleted = tasks.every((t) => t.status === "completed");

  if (hasInProgress) return "#ff9800"; // orange
  if (hasPending) return "#f44336"; // red
  if (allCompleted) return "#4caf50"; // green
  return "#9e9e9e"; // gray
};

// Dagre layout setup
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 180;
const nodeHeight = 50;

const getLayoutedNodes = (nodes: Node[], edges: Edge[], direction: "LR" | "TB" = "LR") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    node.targetPosition = (isHorizontal ? "left" : "top") as Position;
    node.sourcePosition = (isHorizontal ? "right" : "bottom") as Position;

    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
    return node;
  });
};

const FlowWithDialog: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    // Build nodes
    const builtNodes: Node[] = users.map((user) => {
      const allTasks = user.taskGroups.flatMap((g) => g.tasks);
      return {
        id: user.id,
        data: { label: user.task_owner },
        position: { x: 0, y: 0 },
        style: {
          backgroundColor: getStatusColor(allTasks),
          color: "#fff",
          padding: 10,
          borderRadius: 8,
          border: "2px solid #333",
        },
      };
    });

    // Build edges with green if all tasks for that approver are completed
    const builtEdges: Edge[] = users.flatMap((user) =>
      user.approvers.map((approverId) => {
        const approver = users.find((u) => u.id === approverId);
        if (!approver) return null;

        // Tasks related to this approver (here we consider all user's tasks for simplicity)
        const relatedTasks = user.taskGroups.flatMap((g) => g.tasks);
        const allCompleted = relatedTasks.every((t) => t.status === "completed");

        return {
          id: `e${user.id}-${approverId}`,
          source: user.id,
          target: approverId,
          animated: !allCompleted,
          style: { stroke: allCompleted ? "#4caf50" : "#888" },
        } as Edge;
      }).filter(Boolean) as Edge[]
    );

    const layoutedNodes = getLayoutedNodes(builtNodes, builtEdges, "LR");
    setNodes(layoutedNodes);
    setEdges(builtEdges);
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={(_, node) => {
            const user = users.find((u) => u.id === node.id);
            if (user) setSelectedUser(user);
          }}
          fitView
          nodesDraggable={false}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>

        {/* Task Viewer Dialog */}
        <Dialog
          open={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>{selectedUser?.task_owner} – Task Viewer</DialogTitle>
          <DialogContent>
            {selectedUser?.taskGroups.map((group) => (
              <div key={group.group_name} style={{ marginBottom: "1rem" }}>
                <h4>{group.group_name}</h4>
                <List>
                  {group.tasks.map((task) => (
                    <ListItem key={task.id}>
                      <ListItemText primary={task.task_title} />
                      <Chip
                        label={task.status}
                        color={
                          task.status === "completed"
                            ? "success"
                            : task.status === "in-progress"
                            ? "warning"
                            : "error"
                        }
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </div>
            ))}
          </DialogContent>
        </Dialog>
      </ReactFlowProvider>
    </div>
  );
};

export default FlowWithDialog;
