const Cards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 border border-slate-100">
        <span className="text-slate-500 text-sm">Total Jobs</span>
        <span className="text-2xl font-bold text-blue-700">74</span>
      </div>
      <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 border border-slate-100">
        <span className="text-slate-500 text-sm">Interviews</span>
        <span className="text-2xl font-bold text-blue-700">18</span>
      </div>
      <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 border border-slate-100">
        <span className="text-slate-500 text-sm">Offers</span>
        <span className="text-2xl font-bold text-blue-700">5</span>
      </div>
    </div>
  );
};
export default Cards;
