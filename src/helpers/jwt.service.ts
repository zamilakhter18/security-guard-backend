export class JwtService {
  public sign(payload: any): Promise<string> {
    return Promise.resolve(payload);
  }
}
