
import React from 'react';
import { Transition } from '@headlessui/react';

/**
 * examples:
 * 	classNames('foo', 'bar'); // => 'foo bar'
 * 	classNames('foo', { bar: true }); // => 'foo bar'
 * 	classNames({ foo: true }, { bar: true }); // => 'foo bar'
 * 	classNames({ foo: true, bar: false }); // => 'foo'
 * 	classNames(null, false, 'bar', undefined, 0, 1, { baz: null }, ''); // => 'bar 1'
 */
var classNames = require('classnames');

export type AlertColor = 'success' | 'info' | 'warning' | 'error';

type VerticalType = 'top' | 'bottom';
type HorizontalType = 'left' | 'center' | 'right';

export interface SnackbarOrigin {
	vertical: VerticalType;
	horizontal: HorizontalType;
}

export interface SnackbarState extends SnackbarOrigin {
	open: boolean;
	severity: AlertColor;
	message: string;
}

interface SnackbarProps {
	snackbarState: SnackbarState, 
	handleSnackbarClose: ()=>void
}

const SnackbarCustomized = ( {snackbarState, handleSnackbarClose}: SnackbarProps ): JSX.Element => {
	const { open, severity, message, vertical, horizontal } = snackbarState;

	const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}
		handleSnackbarClose();
	};

	const fixedVertical = (vertical: VerticalType) => {
		switch (vertical) {
			case "top":
				return "fixed top-8";
			case "bottom":
				return "fixed bottom-8";
			default:
				return "";
		}
	}

	const horizontalPosition = (horizontal: HorizontalType) => {
		switch (horizontal) {
			case "left":
				return "left-2";
			case "center":
				return "left-1/2 -translate-x-1/2";
			case "right":
				return "right-2"
			default:
				return "left-1/2 -translate-x-1/2";
		}
	}

	let snackbarClass = classNames(
		fixedVertical(vertical),
		horizontalPosition(horizontal),
	);
		
	let alertClass = classNames(
		"flex items-center w-auto max-w-sm p-2 text-white rounded-lg shadow",
		snackbarStaticTheming(severity),
	)

	return (
		<div className={snackbarClass} >
			<Transition
				show={open}
				enter="transition ease duration-500 transform"
				enterFrom="opacity-0 translate-y-12"
				enterTo="opacity-100 -translate-y-0"
				leave="transition ease duration-300 transform"
				leaveFrom="opacity-100 -translate-y-0"
				leaveTo="opacity-0 translate-y-12"
			>
				<div 
					role="alert"
					className={alertClass}
				>
					<IconElement severity={severity} />
					<div className="ml-2 text-sm">
						{message}
					</div>
					<button 
						type="button" 
						className="ml-2 -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-gray-800" 
						data-dismiss-target="#toast-warning" 
						aria-label="Close"
						onClick={handleClose}
					>
						<span className="sr-only">Close</span>
						<svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
						</svg>
					</button>
				</div>
			</Transition>
		</div>
		
	);
};
export default SnackbarCustomized;

const Icon = ( {severity}: {severity: AlertColor} ) => {
	switch (severity) {
		case "success":
			return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
				<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
			</svg>;
		case "info":
			return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
				<path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
			</svg>;
		case "warning":
			return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
			</svg>;
		case "error":
			return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
			</svg>;
		default:
			return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
				<path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
			</svg>;
	}
}
const IconBackground = (severity: string) => {
	switch (severity) {
		case "success":
			return "bg-success-600" ;
		case "info":
			return "bg-primary-600";
		case "warning":
			return "bg-warning-600";
		case "error":
			return "bg-error-600" 
		default:
			return "";
	}
}
function IconElement ( {severity}: {severity: AlertColor} ) {
	let iconClass = classNames(
		"inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-white-900 rounded-lg",
		IconBackground(severity)
	);

	return <div className={iconClass} >
		<Icon severity={severity} />
		<span className="sr-only">icon</span>
	</div>
}

const snackbarStaticTheming = ( severity: AlertColor ) => {
	switch (severity) {
		case "success":
			return "bg-success-500";
		case "info":
			return "bg-primary-500";
		case "warning":
			return "bg-orange-500";
		case "error":
			return "bg-error-500";
		default:
			return "";
	}
}