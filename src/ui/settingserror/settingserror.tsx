const SettingsError = (props:{label:string}) => {
    const {label}=props;
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{label}</p>
      </div>
    </div>
  );
};
export default SettingsError;
