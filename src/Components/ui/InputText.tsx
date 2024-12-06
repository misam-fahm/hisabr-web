import { FieldError, FieldErrorsImpl, FieldValues, Merge, useFormContext } from "react-hook-form";
import { Text } from "./Common/Text";
export interface IInputtextProps
	extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
	label: string;
	name: string;
	type: string;
	placeholder: string;
	borderClassName?: string;
	ClassName?: string;
	value: string;
	errors?: FieldError | Merge<FieldError, FieldErrorsImpl<FieldValues>> | undefined;
	className?: string;
	divClassName?: string;
	containerClassName?: string;
	required?: boolean;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	variant?: "contained" | "outline" | "normal" | "header";
	isDisabled?: boolean;
	onBlur?: () => void;
	autoCapitalized?: boolean;
}

//purpose : input component
//dev-name : md haider
export function Inputtext(props:any): JSX.Element {

	const useComponentId = (id: string) => id.trim().toLowerCase().replace(/ /g, "-");
	
	const {
		label,
		name,
		type,
		placeholder,
		value,
		errors,
		className,
		leftIcon,
		rightIcon,
		borderClassName,
		required = true,
		variant,
		ClassName,
		isDisabled,
		divClassName,
		containerClassName,
		onBlur,
		autoCapitalized,
		...rest
	} = props;

	const { register, setValue, watch } = useFormContext();

	const fieldId = useComponentId(label || placeholder);

	return (
		<div className={`m-0 flex w-full flex-col relative rounded-md ${containerClassName || ""}`}>
			<div className="relative">
				{variant === "outline" ? (
					<div
					className={`
					${errors && errors?.message ? "border-danger border" : "border border-white"}
					${divClassName || ""} flex w-full items-center justify-between rounded-md focus-within:border-white`}
				>
					{leftIcon}
					<input
						id={fieldId}
						type={type}
						value={value}
						disabled={isDisabled}
						{...rest}
						{...register(name)}
						onChange={(event) => {
							if (autoCapitalized) {
								setValue(name, event.target.value.toUpperCase());
							} else {
								setValue(name, event.target.value);
							}
				
							// Ensure you trigger the default onChange event for the input
							if (rest.onChange) {
								rest.onChange(event);
							}
						}}
						onBlur={onBlur}
						placeholder=""
						className={`w-full appearance-none rounded-md border-none px-3 py-3 text-sm font-normal bg-transparent text-white ${
							errors && errors?.message
								? "border-red-500 focus:border-red-500"
								: borderClassName
								? "border-white"
								: "focus:border-white"
						} ${isDisabled && "cursor-not-allowed opacity-90"} focus:outline-none`}
					/>
					{rightIcon}
					<label
						htmlFor={fieldId}
						onClick={() => document.getElementById(fieldId)?.focus()}
						className={`text-darklightgrey absolute top-1.5  z-10 origin-[0] ml-5 -translate-y-4 scale-75 bg-[#334155] text-white px-2 text-base duration-300 peer-focus:px-2 ${
							errors && errors?.message
								? "peer-focus:text-red-500"
								: borderClassName
								? "border-white"
								: "peer-focus:text-primary"
						} !text-sm left-3 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1.5 peer-focus:-translate-y-4 peer-focus:scale-75 ${
							watch(name) && " top-1.5 -translate-y-4 scale-75 bg-[#334155] px-2"
						}`}
					>
						{placeholder}
						<span className="">{required ? "*" : ""}</span>
					</label>
				</div>
				
				) : variant === "normal" ? (
					<div
						className={`
					${errors && errors?.message ? "border-2 border-red-500" : ""}
			${
				divClassName || ""
			} border border-white w-full items-center  justify-between rounded-md `}
					>
						<input
							type={type}
							value={value}
							{...register(name)}
							onChange={(event) => {
								if (autoCapitalized) {
									setValue(name, event.target.value.toUpperCase());
								} else {
									setValue(name, event.target.value);
								}
							}}
							onBlur={onBlur}
							id={fieldId}
							placeholder={placeholder}
							disabled={isDisabled}
							className={`placeholder:text-darklightgrey placeholder:text-14 w-full appearance-none rounded-md border-none border-transparent bg-transparent font-normal focus:border-transparent focus:ring-0  ${
								className || ""
							} ${isDisabled && "cursor-not-allowed opacity-50"}`}
							{...rest}
						/>
					</div>
				) : variant === "header" ? (
					<div
						className={`
					${errors && errors?.message ? "border-2 border-red-500" : ""}
			${
				divClassName || ""
			} border-text-darklightgrey w-full items-center  justify-between rounded-md border`}
					>
						<input
							type={type}
							value={value}
							{...register(name)}
							onChange={(event) => {
								if (autoCapitalized) {
									setValue(name, event.target.value.toUpperCase());
								} else {
									setValue(name, event.target.value);
								}
							}}
							onBlur={onBlur}
							id={fieldId}
							placeholder={placeholder}
							disabled={isDisabled}
							className={` w-full !rounded-lg ${ClassName} border-none !bg-transparent 
								
							 ${isDisabled && "cursor-not-allowed opacity-50"}`}
							{...rest}
						/>
					</div>
				) : (
					<div
						className={`
					${errors && errors?.message ? "border-2 border-red-500" : "border border-gray-300"}
			${divClassName || ""} flex  w-full items-center justify-between  rounded-md bg-white px-3 `}
					>
						<span className="rounded-[50%] bg-[#F7F7FD] p-1.5">{leftIcon}</span>

						<input
							type={type}
							value={value}
							{...register(name)}
							onChange={(event) => {
								if (autoCapitalized) {
									setValue(name, event.target.value.toUpperCase());
								} else {
									setValue(name, event.target.value);
								}
							}}
							onBlur={onBlur}
							id={fieldId}
							placeholder={placeholder}
							disabled={isDisabled}
							className={`placeholder:text-darklightgrey placeholder:!text-12 w-full appearance-none rounded-md border-none border-transparent bg-transparent font-normal focus:border-transparent focus:ring-0  ${
								className || ""
							} ${isDisabled && "cursor-not-allowed opacity-50"}`}
							{...rest}
						/>
						<span className="rounded-[50%] p-0.5">{rightIcon}</span>
					</div>
				)}
			</div>
			{errors && errors?.message && (
				<Text className="mt-1 !text-sm absolute top-[2.50rem] z-10 text-red-600">
					{errors?.message as string}
				</Text>
			)}
		</div>
	);
}

