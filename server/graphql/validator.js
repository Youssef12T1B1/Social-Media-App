module.exports.validateRegister = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};

  if (username.trim() === "") errors.username = "Username Must not be Empty";
  if (email.trim() === "") {
    errors.email = "Email Must not be Empty";
  } else {
    const regEx =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (!email.match(regEx)) errors.email = "invalid email address";
  }
  if (password === "") errors.password = "Password Must not be Empty";
  if (confirmPassword.trim() === "")
    errors.confirmPassword = "PasswordConfrim Must not be Empty";
  if (password !== confirmPassword)
    errors.confirmPassword = "Passwords must match";

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLogin = (username, password) => {
  const errors = {};
  if (username.trim() === "") errors.username = "Username Must not be Empty";
  if (password === "") errors.password = "Password Must not be Empty";

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateCreatePost = (content) => {
  const errors = {};
  if (content.trim() === "") errors.post = "Post content Must not be Empty";

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateCreateComment = (body, postId) => {
  const errors = {};
  if (body.trim() === "" || postId.trim() === "")
    errors.comment = "Comment body Must not be Empty";

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateEditComment = (commentId, body, postId) => {
  const errors = {};
  if (body.trim() === "") errors.body = "Comment body Must not be Empty";
  if (postId.trim() === "") errors.post = "Cant edit post with no Id ";
  if (commentId.trim() === "") errors.comment = "Post ID must not be Empty";
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateDeleteComment = (commentId, postId) => {
  const errors = {};
  if (postId.trim() === "") errors.post = "Cant Delete post with no Id ";
  if (commentId.trim() === "") errors.comment = "Comment ID must not be Empty";
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
