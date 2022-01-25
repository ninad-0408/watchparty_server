export const notLoggedIn = (res) => {
    console.log('errornotloggedin', res);
    var err = new Error();
    err.message = "You are not logged in.";
    err.status = 403;
    throw err;
};

export const notAuthorized = (res) => {
    var err = new Error();
    err.message = "You are not authorized.";
    err.status = 401;
    throw err;
};

export const notValid = (res) => {
    var err = new Error();
    err.message = "You request is not valid.";
    err.status = 400;
    throw err;
};

export const notFound = (res, name) => {
    var err = new Error();
    err.message = `${name} not found.`;
    err.status = 404;
    throw err;
};

export const dataUnaccesable = (res) => {
    var err = new Error();
    err.message = "Unable to connect to database rightnow. Try again later."
    err.status = 503;
    throw err;
};

export const serverError = (res) => {
    var err = new Error();
    err.message = "Unable to process your request right now. Try again later."
    err.status = 500;
    throw err;
};

export const wrongPassword = (res) => {
    var err = new Error();
    err.message = "Invalid Credentials.";
    err.status = 403;
    throw err;
}
