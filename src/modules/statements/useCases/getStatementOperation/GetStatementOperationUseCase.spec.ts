import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

import { GetStatementOperationError } from "./GetStatementOperationError";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("Should be able to get a statement operation", async () => {
    const user = await createUserUseCase.execute({
      name: "andré",
      email: "andreearaujo@gmail.com",
      password: "123456"
    })

    const statement = await createStatementUseCase.execute({
      user_id: <string>user.id,
      description: "Let's do it",
      amount: 2000,
      type: OperationType.DEPOSIT || OperationType.WITHDRAW
    });

    const statement_operation = await getStatementOperationUseCase.execute({
      user_id: <string>statement.user_id,
      statement_id: <string>statement.id
    });
    expect(statement_operation).toHaveProperty("id");
  });

  it("Should not be able to show a statement operation a non existent user", async () => {
    const user = await createUserUseCase.execute({
      name: "André",
      email: "andreearaujo98@gmail.com",
      password: "123456"
    });

    const statement = await createStatementUseCase.execute({
      user_id: <string>user.id,
      description: "Let's do it",
      amount: 2000,
      type: OperationType.DEPOSIT || OperationType.WITHDRAW
    });

    await expect(getStatementOperationUseCase.execute({
      user_id: "11111111-2222-3333-4444-555555555555",
      statement_id: <string>statement.id
    })).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);

  });

  it("Should not be able to show a statement operation a non existent statement", async () => {
    const user = await createUserUseCase.execute({
      name: "André",
      email: "andreearaujo98@gmail.com",
      password: "123456"
    });

    const statement = await createStatementUseCase.execute({
      user_id: <string>user.id,
      description: "Let's do it",
      amount: 2000,
      type: OperationType.DEPOSIT || OperationType.WITHDRAW
    });

    await expect(getStatementOperationUseCase.execute({
      user_id: <string>statement.user_id,
      statement_id: "11111111-2222-3333-4444-555555555555"
    })).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);

  });


})
