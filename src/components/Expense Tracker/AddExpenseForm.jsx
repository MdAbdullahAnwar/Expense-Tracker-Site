import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./AddExpenseForm.module.css";
import AuthContext from "../../Store/AuthContext";

const AddExpenseForm = () => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Entertainment");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const FIREBASE_DB_URL = "https://expense-tracker-ebc34-default-rtdb.firebaseio.com";

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
              amount: data[key].amount,
              description: data[key].description,
              category: data[key].category,
              date: data[key].date || new Date().toISOString(),
            });
          }
          // Sort by date (newest first)
          loadedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        
        setExpenses(loadedExpenses);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, [authCtx.token, authCtx.isLoggedIn, authCtx.userId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!authCtx.isLoggedIn || !authCtx.userId) {
      setError("Please login to add expenses");
      return;
    }

    const newExpense = {
      amount: +amount,
      description,
      category,
      date: new Date().toISOString(),
    };

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${FIREBASE_DB_URL}/users/${authCtx.userId}/expenses.json?auth=${authCtx.token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newExpense),
        }
      );
      
      if (!response.ok) throw new Error("Failed to add expense.");
      
      const data = await response.json();
      
      setExpenses(prev => [{
        id: data.name,
        ...newExpense
      }, ...prev]);
      
      setAmount("");
      setDescription("");
      setCategory("Entertainment");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  const backHandler = () => navigate("/");

  return (
    <div className={classes.expenseContainer}>
      <h2>Add Daily Expenses</h2>
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Expense"}
        </button>
      </form>

      {isLoading && <p>Loading...</p>}
      {error && <p className={classes.error}>{error}</p>}

      {expenses.length > 0 ? (
        <div className={classes.expenseList}>
          <h3>Your Expenses</h3>
          <ul>
            {expenses.map((exp) => (
              <li key={exp.id}>
                <span>
                  ₹{exp.amount} - {exp.description} [{exp.category}] 
                  ({new Date(exp.date).toLocaleDateString()})
                </span>

              </li>
            ))}
          </ul>
        </div>
      ) : (
        !isLoading && <p className={classes.noExpenses}>No expenses found. Add your first expense!</p>
      )}

      <button onClick={backHandler} className={classes.backButton}>
        Back to Home
      </button>
    </div>
  );
};

export default AddExpenseForm;