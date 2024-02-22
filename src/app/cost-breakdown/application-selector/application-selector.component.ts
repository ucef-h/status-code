import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-application-selector',
  templateUrl: './application-selector.component.html',
  styleUrls: ['./application-selector.component.less']
})
export class ApplicationSelectorComponent {
  applications: string[] = ['none', 'helloworld'];
  environments: string[] = ['none', 'prod'];
  displayTypes: string[] = ['none', 'breakdown', 'history'];

  selectedApplication: string = 'none';
  selectedEnvironment: string = 'none';
  selectedDisplayType: string = 'none';

  @Output() selectionComplete = new EventEmitter<{ application: string; environment: string, displayType: string }>();

  onApplicationSelect(value: string): void {
    this.selectedApplication = value;
    this.selectedEnvironment = 'none';
    this.selectedDisplayType = 'none';
    this.checkAndEmitSelection();
  }

  onEnvironmentSelect(value: string): void {
    this.selectedEnvironment = value;
    this.selectedDisplayType = 'none';
    this.checkAndEmitSelection();
  }

  onDisplayTypeSelect(value: string): void {
    this.selectedDisplayType = value;
    this.checkAndEmitSelection();
  }

  private checkAndEmitSelection(): void {
    this.selectionComplete.emit({
      application: this.selectedApplication,
      environment: this.selectedEnvironment,
      displayType: this.selectedDisplayType
    });

  }

}