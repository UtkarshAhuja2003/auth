export type AuthFormProps = {
  title: string;
  buttonLabel: string;
  secondaryAction: { text: string; link: string; onClick?: () => void };
  forgotPasswordAction?: { text: string; link: string };
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  fields: { 
    name: string; 
    placeholder: string; 
    type: string; 
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void 
  }[];
};

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
