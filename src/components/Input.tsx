import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	id: string;
	error?: boolean;
	className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ id, error = false, className = "", ...rest }, ref) => {
		return (
			<input
				id={id}
				ref={ref}
				className={`rounded-xs w-full px-4 py-2 border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
					error ? "border-red-500 input-error" : "border-gray-300"
				} ${className}`}
				{...rest}
			/>
		);
	}
);

Input.displayName = "Input";
