import { DeleteUserUseCase } from './delete-user.js'
import { user } from '../../tests/index.js'

/* eslint-disable no-undef */
describe('DeleteUserUserCase', () => {
  class DeleteUserRepositoryStub {
    async execute() {
      return user
    }
  }
  const makeSut = () => {
    const deleteUserRepository = new DeleteUserRepositoryStub()
    const sut = new DeleteUserUseCase(deleteUserRepository)

    return {
      deleteUserRepository,
      sut,
    }
  }
  test('should sucessfully delete a user', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const deletedUser = await sut.execute(user.id)

    // assert
    expect(deletedUser).toEqual(user)
  })

  test('should call DeleteUserRepository with correct params', async () => {
    // arrange
    const { sut, deleteUserRepository } = makeSut()
    const executeSpy = jest.spyOn(deleteUserRepository, 'execute')

    // act
    await sut.execute(user.id)

    // assert
    expect(executeSpy).toHaveBeenCalledWith(user.id)
  })
})
