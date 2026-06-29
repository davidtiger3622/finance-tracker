from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from database import get_db
from models import User, Transaction, TransactionType
from auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/summary")
def get_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    total_income = sum(t.amount for t in transactions if t.type == TransactionType.income)
    total_expenses = sum(t.amount for t in transactions if t.type == TransactionType.expense)
    balance = total_income - total_expenses
    savings_rate = (balance / total_income * 100) if total_income > 0 else 0
    return {
        "total_income": round(total_income, 2),
        "total_expenses": round(total_expenses, 2),
        "balance": round(balance, 2),
        "savings_rate": round(savings_rate, 2)
    }


@router.get("/category-breakdown")
def get_category_breakdown(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    results = db.query(Transaction.category, func.sum(Transaction.amount).label("total")).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == TransactionType.expense
    ).group_by(Transaction.category).all()
    return [{"category": r.category, "total": round(r.total, 2)} for r in results]


@router.get("/monthly-trends")
def get_monthly_trends(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    results = db.query(
        extract("year", Transaction.date).label("year"),
        extract("month", Transaction.date).label("month"),
        Transaction.type,
        func.sum(Transaction.amount).label("total")
    ).filter(Transaction.user_id == current_user.id).group_by("year", "month", Transaction.type).order_by("year", "month").all()

    trends = {}
    for r in results:
        key = f"{int(r.year)}-{int(r.month):02d}"
        if key not in trends:
            trends[key] = {"month": key, "income": 0, "expenses": 0}
        if r.type == TransactionType.income:
            trends[key]["income"] = round(r.total, 2)
        else:
            trends[key]["expenses"] = round(r.total, 2)

    return list(trends.values())


@router.get("/spending-insights")
def get_spending_insights(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    current_month = datetime.now().month
    current_year = datetime.now().year

    this_month = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == TransactionType.expense,
        extract("month", Transaction.date) == current_month,
        extract("year", Transaction.date) == current_year
    ).scalar() or 0

    last_month = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == TransactionType.expense,
        extract("month", Transaction.date) == (current_month - 1 if current_month > 1 else 12),
        extract("year", Transaction.date) == (current_year if current_month > 1 else current_year - 1)
    ).scalar() or 0

    change = ((this_month - last_month) / last_month * 100) if last_month > 0 else 0

    return {
        "this_month_expenses": round(this_month, 2),
        "last_month_expenses": round(last_month, 2),
        "month_over_month_change": round(change, 2),
        "trend": "up" if change > 0 else "down" if change < 0 else "stable"
    }
