def test_register_new_user(client):
    response = client.post(
        "/auth/register",
        json={
            "username": "testuser1",
            "email": "testuser1@example.com",
            "password": "strongpassword123",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser1"
    assert data["email"] == "testuser1@example.com"
    assert "id" in data
    assert "hashed_password" not in data


def test_register_duplicate_email_or_username(client):
    client.post(
        "/auth/register",
        json={
            "username": "dupeuser",
            "email": "dupe@example.com",
            "password": "somepassword123",
        },
    )
    response = client.post(
        "/auth/register",
        json={
            "username": "dupeuser",
            "email": "dupe@example.com",
            "password": "somepassword123",
        },
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email or username already registered"


def test_login_success(client):
    client.post(
        "/auth/register",
        json={
            "username": "loginuser",
            "email": "loginuser@example.com",
            "password": "correcthorsebattery",
        },
    )
    response = client.post(
        "/auth/login",
        data={"username": "loginuser", "password": "correcthorsebattery"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client):
    client.post(
        "/auth/register",
        json={
            "username": "wrongpassuser",
            "email": "wrongpass@example.com",
            "password": "correctpassword",
        },
    )
    response = client.post(
        "/auth/login",
        data={"username": "wrongpassuser", "password": "incorrectpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username or password"


def test_login_nonexistent_user(client):
    response = client.post(
        "/auth/login",
        data={"username": "ghostuser", "password": "whatever"},
    )
    assert response.status_code == 401

def test_login_returns_refresh_token(client):
    client.post(
        "/auth/register",
        json={
            "username": "refreshuser",
            "email": "refreshuser@example.com",
            "password": "testpassword123",
        },
    )
    response = client.post(
        "/auth/login",
        data={"username": "refreshuser", "password": "testpassword123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "refresh_token" in data
    assert "access_token" in data


def test_refresh_issues_new_tokens(client):
    client.post(
        "/auth/register",
        json={
            "username": "refreshflowuser",
            "email": "refreshflowuser@example.com",
            "password": "testpassword123",
        },
    )
    login_resp = client.post(
        "/auth/login",
        data={"username": "refreshflowuser", "password": "testpassword123"},
    )
    old_refresh_token = login_resp.json()["refresh_token"]

    refresh_resp = client.post(
        "/auth/refresh",
        json={"refresh_token": old_refresh_token},
    )
    assert refresh_resp.status_code == 200
    data = refresh_resp.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["refresh_token"] != old_refresh_token


def test_refresh_with_used_token_fails(client):
    client.post(
        "/auth/register",
        json={
            "username": "rotationuser",
            "email": "rotationuser@example.com",
            "password": "testpassword123",
        },
    )
    login_resp = client.post(
        "/auth/login",
        data={"username": "rotationuser", "password": "testpassword123"},
    )
    old_refresh_token = login_resp.json()["refresh_token"]

    client.post("/auth/refresh", json={"refresh_token": old_refresh_token})

    second_attempt = client.post("/auth/refresh", json={"refresh_token": old_refresh_token})
    assert second_attempt.status_code == 401


def test_refresh_with_invalid_token_fails(client):
    response = client.post("/auth/refresh", json={"refresh_token": "totally-made-up-token"})
    assert response.status_code == 401


def test_logout_revokes_refresh_token(client):
    client.post(
        "/auth/register",
        json={
            "username": "logoutuser",
            "email": "logoutuser@example.com",
            "password": "testpassword123",
        },
    )
    login_resp = client.post(
        "/auth/login",
        data={"username": "logoutuser", "password": "testpassword123"},
    )
    refresh_token = login_resp.json()["refresh_token"]

    logout_resp = client.post("/auth/logout", json={"refresh_token": refresh_token})
    assert logout_resp.status_code == 200

    refresh_attempt = client.post("/auth/refresh", json={"refresh_token": refresh_token})
    assert refresh_attempt.status_code == 401
