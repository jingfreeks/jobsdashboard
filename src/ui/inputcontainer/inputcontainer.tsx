
type InputContainerProps = {
  children: React.ReactNode;
  label?: string;   // Optional label for the input
  htmlFor?: string; // Optional htmlFor attribute for the label
};
const InputContainer = (props:InputContainerProps) => {
    const {children,label,htmlFor} = props;
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium mb-1">
       {label || "Email"}
      </label>
      {children}
    </div>
  );
};
export default InputContainer;
