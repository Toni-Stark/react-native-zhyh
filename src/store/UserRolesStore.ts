import { makeAutoObservable, observable } from 'mobx';

export class UserRolesStore {
  @observable isTeacherId: string | undefined;
  @observable isStudentId: string[] = [];
  @observable isSecTeacherId: string[] = [];

  public constructor() {
    makeAutoObservable(this);
  }
}
