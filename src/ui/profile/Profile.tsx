

type profileProps = {  handleLogout: () => void;
};
const ProfileScreen = (props:profileProps) => {

    const {handleLogout}= props;
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
      <div className="p-4 border-b border-slate-100">
        <span className="block font-semibold text-slate-800">Jane Doe</span>
        <span className="block text-xs text-slate-500">Admin</span>
      </div>
      <ul>
        <li>

          <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700">


            Profile
          </button>
        </li>
        <li>
          <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700">



            Settings
          </button>
        </li>
        <li>
          <button

            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};
export default ProfileScreen;
