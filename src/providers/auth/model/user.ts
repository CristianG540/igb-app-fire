export class User {
  constructor(
    public uid: string,
    public email: number,
    public catchPhrase?: string,
    public verificationEmailIsSend?: boolean,
  ) {}
}
