import EventHandlerInterface from '../../@shared/event-handler.interface';
import CustomerCreatedEvent from '../customer-created.event';
import Address from '../../../entity/address';

export default class EnviaConsoleLogWhenCustomerChangeAddressHandler implements EventHandlerInterface<CustomerCreatedEvent> {
    
    handle(event: CustomerCreatedEvent): void {
        console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: Street: ${event.eventData.address.street}, ${event.eventData.address.number}, zip code: ${event.eventData.address.zip}, city: ${event.eventData.address.city}`);
    }

}