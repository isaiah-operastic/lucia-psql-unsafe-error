import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { SqliteError } from "better-sqlite3";

export default eventHandler(async (event) => {
	const formData = await readFormData(event);
	const username = formData.get("username");
	if (
		typeof username !== "string" ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
	) {
		throw createError({
			message: "Invalid username",
			statusCode: 400
		});
	}
	const password = formData.get("password");
	if (typeof password !== "string" || password.length < 6 || password.length > 255) {
		throw createError({
			message: "Invalid password",
			statusCode: 400
		});
	}

	const passwordHash = await hash(password, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
	const userId = generateIdFromEntropySize(10); // 16 characters long

	const session = await lucia.createSession(userId, {});
	appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
});
