const FormContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  onSubmit: (e: React.FormEvent) => void;
  clssName?: string;
}> = ({ children, onSubmit,className="w-full flex flex-col gap-4" }) => {
  return (
    <form onSubmit={onSubmit} className={className}>
      {children}
    </form>
  );
};
export default FormContainer;
