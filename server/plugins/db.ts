import postgres from "postgres";

export default defineNitroPlugin((nitroApp) => {
	const config = useRuntimeConfig();

	console.log("Creating postgres");

	const sql = postgres({
		host: "127.0.0.1",
		port: 5432,
		database: "operastic-database",
		username: config.sqlUsername,
		password: config.sqlPassword
	});
	console.log(sql)

	return sql
})
