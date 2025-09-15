import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	useTheme,
	useMediaQuery,
} from "@mui/material";

interface DialogComponentProps {
	open: boolean;
	title: string;
	message: string;
	onConfirm: () => void;
	onClose: () => void;
	confirmText?: string;
	cancelText?: string;
}

const DialogComponent: React.FC<DialogComponentProps> = ({
	open,
	title,
	message,
	onConfirm,
	onClose,
	confirmText = "Confirm",
	cancelText = "Cancel",
}) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="xs"
			fullWidth
			fullScreen={isMobile}
			aria-labelledby="common-dialog-title"
			aria-describedby="common-dialog-message"
			sx={{
				"& .MuiDialog-paper": {
					width: isMobile ? "100%" : "350px",
					maxWidth: isMobile ? "100%" : "350px",
					margin: isMobile ? 0 : theme.spacing(2),
					borderRadius: isMobile ? 0 : 2,
				},
			}}
		>
			<DialogTitle id="common-dialog-title">{title}</DialogTitle>
			<DialogContent id="common-dialog-message">{message}</DialogContent>
			<DialogActions
				sx={{
					px: theme.spacing(3),
					pb: theme.spacing(2),
					gap: theme.spacing(1),
					flexDirection: isMobile ? "column" : "row",
				}}
			>
				<Button
					onClick={onClose}
					color="inherit"
					variant="outlined"
					fullWidth={isMobile}
				>
					{cancelText}
				</Button>
				<Button
					onClick={onConfirm}
					color="primary"
					variant="contained"
					fullWidth={isMobile}
				>
					{confirmText}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DialogComponent;
