import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { Game } from '@bg-hoard/util-interface';
import { formatRating } from '@bg-hoard/store/util-formatters';

@Component({
  selector: 'bg-hoard-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.scss']
})
export class GameDetailComponent {
  constructor(private _http: HttpClient, private _route: ActivatedRoute) {}

  game$ = this._route.paramMap.pipe(
    map((params: ParamMap) => params.get('id')),
    switchMap(id => this._http.get<Game>(`/api/games/${id}`))
  );
  formatRating = formatRating;
}