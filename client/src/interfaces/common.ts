import { User } from "./user";

export type InputFieldProps = {
    name: string;
    placeholder: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
  
export type ButtonProps = {
    label: string;
    isLoading?: boolean;
};

export type BannerProps = {
  message: string;
  onClose: () => void;
  type: 'success' | 'error';
};

export type EditableUser = {
  [k in keyof User]: { value: User[k], cacheValue: User[k], isEditing: boolean };
}

export type EditableFieldProps = {
  field: keyof User;
  label?: string;
  inputProps: InputFieldProps;
  userData: EditableUser;
  handleEditToggle: (field: keyof User, action: "edit" | "save" | "cancel", newValue?: string | boolean) => void;
};

