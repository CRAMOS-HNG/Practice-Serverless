import {APIGatewayProxyHandler} from 'aws-lambda'
export const handler: APIGatewayProxyHandler = async (event) => {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Test Index with TypeScript!",
          input: event,
        },
        null,
        2
      ),
    };
  };
 