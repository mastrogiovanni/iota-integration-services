import { Client } from './lib/client';
import { Manager } from './lib/manager';

async function bootstrap() {

    try {

        let manager = new Manager(
            "mongodb://admin:admin@localhost:27017/admin?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false", 
            "PpKFhPKJY2efTsN9VkB7WNtYUhX9Utaa"
        );

        let rootId = await manager.getRootIdentity();

        console.log("Root Identity", rootId)

        let api = new Client("94F5BA49-12B6-4E45-A487-BF91C442276D", "http://localhost:3000");

        // Became root identity
        await api.authorize(rootId);

        // Get information about root identity
        let rootIdentity = await api.identityFind(rootId?.doc?.id);

        // Dump Root Identity Credentials
        console.log("Root Identity Credentials", rootIdentity.verifiableCredentials);

        // Get first credential
        let identityCredential = rootIdentity.verifiableCredentials[0];

        // Create identity for tester
        let userIdentity = await api.identityCreate("tester user", {
            name: "Tester",
            suername: "User"
        })

        console.log("Tester Identity", userIdentity);

        // Assign a verifiable credential to the tester as rootIdentity
        let vc = await api.createCredential(identityCredential, userIdentity?.doc?.id, {
            profession: "Professor"
        });

        console.log("Tester Verifiable Credential");

        // Verify the credential issued
        let verified = await api.credentialVerify(vc) 
        console.log("Verification result", verified);

    }
    catch (e: any) {
        console.log(e.message);
    }

}

bootstrap();
