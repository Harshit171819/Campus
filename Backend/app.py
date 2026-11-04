import os

from dotenv import load_dotenv
from flask import Flask, Response, jsonify, render_template, request
from postgrest import APIError
from supabase import Client, ClientOptions, create_client
from supabase_auth.errors import AuthError

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

app = Flask(
    __name__,
    template_folder="../Frontend",
    static_folder="../Frontend/static",
)

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_PUBLISHABLE_KEY")
if not supabase_url or not supabase_key:
    raise RuntimeError("SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY must be configured")

supabase: Client = create_client(supabase_url, supabase_key)


def authenticated_client() -> tuple[Client | None, str | None, tuple[Response, int] | None]:
    authorization = request.headers.get("Authorization", "")
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token.strip():
        return None, None, (jsonify(error="A Supabase Bearer token is required"), 401)

    client = create_client(
        supabase_url,
        supabase_key,
        options=ClientOptions(
            headers={"Authorization": f"Bearer {token.strip()}"},
            auto_refresh_token=False,
            persist_session=False,
        ),
    )
    try:
        response = client.auth.get_user(token.strip())
    except AuthError as error:
        status = getattr(error, "status", None)
        if status in (400, 401, 403, 404):
            return None, None, (jsonify(error="Invalid or expired access token"), 401)
        app.logger.warning("Supabase authentication failed: %s", error)
        return None, None, (jsonify(error="Authentication service unavailable"), 502)

    if response is None or response.user is None:
        return None, None, (jsonify(error="Invalid or expired access token"), 401)
    return client, response.user.id, None


def database_error(error: APIError) -> tuple[Response, int]:
    app.logger.error("Supabase database request failed: %s", error)
    return jsonify(error="Database request failed"), 500


@app.route("/")
def index():
    return render_template("index.html")


@app.get("/api/config")
def public_config():
    """Return the public Supabase client settings needed by the browser SDK."""
    return jsonify(supabase_url=supabase_url, supabase_publishable_key=supabase_key)


@app.get("/api/events")
def list_events():
    limit = request.args.get("limit", default=50, type=int)
    offset = request.args.get("offset", default=0, type=int)
    if limit is None or not 1 <= limit <= 100 or offset is None or offset < 0:
        return jsonify(error="limit must be 1-100 and offset must be non-negative"), 400

    try:
        response = (
            supabase.table("events")
            .select("*")
            .order("starts_at")
            .range(offset, offset + limit - 1)
            .execute()
        )
    except APIError as error:
        return database_error(error)
    return jsonify(response.data)


@app.get("/api/events/<event_id>")
def get_event(event_id: str):
    try:
        response = supabase.table("events").select("*").eq("id", event_id).execute()
    except APIError as error:
        return database_error(error)
    if not response.data:
        return jsonify(error="Event not found"), 404
    return jsonify(response.data[0])


@app.post("/api/registrations")
def create_registration():
    client, user_id, auth_error = authenticated_client()
    if auth_error:
        return auth_error

    body = request.get_json(silent=True)
    event_id = body.get("event_id") if isinstance(body, dict) else None
    if (
        isinstance(event_id, bool)
        or not isinstance(event_id, (str, int))
        or not str(event_id).strip()
    ):
        return jsonify(error="event_id is required"), 400

    try:
        event = client.table("events").select("id").eq("id", event_id).execute()
        if not event.data:
            return jsonify(error="Event not found"), 404
        response = (
            client.table("registrations")
            .insert({"event_id": event_id, "user_id": user_id})
            .select("*")
            .execute()
        )
    except APIError as error:
        if error.code == "23505":
            return jsonify(error="Already registered for this event"), 409
        return database_error(error)
    return jsonify(response.data[0]), 201


@app.get("/api/me/registrations")
def list_my_registrations():
    client, user_id, auth_error = authenticated_client()
    if auth_error:
        return auth_error

    try:
        response = (
            client.table("registrations")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )
    except APIError as error:
        return database_error(error)
    return jsonify(response.data)


@app.get("/api/events/<event_id>/registrations")
def list_event_registrations(event_id: str):
    client, user_id, auth_error = authenticated_client()
    if auth_error:
        return auth_error

    try:
        event = client.table("events").select("organizer_id").eq("id", event_id).execute()
        if not event.data:
            return jsonify(error="Event not found"), 404
        if event.data[0]["organizer_id"] != user_id:
            return jsonify(error="Only the event organizer can view registrations"), 403

        response = (
            client.table("registrations")
            .select("*")
            .eq("event_id", event_id)
            .execute()
        )
    except APIError as error:
        return database_error(error)
    return jsonify(response.data)


if __name__ == "__main__":
    app.run(debug=True)
