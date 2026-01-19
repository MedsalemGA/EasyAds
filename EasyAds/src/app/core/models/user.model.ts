export interface User {
  id?: number;
  nom: string;
  adressemail: string;
  numde_telephone: string;
  wilaya: string;
  role: string;
  email_verified_at?: string | null;
  created_at?: string;
}

export interface UpdateUserRequest {
  nom?: string;
  adressemail?: string;
  numde_telephone?: string;
  wilaya?: string;
  current_password?: string;
  new_password?: string;
  new_password_confirmation?: string;
}

export interface DeleteAccountRequest {
  password: string;
}

