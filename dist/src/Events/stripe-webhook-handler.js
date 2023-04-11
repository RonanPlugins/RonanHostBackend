import { query } from "../util/data/database.js";
import Stripe from 'stripe';
import StripeApiClient from "../util/external/clients/stripe-api-client.js";
import CustomerRepository from "../repositories/UserRepository.js";
const stripe = new Stripe(process.env.STRIPE_API_KEY, { apiVersion: "2022-11-15" });
import dotenv from "dotenv";
dotenv.config();
import Pterodactyl, { Server } from '@avionrx/pterodactyl-js';
import { findAvailableNode } from "../util/nodes/NodeAllocator.js";
const pteroClient = new Pterodactyl.Builder()
    .setURL(process.env.PTERODACTYL_BASE_URL)
    .setAPIKey(process.env.PTERODACTYL_API_KEY)
    .asAdmin();
const stripeApi = new StripeApiClient(process.env.STRIPE_API_KEY);
const customerApi = new CustomerRepository();
export async function handleWebhook(request, response) {
    const sig = request.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, "whsec_1063964c9e532dfda4ea7eb183ba7cc5de299ea29313efbbeba29d5e46d7fa3e");
    }
    catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
    }
    switch (event.type) {
        case 'customer.subscription.updated': {
            const subscription = event.data.object;
            const customerId = subscription.customer;
            const customer = await stripe.customers.retrieve(customerId);
            // Get the customer's information from your database using their Stripe customer ID
            const stripeCustomer = await stripeApi.getCustomer(customer.id);
            const customerObj = await customerApi.fetchOne(customer.id).catch(e => { return e; });
            const pteroUser = await pteroClient.getUser(String(customerObj.pterodactyl_user_id));
            const servers = (await pteroClient.getServers()).filter(server => server.user === pteroUser.id);
            console.log(subscription.metadata.servers);
            const serverFiltered = servers.filter(server => server.id === parseInt(JSON.parse(subscription.metadata.servers)));
            for (const server of serverFiltered) {
                const serFu = await pteroClient.getServer(String(server.id));
                const productId = subscription.items.data[0].price.product;
                const plansFDB = await query('SELECT * FROM plan where stripe_product_id = ?', [productId]);
                const plan = plansFDB[0];
                const availableNodes = await findAvailableNode(pteroClient, plan.memory);
                // Update server feature limits
                const featureLimits = {
                    databases: plan.databases,
                    allocations: plan.allocations,
                    backups: plan.backups
                };
                await serFu.setAllocationAmount(featureLimits.allocations);
                await serFu.setDatabaseAmount(featureLimits.databases);
                await serFu.setBackupsAmount(featureLimits.backups);
                const updatedLimits = {
                    cpu: plan.cpu,
                    disk: plan.disk,
                    io: plan.io,
                    memory: plan.memory,
                    swap: plan.swap,
                };
                await serFu.setCPU(updatedLimits.cpu);
                await serFu.setDisk(updatedLimits.disk);
                await serFu.setIO(updatedLimits.io);
                await serFu.setMemory(updatedLimits.memory);
                await serFu.setSwap(updatedLimits.swap);
            }
            break;
        }
        case 'customer.subscription.deleted': {
            const subscription = event.data.object;
            const customerId = subscription.customer;
            const customer = await stripe.customers.retrieve(customerId);
            // Get the customer's information from your database using their Stripe customer ID
            const stripeCustomer = await stripeApi.getCustomer(customer.id);
            const customerObj = await customerApi.fetchOne(customer.id);
            const pteroUser = await pteroClient.getUser(String(customerObj.pterodactyl_user_id));
            const servers = (await pteroClient.getServers()).filter(server => server.user === pteroUser.id);
            const serverFiltered = servers.filter(server => JSON.parse(subscription.metadata.servers).includes(server.id));
            console.log(serverFiltered);
            for (const server of serverFiltered) {
                const serFu = await pteroClient.getServer(String(server.id));
                await serFu.suspend().catch(e => {
                    console.log(e);
                });
            }
            break;
        }
        case 'customer.subscription.created': {
            const subServers = [];
            try {
                const subscription = event.data.object;
                const customerId = subscription.customer;
                const customer = await stripe.customers.retrieve(customerId);
                // Get customer information from a database using Stripe customer ID
                const stripeCustomer = await stripeApi.getCustomer(customer.id);
                const customerObj = await customerApi.fetchOne(customer.id);
                const pteroUser = await pteroClient.getUser(String(customerObj.pterodactyl_user_id));
                // Loop through subscription items and create a server for each
                for (const item of subscription.items.data) {
                    for (let i = 0; i < item.quantity; i++) {
                        const productId = item.price.product;
                        const plansFDB = await query('SELECT * FROM plan where stripe_product_id = ?', [productId]);
                        const plan = plansFDB[0];
                        const node = await pteroClient.getNode(String((await findAvailableNode(pteroClient, plan.memory))[0]))
                            .catch(e => {
                            response.status(200).json({ status: 'canceled' });
                            return undefined;
                        });
                        if (!node)
                            return response.status(500).json({ status: 'canceled' });
                        // Create a new server using Pterodactyl API
                        const availableAllocations = (await node.getAllocations())
                            .filter(allocation => allocation.assigned === false)
                            .slice(0, plan.allocations + 1);
                        const defaultAllocation = availableAllocations[0];
                        const additionalAllocations = availableAllocations.slice(1, plan.allocations + 1)
                            .map(allocation => allocation.id);
                        const newServer = await pteroClient.createServer({
                            name: String(pteroUser.firstName) + "'s server",
                            user: pteroUser.id,
                            egg: 1,
                            image: "quay.io/pterodactyl/core:java",
                            startup: "java -Xmx{{SERVER_MEMORY}} -Xms{{SERVER_MEMORY}} -jar {{SERVER_JARFILE}} nogui",
                            environment: {
                                "BUNGEE_VERSION": "latest",
                                "SERVER_JARFILE": "server.jar"
                            },
                            limits: {
                                memory: plan.memory,
                                swap: plan.swap,
                                disk: plan.disk,
                                io: plan.io,
                                cpu: plan.cpu
                            },
                            featureLimits: {
                                allocations: plan.allocations,
                                databases: plan.databases,
                                backups: plan.backups
                            },
                            //@ts-ignore
                            allocation: {
                                default: defaultAllocation.id,
                                additional: additionalAllocations
                            }
                        }).catch(e => {
                            console.error(e);
                        });
                        if (newServer instanceof Server) {
                            subServers.push(newServer.id);
                            console.log(`New server created with id` + newServer.id);
                        }
                        else {
                            console.error("newServer ain't instanceof Server cuz");
                        }
                    }
                }
                await stripe.subscriptions.update(subscription.id, {
                    metadata: {
                        servers: JSON.stringify(subServers)
                    }
                }).catch(e => {
                    console.error(e);
                });
            }
            catch (e) {
                console.error(e);
            }
            break;
        }
        case 'customer.created': {
            const subscription = event.data.object;
            const customerId = subscription.customer;
            const customer = await stripe.customers.retrieve(customerId);
            const stripeCustomer = await stripeApi.getCustomer(customer.id);
            let customerA = await customerApi.fetchOne(stripeCustomer.id).catch(err => { return null; });
            if (!customerA) {
                // @ts-ignore
                customerA = await customerApi.createFromStripe(customer).catch(err => { return null; });
            }
            break;
        }
        // Handle other event types as necessary
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }
}
