/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from 'react';
import { NodeEditor, ClassicPreset } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin';
import { ReactPlugin, Presets } from 'rete-react-plugin';
import type { ReactArea2D } from 'rete-react-plugin';
import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin';

// Socket definition
const socket = new ClassicPreset.Socket('socket');

// Define flow node for the dev -> push -> sleep pattern
class FlowNode extends ClassicPreset.Node {
    width = 200;
    height = 100;

    constructor(id: string, label: string) {
        super(label);
        this.id = id;

        // Add input (except for the first node)
        if (id !== 'dev') {
            this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
        }

        // Add output (except for the last node)
        if (id !== 'sleep') {
            this.addOutput('output', new ClassicPreset.Output(socket, 'Output'));
        }
    }
}

// Use any to avoid complex type issues
type Schemes = any;

const Diagram: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<NodeEditor<Schemes> | null>(null);
    const areaRef = useRef<AreaPlugin<Schemes, ReactArea2D<Schemes>> | null>(null);
    
    // State for dialogs and sidebar
    const [showConnectionDialog, setShowConnectionDialog] = useState(false);
    const [selectedConnection, setSelectedConnection] = useState<ClassicPreset.Connection<FlowNode, FlowNode> | null>(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    
    // State for drag detection
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear any existing content
        containerRef.current.innerHTML = '';

        const init = async () => {
            // Create editor
            const editor = new NodeEditor<any>();
            editorRef.current = editor;

            // Create area plugin
            const area = new AreaPlugin<any, ReactArea2D<any>>(containerRef.current!);
            areaRef.current = area;

            // Create connection plugin
            const connection = new ConnectionPlugin<any, ReactArea2D<any>>();

            // Create React plugin
            const reactPlugin = new ReactPlugin<any, ReactArea2D<any>>();

            // Create auto arrange plugin
            const arrange = new AutoArrangePlugin<any>();

            // Use plugins
            editor.use(area);
            area.use(connection);
            area.use(reactPlugin);
            area.use(arrange);

            // Configure connection presets with arrow
            connection.addPreset(ConnectionPresets.classic.setup());

            // Disable connection creation and editing but allow rendering
            connection.addPipe((context: any) => {
                // Only block user-initiated connection events, not rendering
                if (context.type === 'connectiondrop' ||
                    context.type === 'connectionstart' ||
                    context.type === 'connectionpick') {
                    return; // Block these user interaction events
                }
                return context;
            });

            // Configure React presets
            reactPlugin.addPreset(Presets.classic.setup());

            // Configure auto arrange presets
            arrange.addPreset(ArrangePresets.classic.setup());

            // Create flow nodes: dev -> push -> sleep
            const devNode = new FlowNode('dev', 'Development');
            const pushNode = new FlowNode('push', 'Push to Repo');
            const sleepNode = new FlowNode('sleep', 'Sleep/Rest');

            // Add nodes to editor
            await editor.addNode(devNode);
            await editor.addNode(pushNode);
            await editor.addNode(sleepNode);

            // Create connections for the flow
            const connection1 = new ClassicPreset.Connection(devNode, 'output', pushNode, 'input');
            const connection2 = new ClassicPreset.Connection(pushNode, 'output', sleepNode, 'input');
            
            await editor.addConnection(connection1);
            await editor.addConnection(connection2);

            // Auto arrange nodes
            await arrange.layout();

            // Debug: Log connections to ensure they're created
            console.log('Connections created:', editor.getConnections().length);
            
            // Ensure connections are rendered after layout
            setTimeout(() => {
                const connections = editor.getConnections();
                console.log('Connections after layout:', connections.length);
            }, 100);

            // Track drag state to distinguish from clicks
            let mouseDownPos: { x: number; y: number } | null = null;
            let hasMoved = false;

            // Block socket interactions at area level
            area.addPipe((context: any) => {
                // Block socket-related events to prevent connection creation
                if (context.type === 'socketpick' || 
                    context.type === 'socketdrop' ||
                    context.type === 'socketover' ||
                    context.type === 'socketout') {
                    return; // Block socket events
                }
                return context;
            });

            // Add event listeners for drag detection
            area.addPipe((context: any) => {
                if (context.type === 'pointerdown') {
                    mouseDownPos = { x: context.data.event.clientX, y: context.data.event.clientY };
                    hasMoved = false;
                    setIsDragging(false);
                }
                
                if (context.type === 'pointermove' && mouseDownPos) {
                    const currentPos = { x: context.data.event.clientX, y: context.data.event.clientY };
                    const distance = Math.sqrt(
                        Math.pow(currentPos.x - mouseDownPos.x, 2) + 
                        Math.pow(currentPos.y - mouseDownPos.y, 2)
                    );
                    
                    if (distance > 5) { // 5px threshold for drag detection
                        hasMoved = true;
                        setIsDragging(true);
                    }
                }
                
                if (context.type === 'pointerup') {
                    setTimeout(() => {
                        setIsDragging(false);
                        mouseDownPos = null;
                        hasMoved = false;
                    }, 50); // Small delay to ensure click events are processed
                }

                // Handle node selection (only if not dragging)
                if (context.type === 'nodepicked' && !hasMoved) {
                    setTimeout(() => {
                        if (!isDragging) {
                            const nodeId = context.data.id;
                            const node = editor.getNode(nodeId);
                            if (node instanceof FlowNode) {
                                setSelectedNode(node);
                                setShowSidebar(true);
                            }
                        }
                    }, 100);
                }

                return context;
            });

            // Add connection click handling via DOM events
            const handleConnectionClick = (event: Event) => {
                const target = event.target as HTMLElement;

                // Check if the click is specifically on a connection path
                if (target && target.tagName === 'path' && target.closest('.rete-connection')) {
                    event.stopPropagation();
                    event.preventDefault();
                    
                    // Try to identify which connection was clicked
                    const connections = editor.getConnections();
                    
                    if (connections.length > 0) {
                        // For now, we'll show the first connection, but in a real app
                        // you could identify the specific connection by examining the DOM structure
                        let selectedConn = connections[0];
                        
                        // Try to determine which connection based on position or other attributes
                        if (connections.length > 1) {
                            // Simple heuristic: check if click is in the right half of the screen
                            const rect = (event.target as HTMLElement).getBoundingClientRect();
                            const containerRect = containerRef.current?.getBoundingClientRect();
                            if (containerRect && rect.x > containerRect.x + containerRect.width / 2) {
                                selectedConn = connections[connections.length - 1]; // Last connection
                            }
                        }
                        
                        setSelectedConnection(selectedConn);
                        setShowConnectionDialog(true);
                    }
                }
            };

            setTimeout(() => {
                const container = containerRef.current;
                if (container) {
                    container.addEventListener('click', handleConnectionClick, true);
                    
                    // Prevent connection line dragging
                    container.addEventListener('mousedown', (e) => {
                        const target = e.target as HTMLElement;
                        if (target && target.tagName === 'path' && target.closest('.rete-connection')) {
                            e.stopPropagation();
                        }
                    }, true);

                    // Block all socket interactions at DOM level
                    container.addEventListener('mousedown', (e) => {
                        const target = e.target as HTMLElement;
                        if (target && (target.classList.contains('rete-socket') || target.closest('.rete-socket'))) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                        }
                    }, true);

                    container.addEventListener('dragstart', (e) => {
                        const target = e.target as HTMLElement;
                        if (target && (target.classList.contains('rete-socket') || target.closest('.rete-socket'))) {
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }
                    }, true);

                    container.addEventListener('drag', (e) => {
                        const target = e.target as HTMLElement;
                        if (target && (target.classList.contains('rete-socket') || target.closest('.rete-socket'))) {
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }
                    }, true);
                }
            }, 500);

            // Fit view to content with some padding
            setTimeout(() => {
                AreaExtensions.zoomAt(area, editor.getNodes());
            }, 100);
        };

        init().catch(console.error);

        // Cleanup function
        return () => {
            if (editorRef.current) {
                editorRef.current.clear();
                editorRef.current = null;
            }
        };
    }, [isDragging]);

    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };

    const closeConnectionDialog = () => {
        setShowConnectionDialog(false);
        setSelectedConnection(null);
    };

    const closeSidebar = () => {
        setShowSidebar(false);
        setSelectedNode(null);
    };

    const switchTab = (event: React.MouseEvent, tabName: string) => {
        // Remove active class from all tab buttons
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => button.classList.remove('active'));
        
        // Add active class to clicked button
        (event.target as HTMLElement).classList.add('active');
        
        // Hide all tab panels
        const tabPanels = document.querySelectorAll('.tab-panel');
        tabPanels.forEach(panel => panel.classList.remove('active'));
        
        // Show selected tab panel
        const selectedPanel = document.getElementById(tabName);
        if (selectedPanel) {
            selectedPanel.classList.add('active');
        }
    };

    const getConnectionData = (connection: ClassicPreset.Connection<FlowNode, FlowNode>) => {
        if (!connection) return { basic: [], advanced: [], flow: [] };

        const sourceNode = editorRef.current?.getNode(connection.source);
        const targetNode = editorRef.current?.getNode(connection.target);

        const basic = [
            { property: 'Connection ID', value: connection.id },
            { property: 'Source Node', value: sourceNode?.label || 'Unknown' },
            { property: 'Target Node', value: targetNode?.label || 'Unknown' },
            { property: 'Connection Type', value: 'Flow Connection' },
            { property: 'Status', value: 'Active' }
        ];

        const advanced = [
            { property: 'Source Output Port', value: connection.sourceOutput },
            { property: 'Target Input Port', value: connection.targetInput },
            { property: 'Data Transfer Rate', value: '1.2 MB/s' },
            { property: 'Latency', value: '15ms' },
            { property: 'Protocol', value: 'HTTP/2' },
            { property: 'Encryption', value: 'TLS 1.3' },
            { property: 'Compression', value: 'gzip' },
            { property: 'Timeout', value: '30s' }
        ];

        const flow = [
            { property: 'Created', value: new Date().toLocaleDateString() },
            { property: 'Last Modified', value: new Date().toLocaleDateString() },
            { property: 'Total Data Transferred', value: '45.7 GB' },
            { property: 'Success Rate', value: '99.8%' },
            { property: 'Error Count', value: '12' },
            { property: 'Last Error', value: 'Connection timeout (2 hours ago)' },
            { property: 'Average Response Time', value: '120ms' },
            { property: 'Peak Throughput', value: '5.2 MB/s' }
        ];

        return { basic, advanced, flow };
    };

    const getNodeData = (node: FlowNode) => {
        if (!node) return [];

        return [
            { property: 'Node ID', value: node.id },
            { property: 'Node Label', value: node.label },
            { property: 'Node Type', value: 'Flow Node' },
            { property: 'Width', value: `${node.width}px` },
            { property: 'Height', value: `${node.height}px` },
            { property: 'Inputs', value: Object.keys(node.inputs).length.toString() },
            { property: 'Outputs', value: Object.keys(node.outputs).length.toString() },
            { property: 'Status', value: 'Active' },
            { property: 'Created', value: new Date().toLocaleDateString() },
            { property: 'Last Modified', value: new Date().toLocaleDateString() }
        ];
    };

    return (
        <>
            <style>{`
                /* Connection line styles - ensure visibility */
                .rete-connection {
                    cursor: pointer;
                    pointer-events: all !important;
                    transition: all 0.3s ease;
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                }

                .rete-connection path {
                    stroke: #4a90e2 !important;
                    stroke-width: 3px !important;
                    fill: none !important;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    pointer-events: all !important;
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                }

                /* Ensure SVG elements are visible */
                .rete-connection svg {
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                }

                .rete-connection:hover path {
                    stroke-width: 6px !important;
                    filter: drop-shadow(0 0 8px rgba(74, 144, 226, 0.8));
                    stroke: #2563eb !important;
                    animation: connectionPulse 1.2s infinite;
                }

                @keyframes connectionPulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.8; }
                    100% { opacity: 1; }
                }

                /* Node styles - draggable and clickable */
                .rete-node {
                    pointer-events: all !important;
                    cursor: move !important;
                    transition: all 0.3s ease;
                }

                .rete-node:hover {
                    transform: scale(1.02);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }

                /* Completely disable socket interactions to prevent connection editing */
                .rete-socket {
                    pointer-events: none !important;
                    cursor: default !important;
                    user-select: none !important;
                    -webkit-user-drag: none !important;
                    -moz-user-select: none !important;
                    -ms-user-select: none !important;
                    draggable: false !important;
                }

                .rete-input,
                .rete-output {
                    pointer-events: none !important;
                    user-select: none !important;
                    -webkit-user-drag: none !important;
                }

                .rete-input *,
                .rete-output * {
                    pointer-events: none !important;
                    user-select: none !important;
                    -webkit-user-drag: none !important;
                }

                /* Disable socket hover effects */
                .rete-socket:hover {
                    pointer-events: none !important;
                    cursor: default !important;
                }

                /* Disable connection creation UI but keep existing connections visible */
                .rete-connection-create,
                .rete-connection-drop,
                .rete-socket-picker,
                .rete-socket-drop {
                    display: none !important;
                    pointer-events: none !important;
                    visibility: hidden !important;
                }

                /* Keep existing connection elements visible */
                .rete-connection-start,
                .rete-connection-end {
                    pointer-events: none !important;
                }

                /* Override any socket interaction styles */
                .rete-socket.active,
                .rete-socket.hovered,
                .rete-socket.picked {
                    pointer-events: none !important;
                    cursor: default !important;
                }

                /* Dark theme */
                .dark-theme {
                    background: #1f2937 !important;
                }

                .dark-theme .rete-connection path {
                    stroke: #60a5fa !important;
                }

                .dark-theme .rete-connection:hover path {
                    stroke: #3b82f6 !important;
                    filter: drop-shadow(0 0 8px rgba(96, 165, 250, 0.8));
                }

                .dark-theme .rete-node {
                    background: #4b5563 !important;
                    border: 2px solid #6b7280 !important;
                    color: white !important;
                }

                .dark-theme .rete-node .title {
                    color: white !important;
                }

                /* Container styles */
                .diagram-container {
                    width: 100vw;
                    height: 100vh;
                    position: fixed;
                    top: 0;
                    left: 0;
                    margin: 0;
                    padding: 0;
                    user-select: none;
                    transition: width 0.3s ease-in-out;
                }

                .diagram-container.with-sidebar {
                    width: calc(100vw - 350px);
                }

                /* Theme toggle */
                .theme-toggle {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 60px;
                    height: 32px;
                    border: none;
                    border-radius: 16px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 4px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    z-index: 200;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .theme-toggle.with-sidebar {
                    right: 370px;
                }

                .theme-toggle:hover {
                    transform: scale(1.05);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                }

                .theme-toggle.dark {
                    background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%);
                }

                .theme-icon {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }

                .theme-toggle.dark .theme-icon {
                    transform: translateX(28px);
                    background: #1f2937;
                    color: #fbbf24;
                }

                .theme-toggle:not(.dark) .theme-icon {
                    transform: translateX(0);
                    color: #f59e0b;
                }

                /* Logout button */
                .logout-button {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    width: 40px;
                    height: 40px;
                    border: none;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.9);
                    color: #374151;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    z-index: 200;
                    transition: all 0.3s ease;
                }

                .logout-button:hover {
                    background: rgba(255, 255, 255, 1);
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
                }

                .dark-theme .logout-button {
                    background: rgba(55, 65, 81, 0.9);
                    color: #d1d5db;
                }

                .dark-theme .logout-button:hover {
                    background: rgba(55, 65, 81, 1);
                }

                /* Sidebar styles */
                .sidebar {
                    position: fixed;
                    top: 0;
                    right: 0;
                    width: 350px;
                    height: 100vh;
                    background: white;
                    box-shadow: -2px 0 10px rgba(0,0,0,0.1);
                    transform: translateX(100%);
                    transition: transform 0.3s ease-in-out;
                    z-index: 1000;
                    padding: 20px;
                    overflow-y: auto;
                }

                .sidebar.open {
                    transform: translateX(0);
                }

                .sidebar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .close-btn {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #6b7280;
                }

                .close-btn:hover {
                    color: #374151;
                }

                .dark-theme .sidebar {
                    background: #374151;
                    color: white;
                }

                .dark-theme .sidebar-header {
                    border-bottom-color: #4b5563;
                }

                .dark-theme .close-btn {
                    color: #d1d5db;
                }

                .dark-theme .close-btn:hover {
                    color: white;
                }

                /* Connection Dialog */
                .connection-dialog-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(4px);
                }

                .connection-dialog {
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    animation: dialogSlideIn 0.3s ease-out;
                }

                .connection-dialog.enhanced {
                    max-width: 700px;
                    padding: 28px;
                }

                .dark-theme .connection-dialog {
                    background: #374151;
                    color: white;
                }

                @keyframes dialogSlideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                .dialog-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 12px;
                    border-bottom: 2px solid #e5e7eb;
                }

                .dark-theme .dialog-header {
                    border-bottom-color: #4b5563;
                }

                .dialog-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #6b7280;
                    padding: 4px;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                }

                .dialog-close:hover {
                    background: #f3f4f6;
                    color: #374151;
                }

                .dark-theme .dialog-close {
                    color: #d1d5db;
                }

                .dark-theme .dialog-close:hover {
                    background: #4b5563;
                    color: white;
                }

                .connection-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 16px;
                }

                .connection-table th,
                .connection-table td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #e5e7eb;
                }

                .connection-table th {
                    background: #f9fafb;
                    font-weight: 600;
                    color: #374151;
                }

                .dark-theme .connection-table th {
                    background: #4b5563;
                    color: #e5e7eb;
                }

                .dark-theme .connection-table th,
                .dark-theme .connection-table td {
                    border-bottom-color: #4b5563;
                }

                .connection-table tr:hover {
                    background: #f9fafb;
                }

                .dark-theme .connection-table tr:hover {
                    background: #4b5563;
                }

                /* Connection Dialog Tabs */
                .connection-tabs {
                    margin-top: 20px;
                }

                .tab-buttons {
                    display: flex;
                    border-bottom: 2px solid #e5e7eb;
                    margin-bottom: 20px;
                }

                .dark-theme .tab-buttons {
                    border-bottom-color: #4b5563;
                }

                .tab-button {
                    background: none;
                    border: none;
                    padding: 12px 20px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    color: #6b7280;
                    border-bottom: 2px solid transparent;
                    transition: all 0.2s ease;
                }

                .tab-button:hover {
                    color: #374151;
                    background: #f9fafb;
                }

                .tab-button.active {
                    color: #2563eb;
                    border-bottom-color: #2563eb;
                }

                .dark-theme .tab-button {
                    color: #9ca3af;
                }

                .dark-theme .tab-button:hover {
                    color: #d1d5db;
                    background: #4b5563;
                }

                .dark-theme .tab-button.active {
                    color: #60a5fa;
                    border-bottom-color: #60a5fa;
                }

                .tab-panel {
                    display: none;
                }

                .tab-panel.active {
                    display: block;
                    animation: fadeIn 0.3s ease-in;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div
                ref={containerRef}
                className={`diagram-container ${showSidebar ? 'with-sidebar' : ''} ${isDarkTheme ? 'dark-theme' : ''}`}
                style={{
                    background: isDarkTheme ? '#1f2937' : '#f8f9fa',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            />

            <button
                className={`theme-toggle ${showSidebar ? 'with-sidebar' : ''} ${isDarkTheme ? 'dark' : ''}`}
                onClick={toggleTheme}
                title={isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
                <div className="theme-icon">
                    {isDarkTheme ? '☀️' : '🌙'}
                </div>
            </button>

            <button
                className="logout-button"
                onClick={() => window.location.href = '/login'}
                title="Logout"
            >
                ←
            </button>

            {/* Sidebar for Node Details */}
            <div className={`sidebar ${showSidebar ? 'open' : ''} ${isDarkTheme ? 'dark-theme' : ''}`}>
                <div className="sidebar-header">
                    <h3 style={{ margin: 0, color: isDarkTheme ? '#e5e7eb' : '#1f2937' }}>Node Details</h3>
                    <button className="close-btn" onClick={closeSidebar}>
                        ×
                    </button>
                </div>
                {selectedNode && (
                    <div>
                        <h4 style={{
                            color: isDarkTheme ? '#e5e7eb' : '#374151',
                            marginBottom: '20px',
                            fontSize: '18px'
                        }}>
                            {selectedNode.label}
                        </h4>
                        
                        <table className="connection-table">
                            <tbody>
                                {getNodeData(selectedNode).map((row, index) => (
                                    <tr key={index}>
                                        <td style={{ fontWeight: '500', width: '40%' }}>{row.property}</td>
                                        <td>{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div style={{
                            marginTop: '20px',
                            padding: '16px',
                            background: isDarkTheme ? '#4b5563' : '#f3f4f6',
                            borderRadius: '8px'
                        }}>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Description</h4>
                            <p style={{
                                margin: 0,
                                fontSize: '14px',
                                color: isDarkTheme ? '#d1d5db' : '#6b7280',
                                lineHeight: '1.5'
                            }}>
                                {selectedNode.id === 'dev' && 'Development phase where code is written and tested. This is the starting point of the workflow.'}
                                {selectedNode.id === 'push' && 'Push changes to the repository for version control. Code is committed and pushed to the remote repository.'}
                                {selectedNode.id === 'sleep' && 'Rest period after completing the workflow. Time to relax and prepare for the next cycle.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Enhanced Connection Dialog Modal */}
            {showConnectionDialog && selectedConnection && (
                <div className="connection-dialog-overlay" onClick={closeConnectionDialog}>
                    <div
                        className={`connection-dialog enhanced ${isDarkTheme ? 'dark-theme' : ''}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="dialog-header">
                            <div>
                                <h3 style={{ margin: 0, fontSize: '20px' }}>Connection Analysis</h3>
                                <p style={{ 
                                    margin: '4px 0 0 0', 
                                    fontSize: '14px', 
                                    color: isDarkTheme ? '#9ca3af' : '#6b7280' 
                                }}>
                                    {(() => {
                                        const sourceNode = editorRef.current?.getNode(selectedConnection.source);
                                        const targetNode = editorRef.current?.getNode(selectedConnection.target);
                                        return `${sourceNode?.label || 'Unknown'} → ${targetNode?.label || 'Unknown'}`;
                                    })()}
                                </p>
                            </div>
                            <button className="dialog-close" onClick={closeConnectionDialog}>
                                ×
                            </button>
                        </div>

                        <div className="connection-tabs">
                            <div className="tab-buttons">
                                <button 
                                    className="tab-button active" 
                                    onClick={(e) => switchTab(e, 'basic')}
                                >
                                    Basic Info
                                </button>
                                <button 
                                    className="tab-button" 
                                    onClick={(e) => switchTab(e, 'advanced')}
                                >
                                    Advanced
                                </button>
                                <button 
                                    className="tab-button" 
                                    onClick={(e) => switchTab(e, 'metrics')}
                                >
                                    Metrics
                                </button>
                            </div>

                            <div className="tab-content">
                                <div className="tab-panel active" id="basic">
                                    <table className="connection-table">
                                        <tbody>
                                            {getConnectionData(selectedConnection).basic.map((row, index) => (
                                                <tr key={index}>
                                                    <td style={{ fontWeight: '500', width: '40%' }}>{row.property}</td>
                                                    <td>{row.value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="tab-panel" id="advanced">
                                    <table className="connection-table">
                                        <tbody>
                                            {getConnectionData(selectedConnection).advanced.map((row, index) => (
                                                <tr key={index}>
                                                    <td style={{ fontWeight: '500', width: '40%' }}>{row.property}</td>
                                                    <td>{row.value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="tab-panel" id="metrics">
                                    <table className="connection-table">
                                        <tbody>
                                            {getConnectionData(selectedConnection).flow.map((row, index) => (
                                                <tr key={index}>
                                                    <td style={{ fontWeight: '500', width: '40%' }}>{row.property}</td>
                                                    <td>{row.value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="connection-status" style={{
                            marginTop: '20px',
                            padding: '16px',
                            background: isDarkTheme ? '#065f46' : '#d1fae5',
                            borderRadius: '8px',
                            border: `1px solid ${isDarkTheme ? '#047857' : '#10b981'}`
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: '#10b981',
                                    animation: 'pulse 2s infinite'
                                }}></div>
                                <span style={{ 
                                    fontWeight: '500', 
                                    color: isDarkTheme ? '#34d399' : '#047857' 
                                }}>
                                    Connection Active
                                </span>
                            </div>
                            <p style={{
                                margin: '8px 0 0 16px',
                                fontSize: '14px',
                                color: isDarkTheme ? '#a7f3d0' : '#065f46'
                            }}>
                                Data is flowing normally between nodes. Last health check: 2 minutes ago.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Diagram;