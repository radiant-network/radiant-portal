import { ActionButton, ButtonTypes } from '../../base/Buttons';

interface IProps {}

export function MultiSelect({}: IProps) {
  return (
    <div className="bg-white p-2 w-full max-w-md">
      <input
        type="text"
        placeholder="Search ..."
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex justify-between mb-4">
        <button className="underline font-semibold">All</button>
        <button className="underline font-semibold">None</button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="flex items-center space-x-4">
            <input className="w-4 h-6" type="checkbox" />
            Value 1<span className="checkmark"></span>
          </label>
          <span className="bg-gray-200 px-3 py-1 rounded-md">234</span>
        </div>
      </div>

      <hr className="my-4 border-gray-300" />

      <div className="flex align-right justify-end items-center space-x-2">
        <button className="text-gray-600">Clear</button>
        <div className="flex space-x-2">
          <ActionButton className="h-7" variant="primary" actions={[]} onDefaultAction={() => {}}>Apply</ActionButton>
        </div>
      </div>
    </div>
  );
}
