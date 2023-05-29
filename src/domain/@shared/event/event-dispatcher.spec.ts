import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerChangeAddressEvent from "../../customer/event/customer-change-address.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import EnviaConsoleLogWhenCustomerChangeAddressHandler from "../../customer/event/handler/envia-console-log-when-customer-change-address.handler";
import EnviaConsoleLogWhenCustomerIsCreatedHandler from "../../customer/event/handler/envia-console-log-when-customer-is-created.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";
import { Sequelize } from "sequelize-typescript";

describe("Domain events tests", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([CustomerModel]);
      await sequelize.sync();
    });
  
    afterEach(async () => {
      await sequelize.close();
    });

    it("Should register an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    });

    it("Should unregister an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        
        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
    });

    it("Should unregister all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        
        eventDispatcher.unregisterAll();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
    });
    
    it("Should notify all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        
        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 10.0,
        });

        //Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado.
        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();        
    });
    
    it("Should notify an event handler when customer is created", async () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLogWhenCustomerIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);
        
        const customerCreatedEvent = new CustomerCreatedEvent({
            name: "Customer 1",
            description: "Customer 1 description",
            price: 10.0,
        });

        //Quando o notify for executado o EnviaConsoleLogWhenCustomerIsCreatedHandler.handle() deve ser chamado.
        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();        
    });

    
    it("Should notify an event handler when customer change address", async () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLogWhenCustomerIsCreatedHandler();
        const eventHandlerChangeAddress = new EnviaConsoleLogWhenCustomerChangeAddressHandler();
        const spyEventHandler = jest.spyOn(eventHandlerChangeAddress, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);
        
        const customerCreatedEvent = new CustomerCreatedEvent({
            id: 1,
            name: "Customer 1",
            description: "Customer 1 description",
            price: 10.0,
            address: {
                    street: 'Rua 1',
                    number: '1',
                    zip: '01010-000',
                    city: 'SP',
            },
        });
        
        eventDispatcher.register("CustomerChangeAddressEvent", eventHandlerChangeAddress);
        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]).toMatchObject(eventHandlerChangeAddress);

        const customerChangeAddressEvent = new CustomerChangeAddressEvent({
            id: 1,
            name: "Customer 1",
            description: "Customer 1 description",
            price: 10.0,
            address: {
                    street: 'Rua João',
                    number: '21',
                    zip: '01010-000',
                    city: 'Minas',
            },
        });

        //Quando o notify for executado o export default class EnviaConsoleLogWhenCustomerChangeAddressHandler.handle() deve ser chamado.
        eventDispatcher.notify(customerChangeAddressEvent);

        expect(spyEventHandler).toHaveBeenCalled();        
    });
});