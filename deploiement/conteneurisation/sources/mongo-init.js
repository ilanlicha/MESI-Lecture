db.createUser({
    user: 'root',
    pwd: 'root',
    roles: [
        {
            role: 'readWrite',
            db: 'applications',
        },
    ],
});

db = new Mongo().getDB("applications");

db.createCollection('application', { capped: false });
