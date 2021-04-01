import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { CarteleraResult, Movie } from '../interfaces/cartelera-response';
import { CreditsResponse, Cast } from '../interfaces/credits-response';
import { MovieDetails } from '../interfaces/movie-response';

@Injectable({
  providedIn: 'root',
})
export class PeliculasService {
  private baseURL = 'https://api.themoviedb.org/3';
  public carteleraPage = 1;
  public cargando = false;

  constructor(private http: HttpClient) {}

  // tslint:disable-next-line: typedef
  get params() {
    return {
      api_key: 'c850a5075a0f58f43b9349ccf9fbd3e0',
      language: 'es-ES',
      page: this.carteleraPage.toString(),
    };
  }

  // tslint:disable-next-line: typedef
  getPeliculasDetalle(id: string) {
    return this.http
      .get<MovieDetails>(`${this.baseURL}/movie/${id}`, {
        params: this.params,
      })
      .pipe(catchError((err) => of(null)));
  }

  getCast(id: string): Observable<Cast[]> {
    return this.http
      .get<CreditsResponse>(`${this.baseURL}/movie/${id}/credits`, {
        params: this.params,
      })
      .pipe(
        map((resp) => resp.cast),
        catchError((err) => of([]))
      );
  }

  resetCarteleraPage(): void {
    this.carteleraPage = 1;
  }

  getCartelera(): Observable<Movie[]> {
    if (this.cargando) {
      return of([]);
    }

    this.cargando = true;

    return this.http
      .get<CarteleraResult>(`${this.baseURL}/movie/now_playing?`, {
        params: this.params,
      })
      .pipe(
        map((resp) => resp.results),
        tap(() => {
          this.carteleraPage += 1;
          this.cargando = false;
        })
      );
  }

  buscarPeliculas(texto: string): Observable<Movie[]> {
    const params = { ...this.params, page: '1', query: texto };

    return this.http
      .get<CarteleraResult>(`${this.baseURL}/search/movie`, {
        params,
      })
      .pipe(map((resp) => resp.results));
  }
}
