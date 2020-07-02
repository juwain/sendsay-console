export const formatJSON = (value, space='\t' ) => {
  return JSON.stringify(value, null, space);
}

export const isEqual = (object1, object2) => {
  return JSON.stringify(object1) === JSON.stringify(object2);
}

export const setPropertyValue = (element, property, value) => {
  element.style.setProperty(property, value);
}

export const validate = (string, type) => {
  const regexpTest = (string, pattern) => {
    return pattern.test(string);
  }

  switch (type) {
    case 'trimmedEmptiness':
      return string.trim().length !== 0;

    case 'email':
      const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regexpTest(string, emailPattern);

    case 'username':
      const usernamePattern = /^[a-zA-Z0-9_]+$/;
      return regexpTest(string, usernamePattern);

    case 'password':
      const passwordPattern = /^[^а-яА-Я]+$/;
      return regexpTest(string, passwordPattern);

    default:
      throw new Error();
  }
}
