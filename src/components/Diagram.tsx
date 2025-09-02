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
  task_group_id?: string;
}

interface TaskGroup {
  id: string;
  group_name: string;
  tasks: Task[];
}

interface User {
  id: string;
  task_owner: string;
  taskGroups: TaskGroup[];
  ungroupedTasks?: Task[];
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

const getLayoutedNodes = (nodes: Node[], edges: Edge[], direction: "LR" | "TB" = "TB") => {
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

// Mock API
const fetchUsers = (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data: User[] = [
        {
          id: "1",
          task_owner: "Paul",
          taskGroups: [
            {
              id: "1",
              group_name: "Frontend",
              tasks: [
                { id: "1", task_title: "Paul Task 1", status: "done", approver_id: "9", task_group_id: "1" },
                { id: "2", task_title: "Paul Task 2", status: "in-progress", approver_id: "4", task_group_id: "1" },
                { id: "3", task_title: "Paul Task 3", status: "in-review", approver_id: "5", task_group_id: "1" },
              ],
            },
            {
              id: "2",
              group_name: "Backend",
              tasks: [
                { id: "4", task_title: "Paul Task 4", status: "blocked", approver_id: "9", task_group_id: "2" },
                { id: "5", task_title: "Paul Task 5", status: "on-hold", approver_id: "4", task_group_id: "2" },
              ],
            },
          ],
          ungroupedTasks: [{ id: "6", task_title: "Paul Ungrouped Task", status: "backlog", approver_id: "4" }],
        },
        {
          id: "4",
          task_owner: "John",
          taskGroups: [
            {
              id: "3",
              group_name: "DevOps",
              tasks: [
                { id: "7", task_title: "John Task 1", status: "in-progress", approver_id: "1", task_group_id: "3" },
                { id: "8", task_title: "John Task 2", status: "todo", approver_id: "9", task_group_id: "3" },
              ],
            },
          ],
          ungroupedTasks: [{ id: "9", task_title: "John Ungrouped Task", status: "on-hold", approver_id: "5" }],
        },
        {
          id: "5",
          task_owner: "Sophia",
          taskGroups: [
            {
              id: "4",
              group_name: "Mobile",
              tasks: [
                { id: "10", task_title: "Sophia Task 1", status: "in-review", approver_id: "1", task_group_id: "4" },
                { id: "11", task_title: "Sophia Task 2", status: "blocked", approver_id: "4", task_group_id: "4" },
                { id: "12", task_title: "Sophia Task 3", status: "done", approver_id: "9", task_group_id: "4" },
              ],
            },
          ],
          ungroupedTasks: [{ id: "13", task_title: "Sophia Ungrouped Task", status: "todo", approver_id: "1" }],
        },
        {
          id: "9",
          task_owner: "Emma",
          taskGroups: [
            {
              id: "5",
              group_name: "Testing",
              tasks: [
                { id: "14", task_title: "Emma Task 1", status: "done", approver_id: "4", task_group_id: "5" },
                { id: "15", task_title: "Emma Task 2", status: "in-review", approver_id: "1", task_group_id: "5" },
              ],
            },
            {
              id: "6",
              group_name: "QA",
              tasks: [
                { id: "16", task_title: "Emma Task 3", status: "blocked", approver_id: "4", task_group_id: "6" },
                { id: "17", task_title: "Emma Task 4", status: "cancelled", approver_id: "5", task_group_id: "6" },
              ],
            },
          ],
          ungroupedTasks: [
            { id: "18", task_title: "Emma Ungrouped Task", status: "todo", approver_id: "4" },
            { id: "19", task_title: "Emma Ungrouped Task 2", status: "closed", approver_id: "1" },
          ],
        },
        {
          id: "7",
          task_owner: "Liam",
          taskGroups: [
            {
              id: "7",
              group_name: "Design",
              tasks: [
                { id: "20", task_title: "Liam Task 1", status: "done", approver_id: "9", task_group_id: "7" },
                { id: "21", task_title: "Liam Task 2", status: "done", approver_id: "5", task_group_id: "7" },
              ],
            },
          ],
          ungroupedTasks: [{ id: "22", task_title: "Liam Ungrouped Task", status: "done", approver_id: "1" }],
        },
      ];

      // Ensure approver_id exists for all tasks
      data.forEach((user) => {
        user.taskGroups.forEach((group) => {
          group.tasks.forEach((task) => {
            if (!task.approver_id) task.approver_id = null;
          });
        });

        if (user.ungroupedTasks) {
          user.ungroupedTasks.forEach((task) => {
            if (!task.approver_id) task.approver_id = null;
          });
        }
      });

      resolve(data);
    }, 800);
  });
};

const FlowWithDialog: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    fetchUsers().then((data) => {
      setUsers(data);

      // Build nodes
      const builtNodes: Node[] = data.map((user) => {
        const allTasks = [...user.taskGroups.flatMap((g) => g.tasks), ...(user.ungroupedTasks || [])];
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

      // Build edges
      const builtEdges: Edge[] = data.flatMap((user) => {
        const allTasks = [...user.taskGroups.flatMap((g) => g.tasks), ...(user.ungroupedTasks || [])];

        return allTasks
          .filter((task) => task.approver_id)
          .map((task) => ({
            id: `e${task.id}-${task.approver_id}`,
            source: user.id,
            target: task.approver_id!,
            animated: task.status !== "done",
            arrowHeadType: "arrowclosed",
            style: {
              stroke: task.status === "done" ? "#4caf50" : STATUS_COLORS[task.status],
              strokeWidth: 2,
              strokeDasharray: task.status === "done" ? 0 : 6,
            },
          }));
      });

      const layoutedNodes = getLayoutedNodes(builtNodes, builtEdges, "TB");
      setNodes(layoutedNodes);
      setEdges(builtEdges);
    });
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

        {/* Legend */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            backgroundColor: "transparent",
            padding: 0,
            borderRadius: 0,
            boxShadow: "none",
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
          }}
        >
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

        {/* Task Viewer Dialog */}
        <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} fullWidth maxWidth="sm">
          <DialogTitle>{selectedUser?.task_owner} – Task Viewer</DialogTitle>
          <DialogContent>
            {selectedUser?.taskGroups.map((group) => (
              <div key={group.group_name} style={{ marginBottom: "1rem" }}>
                <h4>{group.group_name}</h4>
                <List>
                  {group.tasks.map((task) => {
                    const approver = users.find((u) => u.id === task.approver_id);
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
                    const approver = users.find((u) => u.id === task.approver_id);
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
          </DialogContent>
        </Dialog>
      </ReactFlowProvider>
    </div>
  );
};

export default FlowWithDialog;
