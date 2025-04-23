export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  token: string;
  // Ajoute ici d'autres champs si l'API en renvoie (user, role, etc.)
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  // Ajoute ici d'autres champs si l'API en renvoie
}
