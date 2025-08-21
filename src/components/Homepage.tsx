import * as React from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    List,
    ListItem,
    ListItemText,
    Divider,
    Slide,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Nav from './Nav';
import { useNavigate } from 'react-router-dom';
import type { TransitionProps } from "@mui/material/transitions";

// Slide for Create Project (existing)
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="right" ref={ref} {...props} />;
});

// Slide from left (for Open Project and Task dialogs)
const SlideLeft = React.forwardRef(function SlideLeft(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="right" ref={ref} {...props} />; // slides in from left
});

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const [openDialog, setOpenDialog] = React.useState(false);
    const [projectTitle, setProjectTitle] = React.useState('');
    const [projectDescription, setProjectDescription] = React.useState('');

    // Project dialog states
    const [openProjectDialog, setOpenProjectDialog] = React.useState(false);
    const [selectedProject, setSelectedProject] = React.useState<null | { id: number; title: string; description: string }>(null);

    // Task dialog states
    const [openTaskDialog, setOpenTaskDialog] = React.useState(false);
    const [selectedTask, setSelectedTask] = React.useState<null | { id: number; task: string; dueDate: string }>(null);

    // Static project list
    const projects = [
        { id: 1, title: 'Sample Project 1', description: 'Flownity development.' },
    ];

    const [dueFrom, setDueFrom] = React.useState('');
    const [dueTo, setDueTo] = React.useState('');

    // Static tasks
    const Tasks = [
        { id: 1, task: 'Finish UI for Project 1', dueDate: '2025-08-15' },
        { id: 2, task: 'Prepare debate material', dueDate: '2025-08-17' },
    ];

    // Create Project handlers
    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);
    const handleCreateProject = () => {
        console.log('New Project:', { projectTitle, projectDescription });
        handleCloseDialog();
        setProjectTitle('');
        setProjectDescription('');
    };

    // Project handlers
    const handleOpenProject = (project: { id: number; title: string; description: string }) => {
        setSelectedProject(project);
        setOpenProjectDialog(true);
    };
    const handleCloseProjectDialog = () => {
        setSelectedProject(null);
        setOpenProjectDialog(false);
    };
    const handleOpenWorkspace = () => {
        if (selectedProject) navigate(`/workspace/${selectedProject.id}`);
    };

    // Task handlers
    const handleOpenTask = (task: { id: number; task: string; dueDate: string }) => {
        setSelectedTask(task);
        setOpenTaskDialog(true);
    };
    const handleCloseTaskDialog = () => {
        setSelectedTask(null);
        setOpenTaskDialog(false);
    };

    return (
        <>
            <Nav />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                {/* Project List */}
                <Box mb={8}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                        Your Projects
                    </Typography>

                    <Grid container spacing={4}>
                        {/* Create Project Card */}
                        <Grid size={4}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    minHeight: 180,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: '#f5f5f5',
                                }}
                                onClick={handleOpenDialog}
                            >
                                <Typography variant="h6" gutterBottom>
                                    + Create Project
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Start a new project
                                </Typography>
                            </Paper>
                        </Grid>

                        {/* Existing Projects */}
                        {projects.map((project) => (
                            <Grid size={4} key={project.id}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        p: 3,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        minHeight: 180,
                                    }}
                                >
                                    <Box>
                                        <Typography variant="h6" gutterBottom>
                                            {project.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {project.description}
                                        </Typography>
                                    </Box>
                                    <Box mt={2} sx={{ textAlign: 'right' }}>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleOpenProject(project)}
                                        >
                                            Open
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Tasks List */}
                <Box mb={8}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                        Tasks
                    </Typography>

                    <Paper elevation={2}>
                        <List>
                            {Tasks.map((task, index) => (
                                <React.Fragment key={task.id}>
                                    <ListItem
                                        secondaryAction={
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleOpenTask(task)}
                                            >
                                                View
                                            </Button>
                                        }
                                    >
                                        <ListItemText
                                            primary={task.task}
                                            secondary={`Task: ${task.dueDate}`}
                                        />
                                    </ListItem>
                                    {index < Tasks.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Box>

                {/* Create Project Dialog */}
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    fullWidth
                    maxWidth="sm"
                    TransitionComponent={Transition}
                >
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogContent dividers>
                        <TextField
                            label="Project Title"
                            fullWidth
                            margin="normal"
                            value={projectTitle}
                            onChange={(e) => setProjectTitle(e.target.value)}
                        />
                        <TextField
                            label="Project Description"
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                        />
                        <TextField
                            label="Due From"
                            type="date"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            value={dueFrom}
                            onChange={(e) => setDueFrom(e.target.value)}
                        />
                        <TextField
                            label="Due To"
                            type="date"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            value={dueTo}
                            onChange={(e) => setDueTo(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button variant="contained" onClick={handleCreateProject}>Create</Button>
                    </DialogActions>
                </Dialog>

                {/* Open Project Dialog */}
                <Dialog
                    open={openProjectDialog}
                    onClose={handleCloseProjectDialog}
                    fullWidth
                    maxWidth="sm"
                    TransitionComponent={SlideLeft}
                    keepMounted
                >
                    <DialogTitle>{selectedProject?.title}</DialogTitle>
                    <DialogContent dividers>
                        <Typography variant="body1" gutterBottom>
                            {selectedProject?.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            More details about the project can be shown here.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseProjectDialog} color="secondary">
                            Close
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleOpenWorkspace}>
                            Open in Workspace
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Task Dialog */}
                <Dialog
                    open={openTaskDialog}
                    onClose={handleCloseTaskDialog}
                    fullWidth
                    maxWidth="sm"
                    TransitionComponent={SlideLeft}
                    keepMounted
                >
                    <DialogTitle>{selectedTask?.task}</DialogTitle>
                    <DialogContent dividers>
                        <Typography variant="body1" gutterBottom>
                            Due Date: {selectedTask?.dueDate}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Additional task details can be shown here.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseTaskDialog} color="secondary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
};

export default HomePage;
