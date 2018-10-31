import { NgModule } from '@angular/core';
import {
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatBottomSheetModule,
  MatFormFieldModule,
  MatInputModule,
  MatSliderModule,
  MatSelectModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatDialogModule,
  MatMenuModule,
  MatChipsModule,
  MatGridListModule,
  MatTooltipModule,
  MatDividerModule,
} from '@angular/material';

@NgModule({
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatBottomSheetModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDialogModule,
    MatMenuModule,
    MatChipsModule,
    MatGridListModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  exports: [
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatBottomSheetModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDialogModule,
    MatMenuModule,
    MatChipsModule,
    MatGridListModule,
    MatTooltipModule,
    MatDividerModule,
  ]
})
export class AppMaterialModule { }
