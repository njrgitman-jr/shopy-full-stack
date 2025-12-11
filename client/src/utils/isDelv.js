// this componen for allows only admin permited + hide permission of showing menues on other than admin 
// also to protect url from any user go with leading to those menu contents as in userMenue.jsx 
// i proected in src/route index.js
//#3 03:00:00 very important explaination
//s = value comming as string format
const isDelv = (s) => {
  if (s === "DELV") {
    return true; //means this is an isDelv
  }

  return false; //not an isDelv
};

export default isDelv;
