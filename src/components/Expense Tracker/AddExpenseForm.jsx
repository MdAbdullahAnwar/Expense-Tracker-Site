import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate instead of useHistory
import classes from "./AddExpenseForm.module.css";

const AddExpenseForm = () => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");

  const navigate = useNavigate(); // Initialize useNavigate

  const submitHandler = (e) => {
    e.preventDefault();

    const newExpense = {
      id: Math.random().toString(),
      amount,
      description,
      category,
    };

    setExpenses((prev) => [...prev, newExpense]);

    // Clear form
    setAmount("");
    setDescription("");
    setCategory("Food");
  };

  const backHandler = () => {
    navigate("/"); // Redirect to Home page
  };

  return (
    <div className={classes.expenseContainer}>
      <h2>Add Daily Expenses</h2>
      <form onSubmit={submitHandler} className={classes.form}>
        <input
          type="number"
          placeholder="Amount"
          required
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
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Entertainment">Entertainment</option>
          <option value="Fitness">Fitness</option>
          <option value="Groceries">Groceries</option>
          <option value="Medicines">Medicines</option>
          <option value="Rent">Rent</option>
          <option value="Shopping">Shopping</option>
          <option value="Transportation">Transportation</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit">Add Expense</button>
      </form>

      {expenses.length > 0 && (
        <div className={classes.expenseList}>
          <h3>Expenses</h3>
          <ul>
            {expenses.map((exp) => (
              <li key={exp.id}>
                ₹{exp.amount} - {exp.description} [{exp.category}]
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={backHandler} className={classes.backButton}>
        Back to Home
      </button>
    </div>
  );
};

export default AddExpenseForm;
