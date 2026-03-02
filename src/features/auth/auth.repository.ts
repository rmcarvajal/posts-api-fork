import { Pool } from 'pg';
import {
  AuthenticateUserDTO,
  CreateUserDTO,
  UpdateUserDTO,
  User,
} from './auth.types';

export class AuthRepository {
  private pool: Pool;
  private users: User[];

  constructor(pool: Pool) {
    this.pool = pool;
    this.users = [];
  }

  getUserById = async (userId: string): Promise<User | null> => {
    const dbRequest = await this.pool.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );
    if (dbRequest.rowCount === 0) {
      return null;
    }
    return dbRequest.rows[0];
  };

  getUserByEmail = async (email: string): Promise<User | null> => {
    const dbRequest = await this.pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (dbRequest.rowCount === 0) {
      return null;
    }
    return dbRequest.rows[0];
  };

  getUserByEmailAndPassword = async (
    authUser: AuthenticateUserDTO
  ): Promise<User | null> => {
    const userFound = this.users.find(
      (user) =>
        user.email === authUser.email && user.password === authUser.password
    );

    return userFound ?? null;
  };

  createUser = async (data: CreateUserDTO): Promise<User> => {
    const newUser: User = {
      id: crypto.randomUUID(),
      email: data.email,
      password: data.password,
      role: data.role,
      name: data.name ?? null,
      address: data.address ?? null,
    };
    const dbRequest = await this.pool.query(
      'INSERT INTO users (email, name, address, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
      [
        newUser.email,
        newUser.name,
        newUser.address,
        newUser.password,
        newUser.role,
      ]
    );

    return dbRequest.rows[0];
  };

  updateUser = async (user: UpdateUserDTO): Promise<User> => {
    const { id, name, address } = user;
    const userIndex = this.users.findIndex((user) => user.id === id);

    const userAtIndex = this.users[userIndex];

    const updatedUser = {
      ...userAtIndex,
      name: name === undefined ? userAtIndex.name : name,
      address: address === undefined ? userAtIndex.address : address,
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  };
}
