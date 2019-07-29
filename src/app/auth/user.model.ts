export interface Roles {
  reader: boolean;
  author?: boolean;
  admin?: boolean
}

export class User {
  name: string;
  email: string;
  uid: string;
  roles: Roles;

  constructor(authData) {
    // this.email = authData.email;
    this.roles = { reader: true };
  }
}
