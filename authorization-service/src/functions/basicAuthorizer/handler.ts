const basicAuthorizer = (event, _, callback) => {
  console.log('event', JSON.stringify(event))

  if (event['type'] != 'TOKEN') {
      callback('Unauthorized')
  }

  try {
      const { authorizationToken } = event

      const [, encodedCredentials] = authorizationToken.split(' ') 

      const buffer = Buffer.from(encodedCredentials, 'base64') 
      const [ userName, password ]= buffer.toString('utf-8').split(':')

      console.log(`userName: ${userName}, password: ${password}`)

      const storedPassword = process.env[userName]

      const effect = !storedPassword || storedPassword !== password
          ? "Deny"
          : "Allow" 

      const policy = generatePolicy(encodedCredentials, event.methodArn, effect)

      callback(null, policy)
  } catch(e) {
      callback(`Unauthorized: ${e.message}`)
  }
}

const generatePolicy = (principalId, resource, effect= "Allow" ) => ({
  principalId,
  policyDocument: {
      Version: '2012-10-17',
      Statement: {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
      }
  }
})

  
export const main = basicAuthorizer;