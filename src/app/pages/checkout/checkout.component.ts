import {Component} from '@angular/core';
import {TicketSummaryComponent} from '../../shared/ui/components/ticket-summary/ticket-summary.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  imports: [
    TicketSummaryComponent
  ],
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {

}
