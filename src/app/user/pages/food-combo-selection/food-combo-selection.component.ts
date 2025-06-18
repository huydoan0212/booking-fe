import {Component} from '@angular/core';
import {NgForOf} from '@angular/common';
import {TicketSummaryComponent} from '../../../shared/ui/components/ticket-summary/ticket-summary.component';
@Component({
  selector: 'app-food-combo-selection',
  templateUrl: './food-combo-selection.component.html',
  imports: [
    TicketSummaryComponent
  ],
  styleUrls: ['./food-combo-selection.component.scss']
})
export class FoodComboSelectionComponent {

}
