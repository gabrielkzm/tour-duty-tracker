let required = (attribute) => {
  return v => !!v || `${attribute} is required.`
}

let requiredBoolean = (attribute) => {
  return v => v != null || `${attribute} is required.`
}

let requiredWithNA = (attribute) => {
  return v => !!v || `${attribute} is required, consider selecting N/A`
}

let requiredWithOthers = (attribute) => {
  return v => !!v || `${attribute} is required, consider selecting Others.`
}

let minLength = (attribute, length) => {
  return v => (v && v.length >= length) || `${attribute} must be greater than ${length} characters.`
}

let maxLength = (attribute, length) => {
  return v => (v && v.length <= length) || `${attribute} must be lesser than ${length} characters.`
}

let exactLength = (attribute, length) => {
  return v => (v && v.length == length) || `${attribute} must be equal to ${length} characters.`
}

let validPhone = (attribute, length) => {
  return v => (v && v.toString().length == length) || `${attribute} must be equal to ${length} characters.`
}

let validEmail = (attribute) => {
  return v => /.+@.+/.test(v) || `${attribute} must be a valid email.`
}

let validPassword = () => {
  return v => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/.test(v) || 'Password must be between 8 and 16 characters with at least one numeric digt, one uppercase and one lowercase letter.'
}


export default{
  required,
  requiredWithNA,
  requiredWithOthers,
  minLength,
  exactLength,
  validEmail,
  maxLength,
  validPassword,
  validPhone,
  requiredBoolean
}