import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { userContext } from "./UseContext"; 

const App = () => {
  const { user, setUser } = useContext(userContext); 
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({ mode: "onSubmit" });

  const method = watch("method"); 
  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
    setUser({ ...user, ...data }); 
    reset(); 
  };

  console.log("First Name (live):", watch("firstname")); // watch in real-time

  return (
    <>
      <h2>User Context: {user.name} ({user.email})</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* First Name */}
        <input
          {...register("firstname", {
            required: true,
            minLength: 2,
            maxLength: 10,
            pattern: {
              value: /^[A-Za-z]+$/i,
              message: "Only alphabets are allowed",
            },
          })}
          placeholder="Enter your first name"
        />
        <p>{errors.firstname?.type === "required" && "First name is required"}</p>
        <p>{errors.firstname?.type === "minLength" && "At least 2 characters required"}</p>
        <p>{errors.firstname?.type === "maxLength" && "At most 10 characters allowed"}</p>
        <p>{errors.firstname?.type === "pattern" && "Only alphabets are allowed"}</p>

        {/* Last Name */}
        <input
          {...register("lastname", {
            required: { value: true, message: "Last name is required" },
            minLength: { value: 2, message: "At least 2 characters" },
            maxLength: { value: 10, message: "At most 10 characters" },
            pattern: {
              value: /^[A-Za-z]+$/i,
              message: "Only alphabets are allowed",
            },
          })}
          placeholder="Enter your last name"
        />
        <p>{errors.lastname?.message}</p>

        <button type="submit">Submit</button>
      </form>

      {/* Contact Method */}
      <form>
        <label>Select The Method</label>
        <select {...register("method")}>
          <option value="">Select</option>
          <option value="method2">Method 2</option>
          <option value="method3">Method 3</option>
          <option value="method4">Method 4</option>
        </select>
      </form>

      {method === "method2" && <div>You selected Method 2</div>}
    </>
  );
};

export default App;
