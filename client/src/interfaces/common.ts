
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
