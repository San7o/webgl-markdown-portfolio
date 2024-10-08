import { Component } from '@angular/core';
import { Renderer } from '../../../renderer/renderer';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss'
})
export class CanvasComponent {
  ngOnInit(): void {
    Renderer.render();
  }
}
