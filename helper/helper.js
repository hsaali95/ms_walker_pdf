module.exports = {
  statusMessages: {
    session_expired: "Your session has been expired",
    invalid_credentials: "Invalid username or password",
    unauthorized: "Unauthorized request",
    parameter_missing: "Required parameter missing : ",
    field_missing: "Required field missing : ",
  },

  sucessResponse: (response) => {
    let message = {
      data: response,
      status: true,
      error: null,
    };
    return message;
  },
  errorResponse: (response) => {
    let message = {
      data: null,
      status: false,
      error: response,
    };
    console.log("-----------------Error log Start---------------------------");
    console.log(response);
    console.log("-----------------Error log End-----------------------------");
    return message;
  },

  serverStartLog: (port) => {
    console.log("-----------------------------------------------------------");
    console.log("Server has been started");
    console.log("-----------------------------------------------------------");
    console.log("Date: ", new Date().toISOString());
    console.log("Port: ", port);
    console.log("Environment: ", process.env.NODE_ENV);
    console.log("-----------------------------------------------------------");
  },
};
