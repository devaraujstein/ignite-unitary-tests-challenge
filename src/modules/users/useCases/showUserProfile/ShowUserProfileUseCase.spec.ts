import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;


describe("Show User Profile", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("Should be able to show user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "André",
      email: "andreearaujo98@gmail.com",
      password: "123456"
    });

    const profile = await showUserProfileUseCase.execute(<string>user.id);

    expect(profile).toHaveProperty("id");
  });

  it("Should not be able to show a non-existent user profile", async () => {
    await expect( async () => {
      const user_id = "F153b723-5207-4e43-9f1f-737522d3f99F";

      await showUserProfileUseCase.execute(<string>user_id);
    }).rejects.toBeInstanceOf(ShowUserProfileError);

  });
});
