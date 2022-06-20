import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatStepperModule} from '@angular/material/stepper';
import {MatListModule} from '@angular/material/list'; 
import {MatTabsModule} from '@angular/material/tabs'; 
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; 
import {MatDialogModule} from '@angular/material/dialog'; 
import {MatTooltipModule} from '@angular/material/tooltip'; 

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatChipsModule,
  MatDividerModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressBarModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatStepperModule,
  MatListModule,
  MatTabsModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatTooltipModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    materialModules
  ],
  exports: [
    materialModules
  ]
})
export class MaterialModule { }
