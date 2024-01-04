exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405, // Method Not Allowed
        body: 'Only GET requests are allowed for this endpoint.',
      };
    }
  
    try {
      // Your getUser logic here
      // Access request data using event.body, event.queryStringParameters, etc.
      // Perform actions like fetching user data from a database or other operations
  
      return {
        statusCode: 200,
        body: JSON.stringify({ user: fetchedUserData }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      };
    }
  };
  