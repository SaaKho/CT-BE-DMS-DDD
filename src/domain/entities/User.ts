// src/entities/User.ts
export class User {
  private id!: string;
  private username!: string;
  private email!: string;
  private password!: string;
  private role!: string;

  constructor(
    id: string,
    username: string,
    email: string,
    password: string,
    role: string = "User"
  ) {
    this.id = id;
    this.setUsername(username);
    this.setEmail(email);
    this.setPassword(password);
    this.setRole(role);
  }

  // Method to initialize ID after construction
  public initializeId(id: string): void {
    if (!this.id) {
      this.id = id;
    }
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getUsername(): string {
    return this.username;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  public getRole(): string {
    return this.role;
  }

  // Setters with validation so invarients donot exist
  //Setters with Encapsulated Logic
  private setUsername(username: string): void {
    if (!username || username.length === 0) {
      throw new Error("Username cannot be empty.");
    }
    this.username = username;
  }

  private setEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid Email Format");
    }
    this.email = email;
  }

  private setPassword(password: string): void {
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }
    this.password = password;
  }

  private setRole(role: string): void {
    const validRoles = ["User", "Admin"];
    if (!validRoles.includes(role)) {
      throw new Error(`Invalid role. Allowed values: ${validRoles.join(", ")}`);
    }
    this.role = role;
  }

  // Public methods for updating properties
  public updateUsername(username: string): void {
    this.setUsername(username);
  }

  public updateEmail(email: string): void {
    this.setEmail(email);
  }

  public updatePassword(password: string): void {
    this.setPassword(password);
  }

  public updateRole(role: string): void {
    this.setRole(role);
  }
}
