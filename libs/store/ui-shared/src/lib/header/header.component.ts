import { Component, Input } from '@angular/core';

@Component({
  selector: 'bg-hoard-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() title = '';
}
