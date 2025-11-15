import jwt from "jsonwebtoken"; //used to create the token

const generatedAccessToken = async (userId) => {
  const token = await jwt.sign(
    { id: userId },
    process.env.SECRET_KEY_ACCESS_TOKEN,
    { expiresIn: "5h" }
  );

  return token;
};

export default generatedAccessToken;

// for the loginin purpose i will senf the tokens acces and refresh to the client side
//access is form the login purpose it lives for specifi time limited
