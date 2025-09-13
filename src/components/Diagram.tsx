import React, { useState, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import dagre from "dagre";

// Types
interface Task {
  id: string;
  task_title: string;
  status:
  | "backlog"
  | "todo"
  | "in-progress"
  | "in-review"
  | "blocked"
  | "on-hold"
  | "done"
  | "closed"
  | "cancelled";
  approver_id: string | null;
  task_group_id?: string | null;
}

interface TaskGroup {
  id: string;
  group_name: string;
  tasks: Task[];
}

interface ApproverTasks {
  taskGroups: TaskGroup[];
  ungroupedTasks: Task[];
}

interface User {
  id: string;
  task_owner: string;
  taskGroups: TaskGroup[];
  ungroupedTasks?: Task[];
  approverTasks: ApproverTasks;
}

// Status colors
const STATUS_COLORS: Record<string, string> = {
  backlog: "#cfcfcf",
  todo: "#90caf9",
  "in-progress": "#ffb74d",
  "in-review": "#81d4fa",
  blocked: "#e57373",
  "on-hold": "#fff176",
  done: "#81c784",
  closed: "#a1887f",
  cancelled: "#b0bec5",
};

// Get node color based on tasks
const getStatusColor = (tasks: Task[]): string => {
  if (tasks.some((t) => t.status === "blocked")) return STATUS_COLORS["blocked"];
  if (tasks.some((t) => t.status === "in-progress")) return STATUS_COLORS["in-progress"];
  if (tasks.some((t) => t.status === "in-review")) return STATUS_COLORS["in-review"];
  if (tasks.some((t) => t.status === "todo")) return STATUS_COLORS["todo"];
  if (tasks.some((t) => t.status === "backlog")) return STATUS_COLORS["backlog"];
  if (tasks.some((t) => t.status === "on-hold")) return STATUS_COLORS["on-hold"];
  if (tasks.some((t) => t.status === "cancelled")) return STATUS_COLORS["cancelled"];
  if (tasks.every((t) => t.status === "done")) return STATUS_COLORS["done"];
  if (tasks.every((t) => t.status === "closed")) return STATUS_COLORS["closed"];
  return "#cfcfcf"; // fallback
};

// Dagre layout
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 200;
const nodeHeight = 60;

const getLayoutedNodes = (
  nodes: Node[],
  edges: Edge[],
  direction: "LR" | "TB" | "RL" | "BT" = "TB"
) => {
  const isHorizontal = direction === "LR" || direction === "RL";
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

const fetchUsers = async (): Promise<User[]> => {
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    throw new Error("No auth token found in localStorage");
  }

  // Get projectId from path (last segment of the URL)
  const pathParts = window.location.pathname.split("/");
  const projectId = pathParts[pathParts.length - 1];

  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/v1/projects/project-flow/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  const json = await res.json();
  return json.data;
};


const FlowWithDialog: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [layoutDirection, setLayoutDirection] = useState<"TB" | "LR" | "BT" | "RL">("TB");

  // fetch + build nodes and edges
  useEffect(() => {
    fetchUsers().then((data) => {
      setUsers(data);

      const builtNodes: Node[] = data.map((user) => {
        const allTasks = [
          ...user.taskGroups.flatMap((g) => g.tasks),
          ...(user.ungroupedTasks || []),
          ...user.approverTasks.taskGroups.flatMap((g) => g.tasks),
          ...(user.approverTasks.ungroupedTasks || []),
        ];
        return {
          id: user.id,
          data: { label: user.task_owner },
          position: { x: 0, y: 0 },
          style: {
            backgroundColor: getStatusColor(allTasks),
            color: "#000",
            padding: 15,
            borderRadius: 5,
            border: "2px solid #555",
            fontWeight: 600,
            fontSize: "0.9rem",
            textAlign: "center",
          },
        };
      });

      const builtEdges: Edge[] = data.flatMap((user) => {
        const allTasks = [
          ...user.taskGroups.flatMap((g) => g.tasks),
          ...(user.ungroupedTasks || []),
        ];

        return allTasks
          .filter((task) => task.approver_id)
          .map((task) => ({
            id: `e${task.id}-${task.approver_id}`,
            source: user.id,
            target: task.approver_id!.toString(),
            animated: task.status !== "done",
            style: {
              stroke: task.status === "done" ? "#4caf50" : STATUS_COLORS[task.status],
              strokeWidth: 2,
              strokeDasharray: task.status === "done" ? 0 : 6,
            },
          }));
      });

      setNodes(getLayoutedNodes(builtNodes, builtEdges, layoutDirection));
      setEdges(builtEdges);
    });
  }, [layoutDirection]);

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

        {/* Layout Selector */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "white",
            padding: 1,
            borderRadius: 1,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          <FormControl size="small">
            <InputLabel id="layout-select-label">Layout</InputLabel>
            <Select
              labelId="layout-select-label"
              value={layoutDirection}
              label="Layout"
              onChange={(e) =>
                setLayoutDirection(e.target.value as "TB" | "LR" | "BT" | "RL")
              }
            >
              <MenuItem value="TB">Top-Bottom</MenuItem>
              <MenuItem value="BT">Bottom-Top</MenuItem>
              <MenuItem value="LR">Left-Right</MenuItem>
              <MenuItem value="RL">Right-Left</MenuItem>
            </Select>
          </FormControl>
        </Box>

{/* Legend + Completion bar container */}
<Box
  sx={{
    position: "absolute",
    top: 10,
    backgroundColor: "transparent",
    padding: 0,
    borderRadius: 0,
    boxShadow: "none",
    display: "flex",
    flexDirection: "column",   // 👈 stack vertically
    gap: 0.5,
  }}
>
  {/* Completion bar */}
  {(() => {
    const allTasks = users.flatMap((u) => [
      ...u.taskGroups.flatMap((g) => g.tasks),
      ...(u.ungroupedTasks || []),
      ...u.approverTasks.taskGroups.flatMap((g) => g.tasks),
      ...(u.approverTasks.ungroupedTasks || []),
    ]);
    const done = allTasks.filter((t) => t.status === "done" || t.status === "closed");
    const percent = allTasks.length
      ? Math.round((done.length / allTasks.length) * 100)
      : 0;

    return (
      <Box sx={{ width: 220 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.3 }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 600 }}>Completion</span>
          <span style={{ fontSize: "0.7rem" }}>{percent}%</span>
        </Box>
        <Box
          sx={{
            height: 6,
            borderRadius: 1,
            overflow: "hidden",
            backgroundColor: "#e0e0e0",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: `${percent}%`,
              backgroundColor:
                percent < 30 ? "#e57373" : percent < 70 ? "#ffb74d" : "#81c784",
              transition: "width 0.3s ease",
            }}
          />
        </Box>
      </Box>
    );
  })()}

  {/* Status legends */}
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
    {Object.entries(STATUS_COLORS).map(([status, color]) => (
      <Chip
        key={status}
        label={status.replace("-", " ").toUpperCase()}
        sx={{
          bgcolor: color,
          color: "#000",
          fontSize: "0.7rem",
          borderRadius: 1,
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
        size="small"
      />
    ))}
  </Box>
</Box>


        {/* Task Viewer Dialog */}
        <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} fullWidth maxWidth="sm">
          <DialogTitle>{selectedUser?.task_owner} – Task Viewer</DialogTitle>
          <DialogContent>
            {/* Own Tasks */}
            {selectedUser?.taskGroups.map((group) => (
              <div key={group.group_name} style={{ marginBottom: "1rem" }}>
                <h4>{group.group_name}</h4>
                <List>
                  {group.tasks.map((task) => {
                    const approver = users.find((u) => u.id === task.approver_id?.toString());
                    return (
                      <ListItem key={task.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                        <ListItemText
                          primary={task.task_title}
                          secondary={approver ? `Approver: ${approver.task_owner}` : "No approver"}
                        />
                        <Chip
                          label={task.status.replace("-", " ")}
                          sx={{ bgcolor: STATUS_COLORS[task.status], color: "#000" }}
                          size="small"
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </div>
            ))}

            {selectedUser?.ungroupedTasks?.length ? (
              <div style={{ marginBottom: "1rem" }}>
                <h4>Ungrouped</h4>
                <List>
                  {selectedUser.ungroupedTasks.map((task) => {
                    const approver = users.find((u) => u.id === task.approver_id?.toString());
                    return (
                      <ListItem key={task.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                        <ListItemText
                          primary={task.task_title}
                          secondary={approver ? `Approver: ${approver.task_owner}` : "No approver"}
                        />
                        <Chip
                          label={task.status.replace("-", " ")}
                          sx={{ bgcolor: STATUS_COLORS[task.status], color: "#000" }}
                          size="small"
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </div>
            ) : null}

            {/* Approver Tasks */}
            {selectedUser?.approverTasks.taskGroups.map((group) => (
              <div key={group.group_name} style={{ marginBottom: "1rem" }}>
                <h4>Approver – {group.group_name}</h4>
                <List>
                  {group.tasks.map((task) => (
                    <ListItem key={task.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                      <ListItemText primary={task.task_title} secondary="As Approver" />
                      <Chip
                        label={task.status.replace("-", " ")}
                        sx={{ bgcolor: STATUS_COLORS[task.status], color: "#000" }}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </div>
            ))}

            {selectedUser?.approverTasks.ungroupedTasks.length ? (
              <div style={{ marginBottom: "1rem" }}>
                <h4>Approver – Ungrouped</h4>
                <List>
                  {selectedUser.approverTasks.ungroupedTasks.map((task) => (
                    <ListItem key={task.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                      <ListItemText primary={task.task_title} secondary="As Approver" />
                      <Chip
                        label={task.status.replace("-", " ")}
                        sx={{ bgcolor: STATUS_COLORS[task.status], color: "#000" }}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </ReactFlowProvider>
    </div>
  );
};

export default FlowWithDialog;
