import { Kafka, Producer } from "kafkajs";
import prismaClient from "./prisma";

const kafka = new Kafka({
    brokers: ["localhost:9092"],
    // No SSL or SASL needed for local development
});

let producer: null | Producer = null;

export async function createProducer() {
    if (producer) return producer;

    const _producer = kafka.producer();
    await _producer.connect();
    producer = _producer;
    return producer;
}

export async function produceMessage(message: string) {
    const producer = await createProducer();
    await producer.send({
        messages: [{ key: `message-${Date.now()}`, value: message }],
        topic: "MESSAGES",
    });
    return true;
}

export async function startMessageConsumer() {
    console.log("Consumer is running..");
    const consumer = kafka.consumer({ groupId: "default" });
    await consumer.connect();

    // Create the topic if it doesn't exist
    try {
        const admin = kafka.admin();
        await admin.connect();
        await admin.createTopics({
            topics: [{ topic: "MESSAGES", numPartitions: 1, replicationFactor: 1 }],
        });
        await admin.disconnect();
    } catch (error) {
        console.log("Topic might already exist:", error);
    }

    await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

    await consumer.run({
        autoCommit: true,
        eachMessage: async ({ message, pause }) => {
            if (!message.value) return;
            console.log(`New Message Recv..`);
            try {
                await prismaClient.message.create({
                    data: {
                        text: message.value?.toString(),
                    },
                });
            } catch (err) {
                console.log("Something is wrong", err);
                pause();
                setTimeout(() => {
                    consumer.resume([{ topic: "MESSAGES" }]);
                }, 60 * 1000);
            }
        },
    });
}
export default kafka;