import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const AuthSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Minimum 3 charecters are required!")
    .max(50, "Maximum 50 charecters are allowed!")
    .required("Name is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password is too long")
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
    //   "Password must contain at least 1 lowercase, 1 uppercase, 1 number and 1 special character"
    // )
    .required("Password is required"),
});

const Login = () =>
{

  const [serverError, setServerError] = useState('');

  const navigate = useNavigate();


  const initialValues = {
    name: "",
    password: ""
  };

  const submitForm = async (
    values,
    setSubmitting,
    resetForm,
    setServerError
  ) =>
  {
    try
    {
      const response = await axios.post(
        "http://localhost:5000/api/v1/register",
        {
          name: values.name,
          password: values.password,
        }
      );
      Cookies.set("tokenShine2023", response.data.token);
      setSubmitting(false);
      resetForm();
      navigate('/auth/form');
    } catch (error)
    {
      setServerError("Internal Server Error");
      setSubmitting(false);
    }
  };


  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <Formik
          initialValues={initialValues}
          validationSchema={AuthSchema}
          onSubmit={(values, { setSubmitting, resetForm }) =>
          {
            setSubmitting(true);
            submitForm(values, setSubmitting, resetForm, setServerError);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="bg-white shadow-2xl rounded-3xl px-8 pt-6 pb-8 mb-4 ">
              <div className="mb-4">
                <img
                  className="mx-auto h-12 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt="Your Company"
                />
                <h2 className="text-center text-3xl font-bold mt-6 text-gray-900">
                  Sign in to your account
                </h2>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <Field
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  name="name"
                  type="text"
                  placeholder="Name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <Field
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  name="password"
                  type="password"
                  placeholder="Password"
                />
                <ErrorMessage
                  name="password"
                  component="span"
                  style={{ color: "red" }}
                />
              </div>
              {serverError && (
                <div style={{ color: "red", marginBottom: "20px" }}>
                  {serverError}
                </div>
              )}
              <div className="flex items-center justify-center">
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Sign In
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;