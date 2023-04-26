import React from "react";

const NotFound = (props) => {
    const { staticContext } = props;
    if (staticContext) staticContext.notFound = true;
    return <h1>404 Not Found!</h1>
}

export default NotFound;