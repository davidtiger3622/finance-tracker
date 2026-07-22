from datetime import datetime, timedelta


def _create_transaction(client, auth_headers, title, amount, type_, category, date=None):
    payload = {"title": title, "amount": amount, "type": type_, "category": category}
    if date:
        payload["date"] = date.isoformat()
    return client.post("/transactions/", json=payload, headers=auth_headers)


def test_summary_with_no_transactions(client, auth_headers):
    response = client.get("/analytics/summary", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_income"] == 0
    assert data["total_expenses"] == 0
    assert data["balance"] == 0
    assert data["savings_rate"] == 0


def test_summary_calculates_correctly(client, auth_headers):
    _create_transaction(client, auth_headers, "Salary", 2000, "income", "Work")
    _create_transaction(client, auth_headers, "Rent", 500, "expense", "Housing")
    _create_transaction(client, auth_headers, "Groceries", 300, "expense", "Food")

    response = client.get("/analytics/summary", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_income"] == 2000
    assert data["total_expenses"] == 800
    assert data["balance"] == 1200
    assert data["savings_rate"] == 60.0


def test_category_breakdown(client, auth_headers):
    _create_transaction(client, auth_headers, "Rent", 500, "expense", "Housing")
    _create_transaction(client, auth_headers, "Groceries", 200, "expense", "Food")
    _create_transaction(client, auth_headers, "Snacks", 50, "expense", "Food")
    _create_transaction(client, auth_headers, "Salary", 2000, "income", "Work")

    response = client.get("/analytics/category-breakdown", headers=auth_headers)
    assert response.status_code == 200
    data = {row["category"]: row["total"] for row in response.json()}
    assert data["Housing"] == 500
    assert data["Food"] == 250
    assert "Work" not in data  # income excluded from expense breakdown


def test_monthly_trends(client, auth_headers):
    this_month = datetime.now().replace(day=1)
    _create_transaction(client, auth_headers, "Salary", 1000, "income", "Work", date=this_month)
    _create_transaction(client, auth_headers, "Bills", 300, "expense", "Utilities", date=this_month)

    response = client.get("/analytics/monthly-trends", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    key = this_month.strftime("%Y-%m")
    month_entry = next((m for m in data if m["month"] == key), None)
    assert month_entry is not None
    assert month_entry["income"] == 1000
    assert month_entry["expenses"] == 300


def test_spending_insights_trend_up(client, auth_headers):
    now = datetime.now()
    this_month_date = now.replace(day=1)
    last_month_date = (this_month_date - timedelta(days=1)).replace(day=1)

    _create_transaction(client, auth_headers, "Last month expense", 100, "expense", "Misc", date=last_month_date)
    _create_transaction(client, auth_headers, "This month expense", 300, "expense", "Misc", date=this_month_date)

    response = client.get("/analytics/spending-insights", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["this_month_expenses"] == 300
    assert data["last_month_expenses"] == 100
    assert data["trend"] == "up"


def test_analytics_requires_auth(client):
    response = client.get("/analytics/summary")
    assert response.status_code == 401
