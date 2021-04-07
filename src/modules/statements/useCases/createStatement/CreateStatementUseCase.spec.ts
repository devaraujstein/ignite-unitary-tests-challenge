import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("Should be able to do a new deposit", async () => {
    const user = await createUserUseCase.execute({
      name: "André",
      email: "andre@gmail.com",
      password: "123456"
    });

    const statement_deposit = await createStatementUseCase.execute({
      user_id: <string>user.id,
      description: "Let's do it",
      amount: 1500,
      type: OperationType.DEPOSIT
    });

    expect(statement_deposit).toHaveProperty("id");

  });

  it("Should be able to do a new withdraw", async () => {
    const user = await createUserUseCase.execute({
      name: "André",
      email: "andre@gmail.com",
      password: "123456"
    });

    await createStatementUseCase.execute({
      user_id: <string>user.id,
      description: "Let's do it",
      amount: 2000,
      type: OperationType.DEPOSIT
    });

    const statement_withdraw = await createStatementUseCase.execute({
      user_id: <string>user.id,
      description: "Let's do it",
      amount: 1500,
      type: OperationType.WITHDRAW
    });

    expect(statement_withdraw).toHaveProperty("id");
  });

  it("Should not be able to do a new statement if user not already exists", async () => {
    await createUserUseCase.execute({
      name: "André",
      email: "andre@gmail.com",
      password: "123456"
    });

    await expect(
        createStatementUseCase.execute({
          user_id: "11111111-2222-3333-4444-555555555555",
          description: "Let's do it",
          amount: 2000,
          type: OperationType.DEPOSIT || OperationType.WITHDRAW
      })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Should not be able to do a withdraw without sufficient funds", async () => {
    const user = await createUserUseCase.execute({
      name: "André",
      email: "andre@gmail.com",
      password: "123456"
    });

    await createStatementUseCase.execute({
      user_id: <string>user.id,
      description: "Let's do it",
      amount: 2000,
      type: OperationType.DEPOSIT
    });

    await expect(
      createStatementUseCase.execute({
        user_id: <string>user.id,
        description: "Let's do it",
        amount: 3000,
        type: OperationType.WITHDRAW
      })
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
