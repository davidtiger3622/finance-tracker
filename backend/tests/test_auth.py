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
