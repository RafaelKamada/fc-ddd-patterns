
import EventHandlerInterface from '../../../@shared/event/event-handler.interface';
import CustomerCreatedEvent from '../customer-created.event';

export default class EnviaConsoleLogWhenCustomerChangeAddressHandler implements EventHandlerInterface<CustomerCreatedEvent> {
    
    handle(event: CustomerCreatedEvent): void {
        console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: Street: ${event.eventData.address.street}, ${event.eventData.address.number}, zip code: ${event.eventData.address.zip}, city: ${event.eventData.address.city}`);
    }

}