import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import {CreateUserError} from './CreateUserError';

import isUuid from '../../../../utils/validateUuid';

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to create a new user", async () => {

    const user = {
      name: "André",
      email: "andreearaujo98@gmail.com",
      password: "123456"
    };

    const response = await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    });

    expect(201);
    expect(response).toHaveProperty("id");
  });

  it("should not be able to create a new user if email already exists", async () => {
    await createUserUseCase.execute({
      name: "André",
      email: "teste_andre@gmail.com",
      password: "12345"
    });

    await expect(createUserUseCase.execute({
      name: "André",
      email: "teste_andre@gmail.com",
      password: "12345"
    })).rejects.toBeInstanceOf(CreateUserError);
  });

  it("should be able to create a valid uuid id", async () => {
    const user = await createUserUseCase.execute({
      name: "teste",
      email: "testando_validacao@gmail.com",
      password: "12345"
    });

    const valid_uuid = isUuid(<string>user.id);

    expect(user).toHaveProperty("id");
    expect(valid_uuid).toBe(true);
  });
})
