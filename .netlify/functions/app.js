// app.js (inside the Netlify functions directory)

// Define the getUser function
exports.getUser = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: 'Only GET requests are allowed for this endpoint.',
    };
  }

  try {
    // Your getUser logic here
    // Access request data using event.body, event.queryStringParameters, etc.
    // Perform actions like fetching user data from a database or other operations

    const userData = { id: 1, username: 'john_doe' }; // Example user data

    return {
      statusCode: 200,
      body: JSON.stringify(userData),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};