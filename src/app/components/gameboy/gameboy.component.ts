import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'app/core/services';

declare global {
  interface Window { gameboy: any; }
}
declare var gb: any;
declare var onerror: any;
declare var GBMasterClass: any;

@Component({
  selector: 'app-gameboy',
  templateUrl: './gameboy.component.html',
  styleUrls: ['./gameboy.component.scss']
})
export class GameboyComponent implements OnInit {
  constructor(public electronService: ElectronService) {
  }
  DEBUG = false

  fullScreen() {
    if (this.electronService.isElectron) {
      if (this.electronService.isFullScreen) {
        this.electronService.ipcRenderer.send('fullscreen', false)
        this.electronService.isFullScreen = false
      } else {
        this.electronService.ipcRenderer.send('fullscreen', true)
        this.electronService.isFullScreen = true
      }
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      function loadROMfileReader(evt) {
        var file = evt.target.files[0];
        var reader = new FileReader();
        reader.onload = (function (theFile) {
          return function (e) {
            window.gameboy.loadROMBuffer(e.target.result);
          };
        })(file);
        reader.readAsArrayBuffer(file);
      }
      document.getElementById("file").addEventListener('change', loadROMfileReader, false);
    }, 1000)

    window.gameboy = new gb('./assets/default.gbc', document.getElementById('gameboy'));
  }

  debug() {
    this.DEBUG = !this.DEBUG
    if (this.electronService.isElectron) {
      if (this.DEBUG) {
        this.electronService.ipcRenderer.send('resize', { width: 1000, height: 770 })
      } else {
        this.electronService.ipcRenderer.send('resize', { width: 500, height: 770 })
      }
    }
  }

}
