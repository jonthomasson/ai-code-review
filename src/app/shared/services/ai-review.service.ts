import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CodeReviewResponse, FileChanges } from '../models/ai-review';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AiReviewService {
  apiBase: string = environment.apiUrl;
  constructor(private http: HttpClient, private authService: AuthService) { }

  async submitCodePR(fileChanges: FileChanges[]): Promise<Observable<CodeReviewResponse>> {  
    const firebaseToken = await this.authService.getFirebaseToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${firebaseToken}`);

    return this.http.post<CodeReviewResponse>(`${this.apiBase}/review`, fileChanges, { headers });
  }
}
