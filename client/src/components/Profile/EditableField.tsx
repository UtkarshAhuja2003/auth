import { EditableFieldProps } from "@/interfaces/common";

const EditableField: React.FC<EditableFieldProps> = ({ field, label, inputProps, userData, handleEditToggle }) => {
    const fieldData = userData[field];

    return (
        <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">{label || field}</label>
            <div className="flex items-center justify-between">
                {fieldData?.isEditing ? (
                    <div className="flex space-x-2">
                        <input
                            {...inputProps}
                            value={fieldData.cacheValue as string}
                            onChange={inputProps.onChange}
                            className="border p-2 rounded w-full"
                        />
                        <button onClick={() => handleEditToggle(field, "save", fieldData.cacheValue)} className="text-blue-500 hover:underline">
                            Save
                        </button>
                        <button onClick={() => handleEditToggle(field, "cancel")} className="text-gray-500 hover:underline">
                            Cancel
                        </button>
                    </div>
                ) : (
                    <>
                        <span>{userData[field]?.value}</span>
                        <button className="text-blue-500 hover:underline" onClick={() => handleEditToggle(field, "edit")}>
                            Edit
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default EditableField;
