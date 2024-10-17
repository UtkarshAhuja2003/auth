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
    value?: string; 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void 
  }[];
};

export type User = {
  _id?: string;
  name?: string;
  email?: string;
  password?: string;
}