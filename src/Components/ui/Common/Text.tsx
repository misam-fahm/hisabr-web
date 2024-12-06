interface TextProps
	extends React.LabelHTMLAttributes<HTMLLabelElement | HTMLHeadingElement | HTMLParagraphElement> {
	children: React.ReactNode;
	as?: string;
	className?: string;
}

// purpose : Text component
// dev-name : haider md
export function Text(props: TextProps): JSX.Element {
	let { children, as, className, ...rest } = props;
	as = as || "span";

	className = className || "break-words";

	switch (as) {
		case "h1":
			return (
				<h1 className={`${className || ""} text-5xl`} {...rest}>
					{children}
				</h1>
			);
		case "h2":
			return (
				<h2
					className={`${
						className || ""
					} text-4xl font-bold capitalize text-black max-sm:text-lg sm:text-xl md:text-2xl lg:text-3xl`}
					{...rest}
				>
					{children}
				</h2>
			);
		case "h3":
			return (
				<h3
					className={`${
						className || ""
					} text-2xl font-medium capitalize text-black max-md:text-base md:text-lg lg:text-xl `}
					{...rest}
				>
					{children}
				</h3>
			);
		case "h4":
			return (
				<h4
					className={`${
						className || ""
					} font-normal text-black max-sm:text-sm sm:text-base lg:text-lg`}
					{...rest}
				>
					{children}
				</h4>
			);
		case "h5":
			return (
				<h5 className={`${className || ""} `} {...rest}>
					{children}
				</h5>
			);
		case "p":
			return (
				<p
					className={`${
						className || ""
					} font-normal text-black max-sm:text-sm sm:text-base lg:text-lg`}
					{...rest}
				>
					{children}
				</p>
			);
		default:
			return (
				<span
					className={`${className || ""} text-black max-sm:text-sm sm:text-sm md:text-base`}
					{...rest}
				>
					{children}
				</span>
			);
	}
}
