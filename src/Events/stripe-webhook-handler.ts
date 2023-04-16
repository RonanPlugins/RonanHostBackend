import {query} from "../util/data/database.js"
import Stripe from 'stripe';
import StripeApiClient, { Customer } from "../util/external/clients/stripe-api-client.js";
import CustomerRepository from "../repositories/UserRepository.js";

const stripe =new Stripe(process.env.STRIPE_API_KEY, {apiVersion: "2022-11-15"})

import dotenv from "dotenv"
dotenv.config()
import Pterodactyl, {Server, ServerFeatureLimits, ServerLimits} from '@avionrx/pterodactyl-js';
import {findAvailableNode} from "../util/nodes/NodeAllocator.js";
import NotFoundError from "../Error/NotFoundError.js";
import e from "express";
import * as process from "process";

const pteroClient = new Pterodactyl.Builder()
    .setURL(process.env.PTERODACTYL_BASE_URL)
    .setAPIKey(process.env.PTERODACTYL_API_KEY)
    .asAdmin();

const stripeApi = new StripeApiClient(process.env.STRIPE_API_KEY)
const customerApi = new CustomerRepository()

export async function handleWebhook(request, response) {
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_SIGNING_SECRET);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'customer.subscription.updated': {
            try {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;
                const customer = await stripe.customers.retrieve(customerId);

                // Get the customer's information from your database using their Stripe customer ID
                const stripeCustomer = await stripeApi.getCustomer(customer.id);
                const customerObj = await customerApi.fetchOne(customer.id).catch(e => {return e});
                const pteroUser = await pteroClient.getUser(String(customerObj.pterodactyl_user_id));

                const servers = (await pteroClient.getServers()).filter(server => server.user === pteroUser.id);

                console.log(subscription.metadata.servers)
                const serverFiltered = servers.filter(server => server.id === parseInt(JSON.parse(subscription.metadata.servers)));

                for (const server of serverFiltered) {
                    const serFu:Pterodactyl.Server = await pteroClient.getServer(String(server.id))

                    const product = subscription.items.data[0];
                    const plan = product.metadata

                    const availableNodes = await findAvailableNode(pteroClient, plan.memory)
// Update server feature limits
                    const featureLimits: ServerFeatureLimits = {
                        databases: Number(plan.databases),
                        allocations: Number(plan.allocations),
                        backups: Number(plan.backups),
                        split_limit: Number(plan.splits)
                    };
                    await serFu.setAllocationAmount(featureLimits.allocations);
                    await serFu.setDatabaseAmount(featureLimits.databases);
                    await serFu.setBackupsAmount(featureLimits.backups);
                    await serFu.setSplit_limitAmount(featureLimits.split_limit)

                    const updatedLimits: ServerLimits = {
                        cpu: Number(plan.cpu),
                        disk: Number(plan.disk),
                        io: Number(plan.io),
                        memory: Number(plan.memory),
                        swap: Number(plan.swap),
                    }

                    await serFu.setCPU(updatedLimits.cpu);
                    await serFu.setDisk(updatedLimits.disk);
                    await serFu.setIO(updatedLimits.io);
                    await serFu.setMemory(updatedLimits.memory);
                    await serFu.setSwap(updatedLimits.swap);
                }
            } catch (e)  {console.error(e)}

            break;
        }
        case 'customer.subscription.deleted': {
            try {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;
                const customer = await stripe.customers.retrieve(customerId);

                // Get the customer's information from your database using their Stripe customer ID
                const stripeCustomer = await stripeApi.getCustomer(customer.id);
                const customerObj = await customerApi.fetchOne(customer.id);
                const pteroUser = await pteroClient.getUser(String(customerObj.pterodactyl_user_id));

                const servers = (await pteroClient.getServers()).filter(server => server.user === pteroUser.id);

                const serverFiltered = servers.filter(server => JSON.parse(subscription.metadata.servers).includes(server.id));
                console.log(serverFiltered)
                for (const server of serverFiltered) {
                    const serFu = await pteroClient.getServer(String(server.id))
                    await serFu.delete().catch(e => {
                        console.log(e)
                    })
                }
            } catch (e) {console.error(e)}
            break;
        }
        case 'invoice.payment_failed': {
            try {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;
                const customer = await stripe.customers.retrieve(customerId);

                // Get the customer's information from your database using their Stripe customer ID
                const stripeCustomer = await stripeApi.getCustomer(customer.id);
                const customerObj = await customerApi.fetchOne(customer.id);
                const pteroUser = await pteroClient.getUser(String(customerObj.pterodactyl_user_id));

                const servers = (await pteroClient.getServers()).filter(server => server.user === pteroUser.id);

                const serverFiltered = servers.filter(server => JSON.parse(subscription.metadata.servers).includes(server.id));
                console.log(serverFiltered)
                for (const server of serverFiltered) {
                    const serFu = await pteroClient.getServer(String(server.id))
                    await serFu.suspend().catch(e => {
                        console.log(e)
                    })
                }
            } catch (e) {console.error(e)}
            break;
        }
        case 'customer.subscription.created': {
            console.log(1)
            const subServers:number[] = [];
            try {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;
                const customer = await stripe.customers.retrieve(customerId);
                console.log(2)
                // Get customer information from a database using Stripe customer ID
                const stripeCustomer = await stripeApi.getCustomer(customer.id);
                const customerObj = await customerApi.fetchOne(customer.id);
                const pteroUser = await pteroClient.getUser(String(customerObj.pterodactyl_user_id));
                console.log(3)
                // Loop through subscription items and create a server for each
                for (const item of subscription.items.data) {
                    for (let i = 0; i < item.quantity; i++) {
                        // @ts-ignore
                        const prodct = await stripe.products.retrieve(item.plan.product)
                        const metadata = prodct.metadata;
                        console.log(4)
                        const plan = metadata
                        console.log(plan)
                        const nId = (await findAvailableNode(pteroClient, Number(plan.memory)))[0]
                        console.log(nId, plan.memory, pteroClient, await findAvailableNode(pteroClient, Number(plan.memory)))
                        const node: Pterodactyl.Node = await pteroClient.getNode(String(nId))
                            .catch(e => {
                                console.error(e)
                            return undefined;
                        })
                        console.log(node)
                        if (!node) return response.status(500).json({status: 'canceled'});
                        // Create a new server using Pterodactyl API
                        const availableAllocations = (await node.getAllocations())
                            .filter(allocation => allocation.assigned === false)
                            .slice(0, Number(plan.allocations) + 1);

                        const defaultAllocation = availableAllocations[0];
                        const additionalAllocations = availableAllocations.slice(1, Number(plan.allocations) + 1)
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
                                memory: Number(plan.memory),
                                swap: Number(plan.swap),
                                disk: Number(plan.disk),
                                io: Number(plan.io),
                                cpu: Number(plan.cpu)
                            },
                            featureLimits: {
                                allocations: Number(plan.allocations),
                                databases: Number(plan.databases),
                                backups: Number(plan.backups),
                                split_limit: Number(plan.splits)
                            },
                            //@ts-ignore
                            allocation: {
                                default: defaultAllocation.id,
                                additional: additionalAllocations
                            }
                        }).catch(e => {
                            console.error(e)
                        });

                        if (newServer instanceof Server) {
                            subServers.push(newServer.id)
                            console.log(`New server created with id` + newServer.id);
                        } else {
                            console.error("newServer ain't instanceof Server cuz")
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
            } catch (e) {
                console.error(e)
            }

            break;
        }


        // Handle other event types as necessary
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }
}