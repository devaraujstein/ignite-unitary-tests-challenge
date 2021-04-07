import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate an user", async () => {
    const user = {
      name: "André",
      email: "andreearaujo98@gmail.com",
      password: "123456"
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({email: user.email, password: user.password});

    expect(result).toHaveProperty("token");

  });

  it("should not be able to authenticate an non existent user", async () => {
    await expect(async () => {
      await authenticateUserUseCase.execute({
        email: "false_email@gmail.com",
        password: "12345"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)

  });

  it("should not be able to authenticate an user with incorrect password", async () => {
    const user = {
      name: "André",
      email: "andreearaujo98@gmail.com",
      password: "123456"
    }

    await createUserUseCase.execute(user);

    await expect(async () => {
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "12345"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);

  });
})
