import { AuthRepository } from './auth.repository';
import {
  AuthenticateUserDTO,
  CreateUserDTO,
  UpdateUserDTO,
  User,
} from './auth.types';
import Boom from '@hapi/boom';

export class AuthService {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  getUserById = async (userId: string): Promise<User> => {
    const userFound = await this.authRepository.getUserById(userId);

    if (!userFound) {
      throw Boom.notFound('User not found');
    }

    return userFound;
  };

  authenticateUser = async (
    credentials: AuthenticateUserDTO
  ): Promise<User> => {
    const userFound =
      await this.authRepository.getUserByEmailAndPassword(credentials);

    if (!userFound) {
      throw Boom.unauthorized('Invalid credentials');
    }

    return userFound;
  };

  createUser = async (data: CreateUserDTO): Promise<User> => {
    const emailTaken = await this.authRepository.getUserByEmail(data.email);

    if (emailTaken) {
      throw Boom.conflict('Email already in use');
    }

    const newUser = this.authRepository.createUser({
      email: data.email,
      password: data.password,
      role: data.role,
      name: data.name,
      address: data.address,
    });

    return newUser;
  };

  updateUser = async (user: UpdateUserDTO): Promise<User> => {
    const { id, name, address } = user;
    const userExists = await this.authRepository.getUserById(id);

    if (!userExists) {
      throw Boom.notFound('User not found');
    }

    const userUpdated = this.authRepository.updateUser({
      id,
      name,
      address,
    });

    return userUpdated;
  };
}
