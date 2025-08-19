
type dataProps = {
  _id?: string;
  name?: string;
};

interface optionListProps {
  defaultValue?: string;
  disabled?: boolean;
  data: dataProps[];
  title: string;
  name?: string;
}

const OptionList = (props:optionListProps) => {
  const { defaultValue, disabled,data,title,name } = props;
  return (
    <select
      name={name}
      className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
      defaultValue={defaultValue}
      disabled={disabled}
    >
      <option value="">{title}</option>
      {(data as dataProps[])?.map((data: dataProps) => (
        <option key={data._id} value={data._id}>
          {data.name}
        </option>
      ))}
    </select>
  );
};
export default OptionList;
