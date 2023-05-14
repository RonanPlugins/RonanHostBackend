import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PterodactylService {
  constructor(private httpService: HttpService) {}

  async createUser(username: string, email: string, password: string) {
    const response = await this.httpService
      .post('https://your-ptero-panel.com/api/application/users', {
        username,
        email,
        password,
        // You might need to include more fields here, depending on Pterodactyl's API requirements.
      })
      .toPromise();

    return response.data;
  }
}
