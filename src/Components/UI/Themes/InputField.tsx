import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  useFormContext,
} from "react-hook-form";
import { useRef, useState } from "react";
export interface IInputFieldProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  name: any;
  type: string;
  placeholder: string;
  borderClassName?: string;
  ClassName?: string;
  value: string;
  errors?:
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<FieldValues>>
    | undefined;
  className?: string;
  divClassName?: string;
  containerClassName?: string;
  textColor?: string;
  labelBackgroundColor?: string;
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
export function InputField(props: any): JSX.Element {
  const useComponentId = (id: string) =>
    id.trim().toLowerCase().replace(/ /g, "-");
  const [isFocused, setIsFocused] = useState(false);

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
    labelBackgroundColor,
    borderClassName,
    required = false,
    variant,
    textColor,
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
    <div
      className={`m-0 flex w-full flex-col relative rounded ${containerClassName || ""}`}
    >
      <div className="relative">
        {variant === "outline" ? (
          <div
            className={`
					${errors && errors?.message ? `border-danger border focus-within: ${ value ? "border-white" : borderClassName}` : borderClassName ? borderClassName : "border border-white"}
					${divClassName || ""} flex w-full items-center justify-between rounded `}
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
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder=""
              className={`w-full appearance-none rounded border-none below-md:h-[38px] h-[35px] px-3 py-3 text-[12px] font-normal bg-transparent ${textColor ? textColor : "text-white "}  ${
                errors && errors?.message
                  ? "border-red-500 focus:border-red-500"
                  : borderClassName
                    ? borderClassName
                      ? borderClassName
                      : "border border-white"
                    : borderClassName
                      ? "focus: border border-black"
                      : "focus:border-white"
              } ${isDisabled && "cursor-not-allowed opacity-90"} focus:outline-none`}
            />
          <div className="mr-3"> {rightIcon} </div> 

            {/* <label
                    className={`absolute left-2 top-1/2 transform -translate-y-1/2 px-1 text-sm bg-white transition-all ${
                      isFocused || value
                        ? "-top-0.5 text-xs text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    Tender  */}

            <label
              htmlFor={fieldId}
              onClick={() => document.getElementById(fieldId)?.focus()}
              className={`text-darklightgrey absolute  ${isFocused || value ? `-top-2.5  text-[8px]  ${textColor ? textColor : "text-white"}` : textColor ? textColor : "text-white"}
                    z-10   translate-all  ${labelBackgroundColor ? labelBackgroundColor : "bg-[#0F1044]"}  rounded-md ${textColor ? textColor : "text-white"} px-2 text-[8px] duration-300 peer-focus:px-2 ${
                      errors && errors?.message
                        ? "peer-focus: text-red-500"
                        : borderClassName
                          ? "border border-white"
                          : "peer-focus:text-primary"
                    } !text-[12px] left-1   ${
                      watch(name) && "  translate-all bg-[#0F1044] px-2"
                    }`}
            >
              {label}
              <span className="">{required ? "*" : ""}</span>
            </label>
          </div>
        ) : variant === "normal" ? (
          <div
            className={`
					${errors && errors?.message ? "border-2 border-red-500" : ""}
			${
        divClassName || ""
      } border ${borderClassName ? borderClassName : "border border-white"} w-full items-center  justify-between rounded-md `}
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
        <p className="mt-1 right-0 absolute text-[10px] top-[2.30rem] z-10 text-red-600">
          {errors?.message as string}
        </p>
      )}
    </div>
  );
}
