function Validation(formData) {
    let error = {}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const pass_pattern = /^.{8,}$/

    if(formData.name === "") {
        error.name = "Name should not be empty."
    } else {
        error.name = ""
    }

    if(formData.email === "") {
        error.email = "Email should not be empty."
    } else if (!email_pattern.test(formData.email)) {
        error.email = "Enter a valid email address."
    } else {
        error.email = ""
    }

    if(formData.pass === "") {
        error.pass = "Password should not be empty."
    } else if (!pass_pattern.test(formData.pass)) {
        error.pass = "Password must be at least 8 characters."
    } else {
        error.pass = ""
    }

    return error;
}

export default Validation;