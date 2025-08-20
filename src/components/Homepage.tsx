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
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Nav from './Nav';

const HomePage: React.FC = () => {
    const [openDialog, setOpenDialog] = React.useState(false);
    const [projectTitle, setProjectTitle] = React.useState('');
    const [projectDescription, setProjectDescription] = React.useState('');

    // Static project list
    const projects = [
        { id: 1, title: 'Sample Project 1', description: 'Flownity development.' },
    ];

    const [dueFrom, setDueFrom] = React.useState('');
    const [dueTo, setDueTo] = React.useState('');


    // Static overdue tasks
    const Tasks = [
        { id: 1, task: 'Finish UI for Project 1', dueDate: '2025-08-15' },
        { id: 2, task: 'Prepare debate material', dueDate: '2025-08-17' },
    ];

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const handleCreateProject = () => {
        console.log('New Project:', { projectTitle, projectDescription });
        // TODO: integrate with backend or state management
        handleCloseDialog();
        setProjectTitle('');
        setProjectDescription('');
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
                                    Start a new debate or visual discussion
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
                                        >
                                            Open
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Overdue Tasks List */}
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
                                            <Button size="small" variant="outlined" color="error">
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

                {/* Dialog Form */}
                <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
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
            </Container>
        </>
    );
};

export default HomePage;
