import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import classes from "./AddExpenseForm.module.css";
import AuthContext from "../../Store/AuthContext";
import { addExpense, removeExpense, setExpenses, activatePremium } from "../../Store/store/expenseSlice";

const FIREBASE_DB_URL = "https://expense-tracker-ebc34-default-rtdb.firebaseio.com";

const AddExpenseForm = () => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Entertainment");
  const [customCategory, setCustomCategory] = useState(""); // New state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const expenses = useSelector((state) => state.expenses.items);
  const showPremiumButton = useSelector((state) => state.expenses.showPremiumButton);
  const isPremiumActivated = useSelector((state) => state.expenses.isPremiumActivated);
  const darkMode = useSelector((state) => state.theme.darkMode);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!authCtx.isLoggedIn || !authCtx.userId) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${FIREBASE_DB_URL}/users/${authCtx.userId}/expenses.json?auth=${authCtx.token}`
        );

        if (!response.ok) throw new Error("Failed to fetch expenses.");

        const data = await response.json();
        const loadedExpenses = [];

        if (data) {
          for (const key in data) {
            loadedExpenses.push({
              id: key,
              amount: +data[key].amount,
              description: data[key].description,
              category: data[key].category,
              date: data[key].date || new Date().toISOString(),
            });
          }
          loadedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        dispatch(setExpenses(loadedExpenses));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, [authCtx.token, authCtx.isLoggedIn, authCtx.userId, dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!authCtx.isLoggedIn || !authCtx.userId) {
      setError("Please login to add expenses");
      return;
    }

    const finalCategory = category === "Other" ? customCategory.trim() || "Other" : category;

    const expenseData = {
      amount: +amount,
      description,
      category: finalCategory,
      date: new Date().toISOString(),
    };

    setIsLoading(true);
    setError(null);
    try {
      if (editingExpense) {
        const response = await fetch(
          `${FIREBASE_DB_URL}/users/${authCtx.userId}/expenses/${editingExpense.id}.json?auth=${authCtx.token}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expenseData),
          }
        );
        if (!response.ok) throw new Error("Failed to update expense.");

        dispatch(setExpenses(
          expenses.map((exp) =>
            exp.id === editingExpense.id ? { ...exp, ...expenseData } : exp
          )
        ));
        setEditingExpense(null);
      } else {
        const response = await fetch(
          `${FIREBASE_DB_URL}/users/${authCtx.userId}/expenses.json?auth=${authCtx.token}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expenseData),
          }
        );
        if (!response.ok) throw new Error("Failed to add expense.");

        const data = await response.json();
        const newExpense = { id: data.name, ...expenseData };
        dispatch(addExpense(newExpense));
      }

      setAmount("");
      setDescription("");
      setCategory("Entertainment");
      setCustomCategory(""); // Reset custom category
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExpenseHandler = async (expenseId) => {
    if (!authCtx.isLoggedIn || !authCtx.userId) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${FIREBASE_DB_URL}/users/${authCtx.userId}/expenses/${expenseId}.json?auth=${authCtx.token}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete expense.");

      dispatch(removeExpense(expenseId));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditingHandler = (expense) => {
    setEditingExpense(expense);
    setAmount(expense.amount);
    setDescription(expense.description);
    setCategory(expense.category);
    if (expense.category === "Other") {
      setCustomCategory(""); // Let user input new category
    }
  };

  const cancelEditingHandler = () => {
    setEditingExpense(null);
    setAmount("");
    setDescription("");
    setCategory("Entertainment");
    setCustomCategory("");
  };

  const downloadExpensesCSV = () => {
    const csvContent = [
      "Amount,Description,Category,Date",
      ...expenses.map(exp => 
        `"${exp.amount}","${exp.description}","${exp.category}","${new Date(exp.date).toLocaleDateString()}"`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "expenses.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const backHandler = () => navigate("/");

  return (
    <div className={`${classes.expenseContainer} ${darkMode ? classes.dark : ''}`}>
      <h2>{editingExpense ? "Edit Expense" : "Add Daily Expenses"}</h2>

      <form onSubmit={submitHandler} className={classes.form}>
        <input
          type="number"
          placeholder="Amount"
          required
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Entertainment">Entertainment</option>
          <option value="Fitness">Fitness</option>
          <option value="Food">Food</option>
          <option value="Groceries">Groceries</option>
          <option value="Medicines">Medicines</option>
          <option value="Rent">Rent</option>
          <option value="Shopping">Shopping</option>
          <option value="Transportation">Transportation</option>
          <option value="Other">Other</option>
        </select>

        {category === "Other" && (
          <input
            type="text"
            placeholder="Enter custom category"
            required
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />
        )}

        <div className={classes.formActions}>
          <button type="submit" disabled={isLoading}>
            {isLoading
              ? editingExpense
                ? "Updating..."
                : "Adding..."
              : editingExpense
              ? "Update Expense"
              : "Add Expense"}
          </button>
          {editingExpense && (
            <button
              type="button"
              onClick={cancelEditingHandler}
              className={classes.cancelButton}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {showPremiumButton && (
        <button 
          onClick={() => dispatch(activatePremium())}
          className={classes.premiumButton}
        >
          Activate Premium
        </button>
      )}

      {isPremiumActivated && (
        <div className={classes.premiumFeatures}>
          <button 
            onClick={downloadExpensesCSV}
            className={classes.downloadButton}
          >
            Download Expenses
          </button>
        </div>
      )}

      {isLoading && <p>Loading...</p>}
      {error && <p className={classes.error}>{error}</p>}

      {expenses.length > 0 ? (
        <div className={classes.expenseList}>
          <h3>Your Expenses</h3>
          <ul>
            {expenses.map((exp) => (
              <li key={exp.id}>
                <div className={classes.expenseDetails}>
                  <span className={classes.amount}>₹{exp.amount}</span>
                  <span className={classes.description}>{exp.description}</span>
                  <span className={classes.categoryBadge}>{exp.category}</span>
                  <span className={classes.date}>
                    {new Date(exp.date).toLocaleDateString()}
                  </span>
                </div>
                <div className={classes.expenseActions}>
                  <button
                    onClick={() => startEditingHandler(exp)}
                    className={classes.editButton}
                    disabled={isLoading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteExpenseHandler(exp.id)}
                    className={classes.deleteButton}
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !isLoading && (
          <p className={classes.noExpenses}>No expenses found. Add your first expense!</p>
        )
      )}

      <button onClick={backHandler} className={classes.backButton}>
        Back To Home
      </button>
    </div>
  );
};

export default AddExpenseForm;