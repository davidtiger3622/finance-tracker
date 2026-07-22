def test_create_transaction(client, auth_headers):
    response = client.post(
        "/transactions/",
        json={
            "title": "Groceries",
            "amount": 45.50,
            "type": "expense",
            "category": "Food",
        },
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Groceries"
    assert data["amount"] == 45.50
    assert data["type"] == "expense"


def test_create_transaction_requires_auth(client):
    response = client.post(
        "/transactions/",
        json={"title": "Groceries", "amount": 45.50, "type": "expense", "category": "Food"},
    )
    assert response.status_code == 401


def test_get_transactions_list(client, auth_headers):
    client.post(
        "/transactions/",
        json={"title": "Salary", "amount": 3000, "type": "income", "category": "Work"},
        headers=auth_headers,
    )
    response = client.get("/transactions/", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) >= 1


def test_get_transactions_filtered_by_category(client, auth_headers):
    client.post(
        "/transactions/",
        json={"title": "Rent", "amount": 800, "type": "expense", "category": "Housing"},
        headers=auth_headers,
    )
    response = client.get("/transactions/?category=Housing", headers=auth_headers)
    assert response.status_code == 200
    assert all(t["category"] == "Housing" for t in response.json())


def test_get_single_transaction(client, auth_headers):
    create_resp = client.post(
        "/transactions/",
        json={"title": "Coffee", "amount": 5, "type": "expense", "category": "Food"},
        headers=auth_headers,
    )
    transaction_id = create_resp.json()["id"]
    response = client.get(f"/transactions/{transaction_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["title"] == "Coffee"


def test_get_nonexistent_transaction(client, auth_headers):
    response = client.get("/transactions/999999", headers=auth_headers)
    assert response.status_code == 404


def test_update_transaction(client, auth_headers):
    create_resp = client.post(
        "/transactions/",
        json={"title": "Old title", "amount": 20, "type": "expense", "category": "Misc"},
        headers=auth_headers,
    )
    transaction_id = create_resp.json()["id"]
    response = client.put(
        f"/transactions/{transaction_id}",
        json={"title": "New title"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["title"] == "New title"


def test_delete_transaction(client, auth_headers):
    create_resp = client.post(
        "/transactions/",
        json={"title": "To delete", "amount": 10, "type": "expense", "category": "Misc"},
        headers=auth_headers,
    )
    transaction_id = create_resp.json()["id"]
    delete_resp = client.delete(f"/transactions/{transaction_id}", headers=auth_headers)
    assert delete_resp.status_code == 200

    get_resp = client.get(f"/transactions/{transaction_id}", headers=auth_headers)
    assert get_resp.status_code == 404


def test_cannot_access_another_users_transaction(client):
    client.post(
        "/auth/register",
        json={"username": "userA", "email": "userA@example.com", "password": "passwordA"},
    )
    login_a = client.post("/auth/login", data={"username": "userA", "password": "passwordA"})
    headers_a = {"Authorization": f"Bearer {login_a.json()['access_token']}"}

    create_resp = client.post(
        "/transactions/",
        json={"title": "UserA's txn", "amount": 100, "type": "income", "category": "Work"},
        headers=headers_a,
    )
    transaction_id = create_resp.json()["id"]

    client.post(
        "/auth/register",
        json={"username": "userB", "email": "userB@example.com", "password": "passwordB"},
    )
    login_b = client.post("/auth/login", data={"username": "userB", "password": "passwordB"})
    headers_b = {"Authorization": f"Bearer {login_b.json()['access_token']}"}

    response = client.get(f"/transactions/{transaction_id}", headers=headers_b)
    assert response.status_code == 404
