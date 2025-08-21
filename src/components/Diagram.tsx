import React, { useState, useEffect } from "react";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    ReactFlowProvider,
} from "reactflow";
import type { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Paper,
    Typography,
    Chip,
    Box,
    Divider,
    IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dagre from "dagre";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from '../theme/ThemeProvider';
import { useTheme as useMuiTheme } from '@mui/material/styles';

type Task = { id: string; label: string; status: string };
type User = { id: string; label: string; tasks: Task[]; approver?: string };

const users: User[] = [
    {
        id: "paul",
        label: "Paul",
        approver: "mark",
        tasks: [
            { id: "paul-task-1", label: "Paul Task 1", status: "completed" },
            { id: "paul-task-2", label: "Paul Task 2", status: "completed" },
            { id: "paul-task-3", label: "Paul Task 3", status: "completed" },
        ],
    },
    {
        id: "nicho",
        label: "Nicho",
        approver: "mark",
        tasks: [
            { id: "nicho-task-1", label: "Nicho Task 1", status: "completed" },
            { id: "nicho-task-2", label: "Nicho Task 2", status: "in-progress" },
        ],
    },
    {
        id: "mark",
        label: "Mark (Approver)",
        tasks: [
            { id: "mark-task-1", label: "Mark Task 1", status: "completed" },
            { id: "mark-task-2", label: "Mark Task 2", status: "completed" },
            { id: "mark-task-3", label: "Mark Task 3", status: "pending" },
        ],
    },
];

// Dagre layout
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    dagreGraph.setGraph({ rankdir: "TB" });
    nodes.forEach((node) =>
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
    );
    edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));
    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };
        return node;
    });

    return { nodes: layoutedNodes, edges };
};

const Diagram: React.FC = () => {
    const { mode, toggleTheme } = useTheme();
    const muiTheme = useMuiTheme();
    const [openUser, setOpenUser] = useState<User | null>(null);
    const [layoutedNodes, setLayoutedNodes] = useState<Node[]>([]);
    const [layoutedEdges, setLayoutedEdges] = useState<Edge[]>([]);
    const darkMode = mode === 'dark';

    useEffect(() => {
        const nodes: Node[] = users.map((user) => {
            const allCompleted = user.tasks.every((t) => t.status === "completed");
            const inProgress = user.tasks.some((t) => t.status === "in-progress");

            return {
                id: user.id,
                type: "default",
                data: { label: user.label },
                position: { x: 0, y: 0 },
                style: {
                    backgroundColor: allCompleted
                        ? muiTheme.palette.success.main
                        : inProgress
                        ? muiTheme.palette.warning.main
                        : muiTheme.palette.background.paper,
                    color: muiTheme.palette.text.primary,
                    padding: 10,
                    border: `1px solid ${muiTheme.palette.divider}`,
                    borderRadius: muiTheme.shape.borderRadius,
                },
            };
        });

        const edges: Edge[] = users
            .filter((u) => u.approver)
            .map((u) => {
                const allCompleted = u.tasks.every((t) => t.status === "completed");
                const inProgress = u.tasks.some((t) => t.status === "in-progress");

                return {
                    id: `${u.id}-to-${u.approver}`,
                    source: u.id,
                    target: u.approver!,
                    animated: inProgress,
                    style: {
                        stroke: allCompleted
                            ? muiTheme.palette.success.main
                            : inProgress
                            ? muiTheme.palette.warning.main
                            : muiTheme.palette.text.secondary,
                        strokeDasharray: inProgress ? "5,5" : undefined,
                    },
                    type: "smoothstep",
                };
            });

        const { nodes: n, edges: e } = getLayoutedElements(nodes, edges);
        setLayoutedNodes(n);
        setLayoutedEdges(e);
    }, [darkMode]);

    const handleNodeClick = (nodeId: string) => {
        const user = users.find((u) => u.id === nodeId);
        if (user) setOpenUser(user);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "success";
            case "in-progress":
                return "warning";
            case "pending":
                return "default";
            default:
                return "default";
        }
    };

    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                background: muiTheme.palette.background.default,
                transition: "background 0.3s",
            }}
        >
            <ReactFlowProvider>
            <Box position="absolute" top={10} right={10} zIndex={10} display="flex" alignItems="center">
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
        <IconButton
            onClick={toggleTheme}
            sx={{
                bgcolor: muiTheme.palette.background.paper,
                color: muiTheme.palette.text.primary,
                border: "1px solid",
                borderColor: muiTheme.palette.divider,
                "&:hover": {
                    bgcolor: muiTheme.palette.action.hover,
                },
                transition: "all 0.3s",
            }}
        >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
    </Tooltip>
</Box>

                <ReactFlow
                    nodes={layoutedNodes}
                    edges={layoutedEdges}
                    onNodeClick={(_, node) => handleNodeClick(node.id)}
                    fitView
                    nodesDraggable={false}
                    nodesConnectable={false}
                    panOnScroll={false}
                    panOnDrag={true}
                    zoomOnScroll={true}
                    zoomOnPinch={false}
                    zoomOnDoubleClick={false}
                >
                    <Background color={muiTheme.palette.divider} gap={16} />
                    <Controls />
                    <MiniMap
                        nodeColor={(node) => node.style?.backgroundColor as string}
                        maskColor={darkMode ? "#00000066" : "#ffffff66"}
                    />
                </ReactFlow>

                <Dialog
    open={!!openUser}
    onClose={() => setOpenUser(null)}
    fullWidth
    maxWidth="xs"
    PaperProps={{
        sx: {
            bgcolor: muiTheme.palette.background.paper,
            color: muiTheme.palette.text.primary,
            borderRadius: 3,
        },
    }}
>
    {/* Header with title and close button */}
    <Box display="flex" alignItems="center" justifyContent="space-between" px={2} pt={2}>
        <DialogTitle sx={{ p: 0 }}>{openUser?.label}'s Tasks</DialogTitle>
        <IconButton onClick={() => setOpenUser(null)}>
            <CloseIcon sx={{ color: muiTheme.palette.text.primary }} />
        </IconButton>
    </Box>

    <Divider sx={{ my: 1 }} />

    {/* Task list as Paper cards */}
    <DialogContent sx={{ pt: 1 }}>
        <Box display="flex" flexDirection="column" gap={2}>
            {openUser?.tasks.map((task) => (
                <Paper
                    key={task.id}
                    elevation={3}
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        bgcolor:
                            task.status === "completed"
                                ? `${muiTheme.palette.success.main}20`
                                : task.status === "in-progress"
                                ? `${muiTheme.palette.warning.main}20`
                                : `${muiTheme.palette.action.disabled}20`,
                        color: muiTheme.palette.text.primary,
                        transition: "all 0.3s",
                    }}
                >
                    <Box>
                        <Typography variant="subtitle1" fontWeight={500}>
                            {task.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </Typography>
                    </Box>
                    <Chip
                        label={task.status}
                        color={getStatusColor(task.status)}
                        size="small"
                    />
                </Paper>
            ))}
        </Box>
    </DialogContent>
</Dialog>

            </ReactFlowProvider>
        </div>
    );
};

export default Diagram;
