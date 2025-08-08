const Loaders = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-slate-600">Loading companies...</span>
      </div>
    </div>
  );
};
export default Loaders;
