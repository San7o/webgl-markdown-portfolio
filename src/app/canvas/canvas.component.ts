import { Component } from '@angular/core';
import { Canvas } from '../../../renderer/canvas';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss'
})
export class CanvasComponent {
  ngOnInit(): void {
    Canvas.create();
  }
}
