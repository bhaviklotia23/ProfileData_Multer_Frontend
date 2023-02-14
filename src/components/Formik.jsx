import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
const FormSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Minimum 3 charecters are required!")
    .max(50, "Maximum 50 charecters are allowed!")
    .required("Name is required"),
  aadharNumber: Yup.string()
    .max(12, "Maximum 12 digits are allowed!")
    .min(12, "Maximum 12 digits are allowed!")
    .required("Aadhar number is required"),
  mobileNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Mobile number is not valid")
    .required("Mobile number is required"),
  // profileImg: Yup.mixed().required("Profile image is required"),
  gender: Yup.string().required("Gender is required"),
  dob: Yup.date().required("Date of birth is required"),
  address: Yup.string().required("Address is required"),
  landmark: Yup.string().required("Address Line 2 is required"),
  area: Yup.string().required("Area is required"),
  city: Yup.string().required("City is required"),
  ward: Yup.string().required("Ward is required"),
});

const Dropdown = ({ options, field, form }) =>
{
  return (
    <select
      {...field}
      name="sex"
      className="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
const Formiks = () =>
{
  const [images, setImages] = useState();
  const [serverError, setServerError] = useState('');

  const navigate = useNavigate();
  const initialValues = {
    name: "",
    aadharNumber: "",
    mobileNumber: "",
    gender: "Male",
    dob: "",
    address: "",
    landmark: "",
    area: "",
    city: "",
    ward: "",
  };

  console.log(images, "images");

  // const handleChange = (e) =>
  // {
  //   setData({ ...data, [e.target.name]: e.target.value });
  // };
  const handleSubmit = async (
    values,
    setSubmitting,
    resetForm,
    setServerError
  ) =>
  {

    try
    {
      const formData = new FormData();
      formData.append("image", images);
      formData.append("name", values.name);
      formData.append("mobileNumber", values.mobileNumber);
      formData.append("gender", values.gender);
      formData.append("aadharNumber", values.aadharNumber);
      formData.append("dob", values.dob);
      formData.append("address", values.address);
      formData.append("landmark", values.landmark);
      formData.append("area", values.area);
      formData.append("city", values.city);
      formData.append("ward", values.ward);



      const res = await axios.post("http://localhost:5000/api/v1/submitform", formData);
      toast.success(res.data.message);
      resetForm();
      setTimeout(() =>
      {
        navigate("/");
        Cookies.remove("tokenShine2023");
      }, 1000);
    } catch (error)
    {
      toast.error(error.response.data.message);
      setServerError(error.response.data.message);
    } finally
    {
      // Set the submitting status to false
      setSubmitting(false);
    }
  };

  const handleCoverImage = async (acceptedFiles) =>
  {
    setImages(acceptedFiles[0]);
  };
  return (
    <>
      <Toaster />
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <Formik
          initialValues={initialValues}
          validationSchema={FormSchema}
          onSubmit={(values, { setSubmitting, resetForm }) =>
          {
            setSubmitting(true);
            handleSubmit(values, setSubmitting, resetForm, setServerError);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="bg-white shadow-2xl rounded-3xl px-8 pt-6 pb-8 mb-4 ">
              <h2 className="text-center text-3xl font-bold mt-6 text-gray-900">
                Please fill your Details
              </h2>
              <div>
                {/* <p>Drag 'n' drop some files here, or click to select files</p> */}
                <Dropzone
                  onDrop={handleCoverImage}
                  multiple={false}
                  maxSize={800000000}
                  accept=".jpeg,.jpg,.png,.gif"
                >
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} className="width-full">
                      {images ? (
                        <div className="bg-gray-circle flex items-center justify-center cover_iimg mt-8">
                          <img
                            alt="person"
                            src={URL.createObjectURL(images)}
                            className="cover_iimg"
                            style={{
                              height: "100px",
                              width: "100px",
                              borderRadius: "50%",
                            }}
                          />
                          <input {...getInputProps()} />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center mt-8">
                          <div
                            className="bg-gray-circle flex items-center justify-center"
                            style={{
                              backgroundColor: "#d1d5db",
                              height: "100px",
                              width: "100px",
                              borderRadius: "50%",
                            }}
                          >
                            <svg
                              class="svg-icon"
                              style={{ width: "60px" }}
                              // style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
                              viewBox="0 0 1024 1024"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M512 597.994667q108.010667 0 225.002667 46.997333t116.992 123.008l0 85.994667-684.010667 0 0-85.994667q0-76.010667 116.992-123.008t225.002667-46.997333zM512 512q-69.994667 0-120-50.005333t-50.005333-120 50.005333-121.002667 120-51.008 120 51.008 50.005333 121.002667-50.005333 120-120 50.005333z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Dropzone>
              </div>
              <div className="mt-8 md:mt grid grid-cols-2 gap-6 mb-6 md:grid sm:grid">
                <div>
                  <label
                    for="first_name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Name
                  </label>
                  <Field
                    // onChange={handleChange}
                    type="text"
                    name="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>

                <div>
                  <label
                    for="aadhar"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Aadhar Number
                  </label>
                  <Field
                    // onChange={handleChange}
                    type="text"
                    name="aadharNumber"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Aadhar Number"
                    maxLength={12}
                  />
                  <ErrorMessage
                    name="aadharNumber"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
                <div>
                  <label
                    for="mobile"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Mobile Number
                  </label>
                  <Field
                    // onChange={handleChange}
                    type="text"
                    name="mobileNumber"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Mobile Number"
                    minLength={10}
                    maxLength={10}
                    pattern="[0-9]*"
                  />
                  <ErrorMessage
                    name="mobileNumber"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>

                <div>
                  <label
                    for="address"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Address Line 1
                  </label>
                  <Field
                    // onChange={handleChange}
                    type="text"
                    name="address"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Address Line 1"
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
                <div>
                  <label
                    for="first_name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Address Line 2
                  </label>
                  <Field
                    // onChange={handleChange}
                    type="text"
                    name="landmark"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Address Line 2"
                  />
                  <ErrorMessage
                    name="landmark"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
                <div>
                  <label
                    for="first_name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Gender
                  </label>
                  <Field
                    name="gender"
                    component={Dropdown}
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                  <ErrorMessage
                    name="gender"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
                <div>
                  <label
                    for="first_name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Date of Birth
                  </label>
                  <Field
                    // onChange={handleChange}
                    type="date"
                    name="dob"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Date of Birth"
                  />
                  <ErrorMessage
                    name="dob"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
                <div>
                  <label
                    for="first_name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Area
                  </label>
                  <Field
                    // onChange={handleChange}
                    type="text"
                    name="area"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Area"
                  />
                  <ErrorMessage
                    name="area"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
                <div>
                  <label
                    for="first_name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    City
                  </label>
                  <Field
                    // onChange={handleChange}
                    type="text"
                    name="city"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="City"
                  />
                  <ErrorMessage
                    name="city"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
                <div>
                  <label
                    for="first_name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Ward
                  </label>
                  <Field
                    // onChange={handleChange}
                    type="text"
                    name="ward"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Ward"
                  />
                  <ErrorMessage
                    name="ward"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center">
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"

                // onClick={(e) => handleSubmit(e)}
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
    </>
  );
};

export default Formiks;
