import EventHandlerInterface from '../../../@shared/event/event-handler.interface';
import CustomerCreatedEvent from '../customer-created.event';

export default class EnviaConsoleLogWhenCustomerIsCreatedHandler implements EventHandlerInterface<CustomerCreatedEvent> {
    
    handle(event: CustomerCreatedEvent): void {
        this.handle1(event);
        this.handle2(event);
    }

    handle1(event: CustomerCreatedEvent): void {
        console.log(`Esse é o primeiro console.log do evento: CustomerCreated`);
    }

    handle2(event: CustomerCreatedEvent): void {
        console.log(`Esse é o segundo console.log do evento: CustomerCreated`);
    }
}