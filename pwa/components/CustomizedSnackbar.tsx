import { 
	Fragment, 
	SyntheticEvent, 
	forwardRef,  
} from 'react';

import { 
	Button, 
	IconButton, 
	Snackbar, 
	SnackbarOrigin, 
	Stack, 
} from "@mui/material";
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';

/**
 * open: boolean
 * severity: AlertColor [error | warning | info | success]
 * message: string
 * {vertical, horizontal}: SnackbarOrigin
 */
export default function CustomizedSnackbar(props: any) {
	const {open, severity, message, vertical, horizontal} = props.snackbarState;

	const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}
		props.handleSnackbarClose();
	};

	const action = (
		<Fragment>
			<Button color="secondary" size="small" onClick={handleClose}>
				UNDO
			</Button>
			<IconButton
				size="small"
				aria-label="close"
				color="inherit"
				onClick={handleClose}
			>
				<CloseIcon fontSize="small" />
			</IconButton>
		</Fragment>
	);

	return (
		<Stack 
			spacing={2} 
			sx={{ width: '100%' }}
		>
			<Snackbar 
				anchorOrigin={{ vertical, horizontal }}
				open={open} 
				autoHideDuration={6000} 
				onClose={handleClose}
				action={action}
			>
				<Alert onClose={handleClose} 
					severity={severity}
				>
					{message}
				</Alert>
			</Snackbar>
		</Stack>
	);
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref,
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export interface SnackbarState extends SnackbarOrigin {
	open: boolean;
	alertSeverity: AlertColor;
	message: string;
}