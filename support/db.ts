import { Pool } from 'pg'
import { Kysely, PostgresDialect, CamelCasePlugin } from 'kysely'
import { Mission, Reservation, Ticket } from './missionData'

interface Database {
    missions: Mission,
    reservations: Reservation,
    tickets: Ticket
}

const connectionString =
    process.env.DATABASE_URL ??
    'postgresql://postgres.jjblbujzbpnoafiqjxzm:XauDmoKIFKHfT6SJ@aws-0-us-east-2.pooler.supabase.com:5432/postgres';

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

export async function cleanAndInsertMission(mission: Mission){
    await Promise.all([
        deleteReservation(mission.id),
        deleteTicket(mission.id),
    ]);
    await deleteMission(mission.id);
    await insertMission(mission);
}