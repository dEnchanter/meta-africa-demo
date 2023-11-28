type FormDataType = {
  firstName: string;
  lastName: string;
  email: string;
  country?: { label: string; value: string };
  state: string;
  dob: string;
  institution?: string;
  team?: string;
  phoneNumber: string;
  address: string;
  password: string;
  confirmPassword: string;
  user_type: 'scout' | 'player' | '';
};