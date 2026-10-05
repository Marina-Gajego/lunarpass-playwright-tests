import { Pool } from 'pg'
import { Kysely, PostgresDialect, CamelCasePlugin } from 'kysely'
import { Mission, Reservation, Ticket } from './missionData'

interface Database {
    missions: Mission,
    reservations: Reservation,
    tickets: Ticket
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL não definida. Copie .env.example para .env e preencha a conexão do banco.');
}

const dialect = new PostgresDialect({
    pool: new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10_000,
    })
})

export const db = new Kysely<Database>({
    dialect,
    plugins: [new CamelCasePlugin()]
})

export async function insertMission(mission: Mission){
    await db
    .insertInto('missions')
    .values(mission)
    .execute()
}

export async function deleteMission(id: string){
    await db
        .deleteFrom('missions')
        .where('id', '=', id)
        .execute()
}

export async function deleteReservation(missionId: string){
    await db
        .deleteFrom('reservations')
        .where('missionId', '=', missionId)
        .execute()
}

export async function deleteTicket(missionId: string){
    await db
        .deleteFrom('tickets')
        .where('missionId', '=', missionId)
        .execute()
}

export async function selectMission(missionId: string) {
    return await db
        .selectFrom('missions')
        .selectAll()
        .where('id', '=', missionId)
        .execute()
}

export async function cleanMission(id: string){
    await Promise.all([
        deleteReservation(id),
        deleteTicket(id),
    ]);
    await deleteMission(id);
}

export async function cleanAndInsertMission(mission: Mission){
    await cleanMission(mission.id);
    await insertMission(mission);
}