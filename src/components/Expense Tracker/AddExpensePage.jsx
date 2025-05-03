import React from "react";
import AddExpenseForm from "./AddExpenseForm";
import styles from "./AddExpensePage.module.css";

const AddExpensePage = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Add Expenses</h2>
      <AddExpenseForm />
    </div>
  );
};

export default AddExpensePage;