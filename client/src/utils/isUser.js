// this componen for allows only admin permited + hide permission of showing menues on other than admin 
// also to protect url from any user go with leading to those menu contents as in userMenue.jsx 
// i proected in src/route index.js
//#3 03:00:00 very important explaination
//s = value comming as string format
const isUser = (s) => {
  if (s === "USER") {
    return true; //means this is an DELV role
  }

  return false; //not a USER
};

export default isUser;
