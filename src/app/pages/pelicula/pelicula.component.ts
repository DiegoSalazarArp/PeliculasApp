import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieDetails } from 'src/app/interfaces/movie-response';
import { PeliculasService } from '../../services/peliculas.service';
import { Cast } from '../../interfaces/credits-response';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-pelicula',
  templateUrl: './pelicula.component.html',
  styleUrls: ['./pelicula.component.css'],
})
export class PeliculaComponent implements OnInit {
  public pelicula: MovieDetails | undefined;
  public cast: Cast[] = [];
  constructor(
    private ar: ActivatedRoute,
    private peliculaService: PeliculasService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.ar.snapshot.params.id;

    // Realizar subscribe en varios bloques
    combineLatest([
      this.peliculaService.getPeliculasDetalle(id),
      this.peliculaService.getCast(id),

      // Se realiza la subscripción para obtener las peliculas como el cast:
    // tslint:disable-next-line: deprecation
    ]).subscribe(([pelicula, cast]) => {
      if (!pelicula) {
        this.router.navigateByUrl('/home');
        return;
      }
      this.pelicula = pelicula;
      this.cast = cast.filter((actor) => actor.profile_path !== null);
    });

    // Forma normal:
    // this.peliculaService.getPeliculasDetalle(id).subscribe((movie) => {
    //   if (!movie) {
    //     this.router.navigateByUrl('/home');
    //     return;
    //   }
    //   this.pelicula = movie;
    // });

    // this.peliculaService.getCast(id).subscribe((cast) => {
    //   console.log(cast);
    //   this.cast = cast.filter(actor => actor.profile_path !== null);
    // });
  }

  // tslint:disable-next-line: typedef
  onRegresar() {
    this.location.back();
  }
}
