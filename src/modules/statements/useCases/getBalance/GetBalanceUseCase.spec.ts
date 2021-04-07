import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase"

import { GetBalanceError } from "./GetBalanceError";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  })

  it("Should be able to show balance user", async () => {
    const user = await createUserUseCase.execute({
      name: "André",
      email: "andreearaujo98@gmail.com",
      password: "123456"
    });

    await createStatementUseCase.execute({
      user_id: <string>user.id,
      description: "Let's do it",
      amount: 2000,
      type: OperationType.DEPOSIT
    });

    await createStatementUseCase.execute({
      user_id: <string>user.id,
      description: "Let's do it",
      amount: 1500,
      type: OperationType.WITHDRAW
    });

    const history_balance = await getBalanceUseCase.execute({user_id: <string>user.id});

    expect(history_balance).toHaveProperty("balance");
  })

  it("Should not be able to show balance a non existent user", async () => {
    await createUserUseCase.execute({
      name: "André",
      email: "andreearaujo98@gmail.com",
      password: "123456"
    });

    await expect(
      getBalanceUseCase.execute(
        {
          user_id: "11111111-2222-3333-4444-555555555555"
        }
      )).rejects.toBeInstanceOf(GetBalanceError);
  });
})
