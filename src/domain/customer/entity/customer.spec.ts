import Address from '../value-object/address';
import Customer from './customer';

describe("Customer unit tests", () => {
    
    it("should throw error when Id is empty", () => {
        expect(() => {
            let customer = new Customer("", "Jonh");
        }).toThrowError("Id is required");
    });
    
    it("should throw error when Name is empty", () => {
        expect(() => {
            let customer = new Customer("123", "");
        }).toThrowError("Name is required");
    });
    
    it("should change name", () => {
        
        const customer = new Customer("123", "John");
        customer.changeName("Jane");

        expect(customer.name).toBe("Jane");
    });

    it("should activate customer", () => {        
        const customer = new Customer("1", "Customer1");
        const address = new Address("Street 1", 123, "13330-250", "São Paulo");
        customer.Address = address;

        customer.activate();

        expect(customer.isActive()).toBe(true);
    });

    it("should deactivate customer", () => {        
        const customer = new Customer("1", "Customer1");
        
        customer.deactivate();

        expect(customer.isActive()).toBe(false);
    });
    
    it("should throw error whenn address is undefined when you activate a customer", () => {        
        
        expect(() => {
            const customer = new Customer("1", "Customer1");
            customer.activate();    
        }).toThrowError("Address is mandatory to activate a customer");
        
    });

    
    it("should add reward point ", () => {        
        const customer = new Customer("1", "Customer1");
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    });
});